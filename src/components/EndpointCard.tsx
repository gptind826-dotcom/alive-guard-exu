import { Trash2, Activity, Clock, Zap, Circle } from "lucide-react";
import type { EndpointStats } from "@/types/api";

interface EndpointCardProps {
  stats: EndpointStats;
  onRemove: (id: string) => void;
}

export function EndpointCard({ stats, onRemove }: EndpointCardProps) {
  const { endpoint, lastPing, uptime, avgResponseTime, totalPings } = stats;
  const isOnline = lastPing?.status === "online";
  const isPending = !lastPing;

  const statusLabel = isOnline ? "Online" : isPending ? "Pending" : "Offline";

  return (
    <div className="glass rounded-2xl p-5 transition-all hover:shadow-lg group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Circle
              className={`w-2.5 h-2.5 shrink-0 ${isOnline ? "animate-pulse-neon" : ""}`}
              fill={isOnline ? "hsl(var(--accent))" : isPending ? "hsl(var(--muted-foreground))" : "hsl(var(--destructive))"}
              stroke="none"
            />
            <span
              className="font-mono text-[10px] font-semibold uppercase tracking-wider"
              style={{
                color: isOnline ? "hsl(var(--accent))" : isPending ? "hsl(var(--muted-foreground))" : "hsl(var(--destructive))",
              }}
            >
              {statusLabel}
            </span>
          </div>
          <h3 className="font-display text-sm font-bold text-foreground truncate">
            {endpoint.name}
          </h3>
          <p className="font-mono text-[10px] text-muted-foreground truncate mt-0.5">
            {endpoint.url}
          </p>
        </div>
        <button
          onClick={() => onRemove(endpoint.id)}
          className="ml-2 p-2 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-primary/5 border border-primary/10">
          <Activity className="w-3.5 h-3.5 text-primary mb-1" />
          <span className="font-mono text-sm font-bold text-primary">{uptime}%</span>
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Uptime</span>
        </div>
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-secondary/5 border border-secondary/10">
          <Clock className="w-3.5 h-3.5 text-secondary mb-1" />
          <span className="font-mono text-sm font-bold text-secondary">{avgResponseTime}ms</span>
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Avg</span>
        </div>
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-accent/5 border border-accent/10">
          <Zap className="w-3.5 h-3.5 text-accent mb-1" />
          <span className="font-mono text-sm font-bold text-accent">{totalPings}</span>
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Pings</span>
        </div>
      </div>

      {lastPing && (
        <p className="font-mono text-[9px] text-muted-foreground/60 mt-3 text-right">
          Last pinged {lastPing.timestamp.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
