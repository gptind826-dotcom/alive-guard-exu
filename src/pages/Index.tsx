import { useKeepAlive } from "@/hooks/useKeepAlive";
import { AddEndpointForm } from "@/components/AddEndpointForm";
import { EndpointCard } from "@/components/EndpointCard";
import { LogPanel } from "@/components/LogPanel";
import { Power, PowerOff, RefreshCw, Shield } from "lucide-react";

const Index = () => {
  const {
    endpoints,
    logs,
    isRunning,
    setIsRunning,
    addEndpoint,
    removeEndpoint,
    pingAll,
    clearLogs,
    getStats,
  } = useKeepAlive();

  const onlineCount = endpoints.filter((ep) => {
    const stats = getStats(ep);
    return stats.lastPing?.status === "online";
  }).length;

  return (
    <div className="min-h-screen bg-background cyber-grid relative">
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanline pointer-events-none z-50 opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary animate-pulse-neon" />
            <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-wider neon-text-cyan">
              XSU Codex
            </h1>
          </div>
          <p className="font-mono text-xs text-muted-foreground ml-11">
            // Autonomous endpoint keep-alive system // interval: 60s
          </p>

          {/* Status bar */}
          <div className="flex flex-wrap items-center gap-4 mt-4 ml-11">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isRunning ? "hsl(150 100% 50%)" : "hsl(0 100% 55%)" }}
              />
              <span className="font-mono text-xs text-muted-foreground">
                ENGINE: {isRunning ? "ACTIVE" : "HALTED"}
              </span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              NODES: {endpoints.length}
            </span>
            <span className="font-mono text-xs" style={{ color: "hsl(150 100% 50%)" }}>
              ONLINE: {onlineCount}/{endpoints.length}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              LOGS: {logs.length}
            </span>
          </div>
        </header>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-sm font-display text-[10px] uppercase tracking-widest transition-all ${
              isRunning
                ? "border-neon-green text-neon-green hover:bg-neon-green/10"
                : "border-destructive text-destructive hover:bg-destructive/10"
            }`}
            style={{
              borderColor: isRunning ? "hsl(150 100% 50%)" : "hsl(0 100% 55%)",
              color: isRunning ? "hsl(150 100% 50%)" : "hsl(0 100% 55%)",
            }}
          >
            {isRunning ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
            {isRunning ? "Running" : "Stopped"}
          </button>
          <button
            onClick={pingAll}
            className="flex items-center gap-2 px-3 py-1.5 border border-primary text-primary rounded-sm font-display text-[10px] uppercase tracking-widest hover:bg-primary/10 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Ping All
          </button>
        </div>

        {/* Add endpoint */}
        <div className="mb-8 p-4 border border-border rounded-sm bg-card/50">
          <h2 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-3">
            + Register Endpoint
          </h2>
          <AddEndpointForm onAdd={addEndpoint} />
        </div>

        {/* Endpoint grid */}
        {endpoints.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Monitored Nodes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {endpoints.map((ep) => (
                <EndpointCard key={ep.id} stats={getStats(ep)} onRemove={removeEndpoint} />
              ))}
            </div>
          </div>
        )}

        {/* Logs */}
        <LogPanel logs={logs} onClear={clearLogs} />

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="font-mono text-[10px] text-muted-foreground">
            XSU CODEX // INTERVAL: 60s // MODE: KEEP-ALIVE // 24/7
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
