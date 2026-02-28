import { useState, useCallback, useRef, useEffect } from "react";
import type { ApiEndpoint, PingResult, EndpointStats } from "@/types/api";

const PING_INTERVAL = 30000; // 30 seconds
const STORAGE_KEY = "keepalive-endpoints";
const LOGS_KEY = "keepalive-logs";

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function loadEndpoints(): ApiEndpoint[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored).map((e: any) => ({
        ...e,
        addedAt: new Date(e.addedAt),
      }));
    }
  } catch {}
  return [];
}

function saveEndpoints(endpoints: ApiEndpoint[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(endpoints));
}

function loadLogs(): PingResult[] {
  try {
    const stored = localStorage.getItem(LOGS_KEY);
    if (stored) {
      return JSON.parse(stored).map((l: any) => ({
        ...l,
        timestamp: new Date(l.timestamp),
      }));
    }
  } catch {}
  return [];
}

function saveLogs(logs: PingResult[]) {
  // Keep last 500 logs
  const trimmed = logs.slice(-500);
  localStorage.setItem(LOGS_KEY, JSON.stringify(trimmed));
}

export function useKeepAlive() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(loadEndpoints);
  const [logs, setLogs] = useState<PingResult[]>(loadLogs);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const addEndpoint = useCallback((url: string, name?: string) => {
    const endpoint: ApiEndpoint = {
      id: generateId(),
      url: url.trim(),
      name: name || new URL(url.trim()).hostname,
      addedAt: new Date(),
    };
    setEndpoints((prev) => {
      const next = [...prev, endpoint];
      saveEndpoints(next);
      return next;
    });
    return endpoint;
  }, []);

  const removeEndpoint = useCallback((id: string) => {
    setEndpoints((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveEndpoints(next);
      return next;
    });
  }, []);

  const pingEndpoint = useCallback(async (endpoint: ApiEndpoint): Promise<PingResult> => {
    const start = performance.now();
    try {
      const response = await fetch(endpoint.url, {
        method: "GET",
        mode: "no-cors",
        cache: "no-cache",
      });
      const elapsed = Math.round(performance.now() - start);
      // no-cors returns opaque response with status 0
      const isOpaque = response.type === "opaque";
      return {
        id: generateId(),
        endpointId: endpoint.id,
        url: endpoint.url,
        status: isOpaque ? "online" : response.ok ? "online" : "error",
        statusCode: isOpaque ? 200 : response.status,
        responseTime: elapsed,
        timestamp: new Date(),
        message: isOpaque ? "Request sent (opaque response - CORS)" : `HTTP ${response.status}`,
      };
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      return {
        id: generateId(),
        endpointId: endpoint.id,
        url: endpoint.url,
        status: "offline",
        statusCode: null,
        responseTime: elapsed,
        timestamp: new Date(),
        message: err.message || "Network error",
      };
    }
  }, []);

  const pingAll = useCallback(async () => {
    const currentEndpoints = loadEndpoints();
    if (currentEndpoints.length === 0) return;

    const results = await Promise.all(currentEndpoints.map(pingEndpoint));
    setLogs((prev) => {
      const next = [...prev, ...results];
      saveLogs(next);
      return next;
    });
  }, [pingEndpoint]);

  const clearLogs = useCallback(() => {
    setLogs([]);
    localStorage.removeItem(LOGS_KEY);
  }, []);

  // Auto-ping on mount and interval
  useEffect(() => {
    if (isRunning && endpoints.length > 0) {
      // Initial ping
      pingAll();
      intervalRef.current = setInterval(pingAll, PING_INTERVAL);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, endpoints.length, pingAll]);

  const getStats = useCallback(
    (endpoint: ApiEndpoint): EndpointStats => {
      const epLogs = logs.filter((l) => l.endpointId === endpoint.id);
      const successLogs = epLogs.filter((l) => l.status === "online");
      const avgTime =
        successLogs.length > 0
          ? Math.round(successLogs.reduce((a, l) => a + (l.responseTime || 0), 0) / successLogs.length)
          : 0;
      return {
        endpoint,
        lastPing: epLogs[epLogs.length - 1] || null,
        uptime: epLogs.length > 0 ? Math.round((successLogs.length / epLogs.length) * 100) : 0,
        avgResponseTime: avgTime,
        totalPings: epLogs.length,
        successPings: successLogs.length,
      };
    },
    [logs]
  );

  return {
    endpoints,
    logs,
    isRunning,
    setIsRunning,
    addEndpoint,
    removeEndpoint,
    pingAll,
    clearLogs,
    getStats,
  };
}
