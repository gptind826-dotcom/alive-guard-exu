import { Trash2, Activity, Clock, Zap } from "lucide-react";
import type { EndpointStats } from "@/types/api";

interface EndpointCardProps {
  stats: EndpointStats;
  onRemove: (id: string) => void;
}

export function EndpointCard({ stats, onRemove }: EndpointCardProps) {
  const { endpoint, lastPing, uptime, avgResponseTime, totalPings } = stats;
  const isOnline = lastPing?.status === "online";
  const statusColor = isOnline ? "neon-green" : lastPing ? "neon-red" : "neon-yellow";
  const statusBorder = isOnline ? "neon-border-green" : "neon-border-magenta";

  return (
    <div className={`relative border rounded-sm p-4 bg-card transition-all ${statusBorder}`}>
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline rounded-sm opacity-30" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-sm uppercase tracking-wider text-foreground truncate">
              {endpoint.name}
            </h3>
            <p className="font-mono text-xs text-muted-foreground truncate mt-1">
              {endpoint.url}
            </p>
          </div>
          <button
            onClick={() => onRemove(endpoint.id)}
            className="ml-2 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full bg-${statusColor === "neon-green" ? "neon-green" : statusColor === "neon-red" ? "neon-red" : "neon-yellow"} ${isOnline ? "animate-pulse-neon" : ""}`}
            style={{ backgroundColor: isOnline ? "hsl(150 100% 50%)" : lastPing ? "hsl(0 100% 55%)" : "hsl(50 100% 55%)" }}
          />
          <span className={`font-mono text-xs uppercase tracking-wider`}
            style={{ color: isOnline ? "hsl(150 100% 50%)" : lastPing ? "hsl(0 100% 55%)" : "hsl(50 100% 55%)" }}
          >
            {isOnline ? "ONLINE" : lastPing ? "OFFLINE" : "PENDING"}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 bg-muted/50 rounded-sm">
            <Activity className="w-3 h-3 text-primary mb-1" />
            <span className="font-mono text-xs text-primary">{uptime}%</span>
            <span className="font-mono text-[10px] text-muted-foreground">UPTIME</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted/50 rounded-sm">
            <Clock className="w-3 h-3 text-secondary mb-1" />
            <span className="font-mono text-xs text-secondary">{avgResponseTime}ms</span>
            <span className="font-mono text-[10px] text-muted-foreground">AVG</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted/50 rounded-sm">
            <Zap className="w-3 h-3 text-neon-yellow mb-1" />
            <span className="font-mono text-xs text-neon-yellow">{totalPings}</span>
            <span className="font-mono text-[10px] text-muted-foreground">PINGS</span>
          </div>
        </div>

        {lastPing && (
          <p className="font-mono text-[10px] text-muted-foreground mt-2 text-right">
            Last: {lastPing.timestamp.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}
