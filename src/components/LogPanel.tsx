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
    <div className="glass rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-neon" />
          <span className="font-display text-sm font-semibold text-foreground">
            System Logs
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-muted-foreground hover:text-destructive text-xs font-mono transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      <ScrollArea className="h-80">
        <div className="p-4 space-y-1">
          {reversed.length === 0 && (
            <p className="font-mono text-xs text-muted-foreground text-center py-8">
              Waiting for ping data...
            </p>
          )}
          {reversed.map((log) => (
            <div key={log.id} className="flex items-start gap-2 font-mono text-[11px] leading-relaxed">
              <span className="text-muted-foreground shrink-0">
                [{log.timestamp.toLocaleTimeString()}]
              </span>
              <span
                className="shrink-0 font-medium"
                style={{
                  color:
                    log.status === "online"
                      ? "hsl(160 70% 42%)"
                      : log.status === "offline"
                      ? "hsl(0 72% 55%)"
                      : "hsl(40 90% 50%)",
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
