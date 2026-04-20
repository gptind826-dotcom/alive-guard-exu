import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useKeepAlive } from "@/hooks/useKeepAlive";
import { useNotifications } from "@/hooks/useNotifications";
import { AddEndpointForm } from "@/components/AddEndpointForm";
import { EndpointCard } from "@/components/EndpointCard";
import { LogPanel } from "@/components/LogPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { UserMenu } from "@/components/UserMenu";
import { ResponseChart } from "@/components/ResponseChart";
import { Power, PowerOff, RefreshCw, Shield, BarChart3, Wifi, WifiOff, Activity, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, updateProfile } = useProfile(user?.id);
  const { setTheme } = useTheme();
  const [showCharts, setShowCharts] = useState(false);

  const pingInterval = profile?.ping_interval || 60;

  const {
    endpoints, logs, isRunning, setIsRunning,
    addEndpoint, removeEndpoint, pingAll, clearLogs, getStats,
  } = useKeepAlive(user?.id, pingInterval);

  const { checkForOffline, requestPermission } = useNotifications(
    profile?.sound_enabled ?? true,
    profile?.notifications_enabled ?? true
  );

  useEffect(() => {
    if (profile?.theme) setTheme(profile.theme);
  }, [profile?.theme, setTheme]);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const handlePingAll = async () => {
    const results = await pingAll();
    if (results) checkForOffline(results);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background cyber-grid flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl gradient-cyber flex items-center justify-center animate-pulse">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <p className="font-mono text-xs text-secondary uppercase tracking-widest">Initializing...</p>
        </div>
      </div>
    );
  }

  const onlineCount = endpoints.filter((ep) => getStats(ep).lastPing?.status === "online").length;
  const offlineCount = endpoints.filter((ep) => {
    const s = getStats(ep).lastPing?.status;
    return s === "offline" || s === "error";
  }).length;

  return (
    <div className="min-h-screen bg-background cyber-grid relative scanline">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl gradient-cyber flex items-center justify-center shadow-lg shadow-primary/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-black tracking-wider neon-glow-purple" style={{ color: "hsl(var(--neon-purple))" }}>
                  XSU Codex
                </h1>
                <p className="font-mono text-[11px] mt-0.5" style={{ color: "hsl(var(--neon-cyan))" }}>
                  <span className="opacity-60">▸</span> keep-alive · {pingInterval}s cycle
                </p>
              </div>
            </div>
          </div>

          {/* Status chips */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <div className={`glass rounded-full px-4 py-1.5 flex items-center gap-2 ${isRunning ? "neon-box-green" : "neon-box-pink"}`}>
              <div
                className="w-2 h-2 rounded-full animate-pulse-neon"
                style={{ backgroundColor: isRunning ? "hsl(var(--neon-green))" : "hsl(var(--destructive))", color: isRunning ? "hsl(var(--neon-green))" : "hsl(var(--destructive))" }}
              />
              <span className="font-display text-[10px] font-bold tracking-wider" style={{ color: isRunning ? "hsl(var(--neon-green))" : "hsl(var(--destructive))" }}>
                {isRunning ? "ACTIVE" : "PAUSED"}
              </span>
            </div>
            <div className="glass rounded-full px-4 py-1.5 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-primary" />
              <span className="font-mono text-[10px] text-muted-foreground">{endpoints.length} nodes</span>
            </div>
            {onlineCount > 0 && (
              <div className="glass rounded-full px-4 py-1.5 flex items-center gap-1.5 neon-box-green">
                <Wifi className="w-3 h-3" style={{ color: "hsl(var(--neon-green))" }} />
                <span className="font-mono text-[10px] font-bold" style={{ color: "hsl(var(--neon-green))" }}>{onlineCount} online</span>
              </div>
            )}
            {offlineCount > 0 && (
              <div className="glass rounded-full px-4 py-1.5 flex items-center gap-1.5 neon-box-pink">
                <WifiOff className="w-3 h-3 text-accent" />
                <span className="font-mono text-[10px] font-bold text-accent">{offlineCount} down</span>
              </div>
            )}
            <div className="glass rounded-full px-4 py-1.5 flex items-center gap-1.5">
              <Zap className="w-3 h-3" style={{ color: "hsl(var(--neon-yellow))" }} />
              <span className="font-mono text-[10px] text-muted-foreground">{logs.length} logs</span>
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`glass flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-[10px] font-bold tracking-wider uppercase transition-all hover:scale-[1.03] active:scale-[0.97] ${
              isRunning ? "neon-box-green" : "neon-box-pink"
            }`}
            style={{ color: isRunning ? "hsl(var(--neon-green))" : "hsl(var(--destructive))" }}
          >
            {isRunning ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
            {isRunning ? "Running" : "Stopped"}
          </button>
          <button
            onClick={handlePingAll}
            className="glass flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-[10px] font-bold tracking-wider uppercase neon-box-cyan transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{ color: "hsl(var(--neon-cyan))" }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Ping All
          </button>
          <button
            onClick={() => setShowCharts(!showCharts)}
            className={`glass flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-[10px] font-bold tracking-wider uppercase transition-all hover:scale-[1.03] active:scale-[0.97] ${
              showCharts ? "neon-box-purple" : ""
            }`}
            style={{ color: showCharts ? "hsl(var(--neon-purple))" : "hsl(var(--muted-foreground))" }}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Charts
          </button>
        </div>

        {/* Settings */}
        {profile && (
          <div className="mb-6">
            <SettingsPanel profile={profile} onUpdate={updateProfile} />
          </div>
        )}

        {/* Add endpoint */}
        <div className="mb-8">
          <div className="glass rounded-2xl p-5 sm:p-6 neon-box-purple" style={{ animation: "border-glow 4s ease-in-out infinite" }}>
            <h2 className="font-display text-xs font-bold tracking-wider uppercase mb-4 flex items-center gap-2" style={{ color: "hsl(var(--neon-cyan))" }}>
              <span className="w-1 h-4 rounded-full gradient-cyber" />
              Add Endpoint
            </h2>
            <AddEndpointForm onAdd={addEndpoint} />
          </div>
        </div>

        {/* Endpoint grid */}
        {endpoints.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-xs font-bold tracking-wider uppercase mb-4 flex items-center gap-2" style={{ color: "hsl(var(--neon-pink))" }}>
              <span className="w-1 h-4 rounded-full gradient-cyber-pink" />
              Monitored Nodes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {endpoints.map((ep) => (
                <div key={ep.id} className="space-y-3">
                  <EndpointCard stats={getStats(ep)} onRemove={removeEndpoint} />
                  {showCharts && <ResponseChart logs={logs} endpointId={ep.id} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs */}
        <LogPanel logs={logs} onClear={clearLogs} />

        {/* Footer */}
        <footer className="mt-10 text-center">
          <p className="font-display text-[9px] tracking-[0.3em] uppercase" style={{ color: "hsl(var(--neon-purple) / 0.4)" }}>
            XSU Codex · Keep-Alive · 24/7
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
