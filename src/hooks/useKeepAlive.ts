import { useState, useCallback, useRef, useEffect } from "react";
import type { ApiEndpoint, PingResult, EndpointStats } from "@/types/api";
import { supabase } from "@/integrations/supabase/client";

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export function useKeepAlive(userId: string | undefined, pingInterval: number = 60) {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [logs, setLogs] = useState<PingResult[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadEndpoints = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("endpoints")
      .select("*")
      .eq("is_active", true)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (data) {
      setEndpoints(
        data.map((e: any) => ({
          id: e.id,
          url: e.url,
          name: e.name,
          addedAt: new Date(e.created_at),
        }))
      );
    }
  }, [userId]);

  const loadLogs = useCallback(async () => {
    if (!userId) return;
    const { data: userEndpoints } = await supabase
      .from("endpoints")
      .select("id")
      .eq("user_id", userId);
    
    if (!userEndpoints?.length) { setLogs([]); return; }
    
    const ids = userEndpoints.map((e: any) => e.id);
    const { data } = await supabase
      .from("ping_logs")
      .select("*")
      .in("endpoint_id", ids)
      .order("created_at", { ascending: false })
      .limit(500);
    if (data) {
      setLogs(
        data.reverse().map((l: any) => ({
          id: l.id,
          endpointId: l.endpoint_id,
          url: l.url,
          status: l.status as "online" | "offline" | "error",
          statusCode: l.status_code,
          responseTime: l.response_time,
          timestamp: new Date(l.created_at),
          message: l.message || "",
        }))
      );
    }
  }, [userId]);

  useEffect(() => {
    loadEndpoints();
    loadLogs();
  }, [loadEndpoints, loadLogs]);

  const addEndpoint = useCallback(async (url: string, name?: string) => {
    if (!userId) return;
    const label = name || new URL(url.trim()).hostname;
    const { data, error } = await supabase
      .from("endpoints")
      .insert({ url: url.trim(), name: label, is_active: true, user_id: userId })
      .select()
      .single();
    if (data && !error) {
      const newEp = { id: data.id, url: data.url, name: data.name, addedAt: new Date(data.created_at) };
      setEndpoints((prev) => [...prev, newEp]);
      // Immediately ping the new endpoint
      const result = await pingEndpoint(newEp);
      setLogs((prev) => [...prev, result]);
    }
  }, [userId]);

  const removeEndpoint = useCallback(async (id: string) => {
    await supabase.from("endpoints").delete().eq("id", id);
    setEndpoints((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const pingEndpoint = useCallback(async (endpoint: ApiEndpoint): Promise<PingResult> => {
    const start = performance.now();
    let result: PingResult;
    try {
      const response = await fetch(endpoint.url, { method: "GET", mode: "no-cors", cache: "no-cache" });
      const elapsed = Math.round(performance.now() - start);
      const isOpaque = response.type === "opaque";
      result = {
        id: generateId(),
        endpointId: endpoint.id,
        url: endpoint.url,
        status: isOpaque ? "online" : response.ok ? "online" : "error",
        statusCode: isOpaque ? 200 : response.status,
        responseTime: elapsed,
        timestamp: new Date(),
        message: isOpaque ? "Request sent (opaque - CORS)" : `HTTP ${response.status}`,
      };
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      result = {
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

    // Persist to database
    await supabase.from("ping_logs").insert({
      endpoint_id: result.endpointId,
      url: result.url,
      status: result.status,
      status_code: result.statusCode,
      response_time: result.responseTime,
      message: result.message,
    });

    return result;
  }, []);

  const pingAll = useCallback(async () => {
    if (endpoints.length === 0) return [];
    const results = await Promise.all(endpoints.map(pingEndpoint));
    setLogs((prev) => [...prev, ...results]);
    setTimeout(loadLogs, 2000);
    return results;
  }, [endpoints, pingEndpoint, loadLogs]);

  const clearLogs = useCallback(async () => {
    setLogs([]);
    await supabase.from("ping_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }, []);

  useEffect(() => {
    if (isRunning && endpoints.length > 0) {
      intervalRef.current = setInterval(pingAll, pingInterval * 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, endpoints.length, pingAll, pingInterval]);

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

  return { endpoints, logs, isRunning, setIsRunning, addEndpoint, removeEndpoint, pingAll, clearLogs, getStats };
}
