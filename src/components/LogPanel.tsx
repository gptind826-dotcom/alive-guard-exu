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
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-display text-sm font-bold text-foreground">
            System Logs
          </span>
          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {logs.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive text-xs font-mono transition-colors px-2 py-1 rounded-lg hover:bg-destructive/10"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      <ScrollArea className="h-72">
        <div className="p-4 space-y-0.5">
          {reversed.length === 0 && (
            <p className="font-mono text-xs text-muted-foreground text-center py-10">
              No logs yet — waiting for ping data...
            </p>
          )}
          {reversed.map((log) => (
            <div key={log.id} className="flex items-start gap-2 font-mono text-[11px] leading-relaxed py-0.5 hover:bg-muted/30 px-2 rounded-lg transition-colors">
              <span className="text-muted-foreground/60 shrink-0">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span
                className="shrink-0 font-semibold"
                style={{
                  color:
                    log.status === "online"
                      ? "hsl(var(--accent))"
                      : log.status === "offline"
                      ? "hsl(var(--destructive))"
                      : "hsl(40 90% 50%)",
                }}
              >
                {log.status === "online" ? "✓ OK" : log.status === "offline" ? "✗ DOWN" : "⚠ ERR"}
              </span>
              <span className="text-primary truncate">{log.url}</span>
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
