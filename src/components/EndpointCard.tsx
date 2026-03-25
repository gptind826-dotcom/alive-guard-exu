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

  const statusLabel = isOnline ? "ONLINE" : isPending ? "PENDING" : "OFFLINE";
  const boxClass = isOnline ? "neon-box-green" : isPending ? "" : "neon-box-pink";

  return (
    <div className={`glass rounded-2xl p-5 transition-all hover:scale-[1.02] group ${boxClass}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Circle
              className={`w-2.5 h-2.5 shrink-0 ${isOnline ? "animate-pulse-neon" : ""}`}
              fill={isOnline ? "hsl(var(--neon-green))" : isPending ? "hsl(var(--muted-foreground))" : "hsl(var(--destructive))"}
              stroke="none"
              style={{ color: isOnline ? "hsl(var(--neon-green))" : isPending ? "hsl(var(--muted-foreground))" : "hsl(var(--destructive))" }}
            />
            <span
              className="font-display text-[9px] font-bold tracking-[0.2em]"
              style={{
                color: isOnline ? "hsl(var(--neon-green))" : isPending ? "hsl(var(--muted-foreground))" : "hsl(var(--destructive))",
              }}
            >
              {statusLabel}
            </span>
          </div>
          <h3 className="font-display text-sm font-bold tracking-wide text-foreground truncate">
            {endpoint.name}
          </h3>
          <p className="font-mono text-[10px] text-muted-foreground truncate mt-0.5">
            {endpoint.url}
          </p>
        </div>
        <button
          onClick={() => onRemove(endpoint.id)}
          className="ml-2 p-2 text-muted-foreground/40 hover:text-accent hover:bg-accent/10 transition-all rounded-xl opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-muted/30 border border-border/50">
          <Activity className="w-3.5 h-3.5 text-primary mb-1" />
          <span className="font-mono text-sm font-bold text-primary">{uptime}%</span>
          <span className="font-display text-[8px] tracking-wider uppercase text-muted-foreground">Uptime</span>
        </div>
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-muted/30 border border-border/50">
          <Clock className="w-3.5 h-3.5 mb-1" style={{ color: "hsl(var(--neon-cyan))" }} />
          <span className="font-mono text-sm font-bold" style={{ color: "hsl(var(--neon-cyan))" }}>{avgResponseTime}ms</span>
          <span className="font-display text-[8px] tracking-wider uppercase text-muted-foreground">Speed</span>
        </div>
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-muted/30 border border-border/50">
          <Zap className="w-3.5 h-3.5 mb-1" style={{ color: "hsl(var(--neon-yellow))" }} />
          <span className="font-mono text-sm font-bold" style={{ color: "hsl(var(--neon-yellow))" }}>{totalPings}</span>
          <span className="font-display text-[8px] tracking-wider uppercase text-muted-foreground">Pings</span>
        </div>
      </div>

      {lastPing && (
        <p className="font-mono text-[9px] text-muted-foreground/50 mt-3 text-right">
          Last: {lastPing.timestamp.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
