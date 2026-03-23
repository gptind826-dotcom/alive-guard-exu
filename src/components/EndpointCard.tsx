import { Trash2, Activity, Clock, Zap } from "lucide-react";
import type { EndpointStats } from "@/types/api";

interface EndpointCardProps {
  stats: EndpointStats;
  onRemove: (id: string) => void;
}

export function EndpointCard({ stats, onRemove }: EndpointCardProps) {
  const { endpoint, lastPing, uptime, avgResponseTime, totalPings } = stats;
  const isOnline = lastPing?.status === "online";

  const statusColor = isOnline ? "var(--neon-green)" : lastPing ? "var(--neon-red)" : "var(--neon-yellow)";
  const statusLabel = isOnline ? "Online" : lastPing ? "Offline" : "Pending";

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm font-bold text-foreground truncate">
            {endpoint.name}
          </h3>
          <p className="font-mono text-[10px] text-muted-foreground truncate mt-0.5">
            {endpoint.url}
          </p>
        </div>
        <button
          onClick={() => onRemove(endpoint.id)}
          className="ml-2 p-1.5 text-muted-foreground/50 hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full" style={{ backgroundColor: `hsl(${statusColor} / 0.1)` }}>
          <div
            className={`w-2 h-2 rounded-full ${isOnline ? "status-pulse" : ""}`}
            style={{ backgroundColor: `hsl(${statusColor})` }}
          />
          <span className="font-mono text-[11px] font-semibold" style={{ color: `hsl(${statusColor})` }}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-primary/5 border border-primary/10">
          <Activity className="w-3.5 h-3.5 text-primary mb-1.5" />
          <span className="font-mono text-xs font-bold text-primary">{uptime}%</span>
          <span className="font-mono text-[9px] text-muted-foreground mt-0.5">Uptime</span>
        </div>
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-secondary/5 border border-secondary/10">
          <Clock className="w-3.5 h-3.5 text-secondary mb-1.5" />
          <span className="font-mono text-xs font-bold text-secondary">{avgResponseTime}ms</span>
          <span className="font-mono text-[9px] text-muted-foreground mt-0.5">Avg</span>
        </div>
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-accent/5 border border-accent/10">
          <Zap className="w-3.5 h-3.5 text-accent mb-1.5" />
          <span className="font-mono text-xs font-bold text-accent">{totalPings}</span>
          <span className="font-mono text-[9px] text-muted-foreground mt-0.5">Pings</span>
        </div>
      </div>

      {lastPing && (
        <p className="font-mono text-[9px] text-muted-foreground/60 mt-3 text-right">
          Last: {lastPing.timestamp.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
