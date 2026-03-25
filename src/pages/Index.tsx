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
import { Power, PowerOff, RefreshCw, Shield, BarChart3, Wifi, WifiOff, Activity } from "lucide-react";
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
        <div className="flex flex-col items-center gap-3">
          <Shield className="w-8 h-8 text-primary animate-pulse" />
          <p className="font-mono text-xs text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const onlineCount = endpoints.filter((ep) => getStats(ep).lastPing?.status === "online").length;
  const offlineCount = endpoints.filter((ep) => {
    const s = getStats(ep).lastPing?.status;
    return s === "offline" || s === "error";
  }).length;

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-foreground">
                  XSU Codex
                </h1>
                <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                  Keep-alive monitoring · {pingInterval}s cycle
                </p>
              </div>
            </div>
            <UserMenu user={user} profile={profile} onSignOut={signOut} />
          </div>

          {/* Status bar */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <div className="glass rounded-full px-3.5 py-1.5 flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse-neon"
                style={{ backgroundColor: isRunning ? "hsl(var(--accent))" : "hsl(var(--destructive))" }}
              />
              <span className="font-mono text-[11px] font-medium text-foreground">
                {isRunning ? "Active" : "Paused"}
              </span>
            </div>
            <div className="glass rounded-full px-3.5 py-1.5 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-muted-foreground" />
              <span className="font-mono text-[11px] text-muted-foreground">{endpoints.length} endpoints</span>
            </div>
            {onlineCount > 0 && (
              <div className="glass rounded-full px-3.5 py-1.5 flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-accent" />
                <span className="font-mono text-[11px] font-medium text-accent">{onlineCount} online</span>
              </div>
            )}
            {offlineCount > 0 && (
              <div className="glass rounded-full px-3.5 py-1.5 flex items-center gap-1.5">
                <WifiOff className="w-3 h-3 text-destructive" />
                <span className="font-mono text-[11px] font-medium text-destructive">{offlineCount} down</span>
              </div>
            )}
          </div>
        </header>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`glass flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${
              isRunning ? "text-accent ring-1 ring-accent/20" : "text-destructive ring-1 ring-destructive/20"
            }`}
          >
            {isRunning ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
            {isRunning ? "Running" : "Stopped"}
          </button>
          <button
            onClick={handlePingAll}
            className="glass flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-semibold text-primary ring-1 ring-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Ping All
          </button>
          <button
            onClick={() => setShowCharts(!showCharts)}
            className={`glass flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${
              showCharts ? "text-secondary ring-1 ring-secondary/20" : "text-muted-foreground"
            }`}
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
          <div className="glass rounded-2xl p-5 sm:p-6">
            <h2 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-primary" />
              Add Endpoint
            </h2>
            <AddEndpointForm onAdd={addEndpoint} />
          </div>
        </div>

        {/* Endpoint grid */}
        {endpoints.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-accent" />
              Monitored Endpoints
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
          <p className="font-mono text-[10px] text-muted-foreground/60">
            XSU Codex · Keep-Alive Monitor · 24/7
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
