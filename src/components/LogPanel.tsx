import { ScrollArea } from "@/components/ui/scroll-area";
import type { PingResult } from "@/types/api";
import { Trash2 } from "lucide-react";

interface LogPanelProps {
  logs: PingResult[];
  onClear: () => void;
}

export function LogPanel({ logs, onClear }: LogPanelProps) {
  const reversed = [...logs].reverse();

  return (
    <div className="border border-border rounded-sm bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-neon" style={{ backgroundColor: "hsl(150 100% 50%)" }} />
          <span className="font-display text-xs uppercase tracking-widest text-foreground">
            System Logs
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-muted-foreground hover:text-destructive text-xs font-mono transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          FLUSH
        </button>
      </div>

      <ScrollArea className="h-80">
        <div className="p-3 space-y-0.5">
          {reversed.length === 0 && (
            <p className="font-mono text-xs text-muted-foreground text-center py-8">
              // Awaiting ping data...
            </p>
          )}
          {reversed.map((log) => (
            <div key={log.id} className="flex items-start gap-2 font-mono text-[11px] leading-relaxed">
              <span className="text-muted-foreground shrink-0">
                [{log.timestamp.toLocaleTimeString()}]
              </span>
              <span
                className="shrink-0"
                style={{
                  color:
                    log.status === "online"
                      ? "hsl(150 100% 50%)"
                      : log.status === "offline"
                      ? "hsl(0 100% 55%)"
                      : "hsl(50 100% 55%)",
                }}
              >
                {log.status === "online" ? "✓ OK" : log.status === "offline" ? "✗ DOWN" : "⚠ ERR"}
              </span>
              <span className="text-primary truncate">{log.url}</span>
              {log.responseTime !== null && (
                <span className="text-secondary shrink-0">{log.responseTime}ms</span>
              )}
              <span className="text-muted-foreground truncate">{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
