export interface ApiEndpoint {
  id: string;
  url: string;
  name: string;
  addedAt: Date;
}

export interface PingResult {
  id: string;
  endpointId: string;
  url: string;
  status: "online" | "offline" | "error";
  statusCode: number | null;
  responseTime: number | null;
  timestamp: Date;
  message: string;
}

export interface EndpointStats {
  endpoint: ApiEndpoint;
  lastPing: PingResult | null;
  uptime: number; // percentage
  avgResponseTime: number;
  totalPings: number;
  successPings: number;
}
