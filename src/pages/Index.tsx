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
import { Power, PowerOff, RefreshCw, Shield, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTheme } from "next-themes";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
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

  // Sync theme
  useEffect(() => {
    if (profile?.theme) setTheme(profile.theme);
  }, [profile?.theme, setTheme]);

  // Request notification permission
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Check for offline on ping
  const handlePingAll = async () => {
    const results = await pingAll();
    if (results) checkForOffline(results);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Shield className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const onlineCount = endpoints.filter((ep) => getStats(ep).lastPing?.status === "online").length;

  return (
    <div className="min-h-screen bg-background cyber-grid relative">
      <div className="fixed inset-0 scanline pointer-events-none z-50 opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary animate-pulse-neon" />
              <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-wider neon-text-cyan">
                XSU Codex
              </h1>
            </div>
            <UserMenu user={user} profile={profile} onSignOut={signOut} />
          </div>
          <p className="font-mono text-xs text-muted-foreground ml-11">
            // Autonomous endpoint keep-alive system // interval: {pingInterval}s
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
            <span className="font-mono text-xs text-muted-foreground">NODES: {endpoints.length}</span>
            <span className="font-mono text-xs" style={{ color: "hsl(150 100% 50%)" }}>
              ONLINE: {onlineCount}/{endpoints.length}
            </span>
            <span className="font-mono text-xs text-muted-foreground">LOGS: {logs.length}</span>
          </div>
        </header>

        {/* Settings */}
        {profile && (
          <div className="mb-6">
            <SettingsPanel profile={profile} onUpdate={updateProfile} />
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-3 py-1.5 border rounded-sm font-display text-[10px] uppercase tracking-widest transition-all"
            style={{
              borderColor: isRunning ? "hsl(150 100% 50%)" : "hsl(0 100% 55%)",
              color: isRunning ? "hsl(150 100% 50%)" : "hsl(0 100% 55%)",
            }}
          >
            {isRunning ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
            {isRunning ? "Running" : "Stopped"}
          </button>
          <button
            onClick={handlePingAll}
            className="flex items-center gap-2 px-3 py-1.5 border border-primary text-primary rounded-sm font-display text-[10px] uppercase tracking-widest hover:bg-primary/10 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Ping All
          </button>
          <button
            onClick={() => setShowCharts(!showCharts)}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-sm font-display text-[10px] uppercase tracking-widest transition-all ${
              showCharts
                ? "border-secondary text-secondary bg-secondary/10"
                : "border-border text-muted-foreground hover:border-secondary/50"
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            Charts
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
                <div key={ep.id}>
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
        <footer className="mt-8 text-center">
          <p className="font-mono text-[10px] text-muted-foreground">
            XSU CODEX // INTERVAL: {pingInterval}s // MODE: KEEP-ALIVE // 24/7
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
