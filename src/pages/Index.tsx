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
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                  XSU Codex
                </h1>
                <p className="font-mono text-[11px] text-muted-foreground">
                  Endpoint monitoring · {pingInterval}s interval
                </p>
              </div>
            </div>
            <UserMenu user={user} profile={profile} onSignOut={signOut} />
          </div>

          {/* Status chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <div className="glass rounded-full px-3 py-1 flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse-neon"
                style={{ backgroundColor: isRunning ? "hsl(160 70% 42%)" : "hsl(0 72% 55%)" }}
              />
              <span className="font-mono text-xs text-muted-foreground">
                {isRunning ? "Active" : "Paused"}
              </span>
            </div>
            <div className="glass rounded-full px-3 py-1">
              <span className="font-mono text-xs text-muted-foreground">{endpoints.length} endpoints</span>
            </div>
            <div className="glass rounded-full px-3 py-1">
              <span className="font-mono text-xs text-accent">
                {onlineCount}/{endpoints.length} online
              </span>
            </div>
            <div className="glass rounded-full px-3 py-1">
              <span className="font-mono text-xs text-muted-foreground">{logs.length} logs</span>
            </div>
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
            className="glass flex items-center gap-2 px-4 py-2 rounded-lg font-display text-xs font-medium transition-all hover:scale-[1.02]"
            style={{
              color: isRunning ? "hsl(160 70% 42%)" : "hsl(0 72% 55%)",
            }}
          >
            {isRunning ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
            {isRunning ? "Running" : "Stopped"}
          </button>
          <button
            onClick={handlePingAll}
            className="glass flex items-center gap-2 px-4 py-2 rounded-lg font-display text-xs font-medium text-primary transition-all hover:scale-[1.02]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Ping All
          </button>
          <button
            onClick={() => setShowCharts(!showCharts)}
            className={`glass flex items-center gap-2 px-4 py-2 rounded-lg font-display text-xs font-medium transition-all hover:scale-[1.02] ${
              showCharts ? "text-secondary" : "text-muted-foreground"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Charts
          </button>
        </div>

        {/* Add endpoint */}
        <div className="mb-8 glass rounded-xl p-5">
          <h2 className="font-display text-sm font-semibold text-foreground mb-3">
            Add Endpoint
          </h2>
          <AddEndpointForm onAdd={addEndpoint} />
        </div>

        {/* Endpoint grid */}
        {endpoints.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-sm font-semibold text-foreground mb-4">
              Monitored Endpoints
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
          <p className="font-mono text-[11px] text-muted-foreground">
            XSU Codex · Keep-Alive · 24/7
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
