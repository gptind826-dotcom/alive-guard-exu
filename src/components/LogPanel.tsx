import { ScrollArea } from "@/components/ui/scroll-area";
import type { PingResult } from "@/types/api";
import { Trash2, Terminal } from "lucide-react";

interface LogPanelProps {
  logs: PingResult[];
  onClear: () => void;
}

export function LogPanel({ logs, onClear }: LogPanelProps) {
  const reversed = [...logs].reverse();

  return (
    <div className="glass rounded-2xl overflow-hidden neon-box-purple">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4" style={{ color: "hsl(var(--neon-cyan))" }} />
          <span className="font-display text-[10px] font-bold tracking-wider uppercase" style={{ color: "hsl(var(--neon-cyan))" }}>
            System Logs
          </span>
          <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full gradient-cyber text-white">
            {logs.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-accent text-[10px] font-display font-bold tracking-wider uppercase transition-colors px-2 py-1 rounded-lg hover:bg-accent/10"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      <ScrollArea className="h-72">
        <div className="p-4 space-y-0.5">
          {reversed.length === 0 && (
            <p className="font-mono text-xs text-muted-foreground text-center py-10">
              <span style={{ color: "hsl(var(--neon-purple) / 0.5)" }}>▸</span> Awaiting ping data...
            </p>
          )}
          {reversed.map((log) => (
            <div key={log.id} className="flex items-start gap-2 font-mono text-[11px] leading-relaxed py-0.5 hover:bg-muted/20 px-2 rounded-lg transition-colors">
              <span className="text-muted-foreground/50 shrink-0">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span
                className="shrink-0 font-bold"
                style={{
                  color:
                    log.status === "online"
                      ? "hsl(var(--neon-green))"
                      : log.status === "offline"
                      ? "hsl(var(--destructive))"
                      : "hsl(var(--neon-yellow))",
                }}
              >
                {log.status === "online" ? "✓ OK" : log.status === "offline" ? "✗ DOWN" : "⚠ ERR"}
              </span>
              <span className="truncate" style={{ color: "hsl(var(--neon-cyan))" }}>{log.url}</span>
              {log.responseTime !== null && (
                <span className="text-muted-foreground shrink-0">{log.responseTime}ms</span>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
