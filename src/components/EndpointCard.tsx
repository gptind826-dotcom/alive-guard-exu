import { Trash2, Activity, Clock, Zap } from "lucide-react";
import type { EndpointStats } from "@/types/api";

interface EndpointCardProps {
  stats: EndpointStats;
  onRemove: (id: string) => void;
}

export function EndpointCard({ stats, onRemove }: EndpointCardProps) {
  const { endpoint, lastPing, uptime, avgResponseTime, totalPings } = stats;
  const isOnline = lastPing?.status === "online";

  const statusColor = isOnline ? "hsl(160 70% 42%)" : lastPing ? "hsl(0 72% 55%)" : "hsl(40 90% 50%)";
  const statusLabel = isOnline ? "Online" : lastPing ? "Offline" : "Pending";

  return (
    <div className="glass rounded-xl p-4 transition-all hover:scale-[1.01]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm font-semibold text-foreground truncate">
            {endpoint.name}
          </h3>
          <p className="font-mono text-[11px] text-muted-foreground truncate mt-0.5">
            {endpoint.url}
          </p>
        </div>
        <button
          onClick={() => onRemove(endpoint.id)}
          className="ml-2 p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-2 h-2 rounded-full ${isOnline ? "animate-pulse-neon" : ""}`}
          style={{ backgroundColor: statusColor }}
        />
        <span className="font-mono text-xs font-medium" style={{ color: statusColor }}>
          {statusLabel}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2 rounded-lg bg-primary/5">
          <Activity className="w-3 h-3 text-primary mb-1" />
          <span className="font-mono text-xs font-medium text-primary">{uptime}%</span>
          <span className="font-mono text-[10px] text-muted-foreground">Uptime</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/5">
          <Clock className="w-3 h-3 text-secondary mb-1" />
          <span className="font-mono text-xs font-medium text-secondary">{avgResponseTime}ms</span>
          <span className="font-mono text-[10px] text-muted-foreground">Avg</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-accent/5">
          <Zap className="w-3 h-3 text-accent mb-1" />
          <span className="font-mono text-xs font-medium text-accent">{totalPings}</span>
          <span className="font-mono text-[10px] text-muted-foreground">Pings</span>
        </div>
      </div>

      {lastPing && (
        <p className="font-mono text-[10px] text-muted-foreground mt-2 text-right">
          Last: {lastPing.timestamp.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
