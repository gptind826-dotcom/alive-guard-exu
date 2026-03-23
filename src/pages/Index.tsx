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
import { Power, PowerOff, RefreshCw, Shield, BarChart3, Plus, Sparkles } from "lucide-react";
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
          <span className="font-mono text-xs text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const onlineCount = endpoints.filter((ep) => getStats(ep).lastPing?.status === "online").length;

  return (
    <div className="min-h-screen bg-background cyber-grid relative">
      {/* Decorative orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 slide-up">
          <div className="glass-strong rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                  <Shield className="w-5.5 h-5.5 text-primary" />
                  <Sparkles className="w-3 h-3 text-secondary absolute -top-0.5 -right-0.5" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-display font-extrabold text-foreground tracking-tight">
                    XSU Codex
                  </h1>
                  <p className="font-mono text-[10px] text-muted-foreground tracking-wide">
                    Monitoring · {pingInterval}s interval
                  </p>
                </div>
              </div>
              <UserMenu user={user} profile={profile} onSignOut={signOut} />
            </div>

            {/* Status chips */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/50">
                <div
                  className="w-2 h-2 rounded-full status-pulse"
                  style={{ backgroundColor: isRunning ? "hsl(var(--neon-green))" : "hsl(var(--neon-red))" }}
                />
                <span className="font-mono text-[11px] font-medium text-foreground">
                  {isRunning ? "Active" : "Paused"}
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-muted/60 border border-border/50">
                <span className="font-mono text-[11px] text-muted-foreground">{endpoints.length} endpoints</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                <span className="font-mono text-[11px] font-medium text-accent">
                  {onlineCount}/{endpoints.length} online
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-muted/60 border border-border/50">
                <span className="font-mono text-[11px] text-muted-foreground">{logs.length} logs</span>
              </div>
            </div>
          </div>
        </header>

        {/* Settings */}
        {profile && (
          <div className="mb-5 fade-in">
            <SettingsPanel profile={profile} onUpdate={updateProfile} />
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`glass-card flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-semibold transition-all ${
              isRunning ? "text-accent border-accent/20" : "text-destructive border-destructive/20"
            }`}
          >
            {isRunning ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
            {isRunning ? "Running" : "Stopped"}
          </button>
          <button
            onClick={handlePingAll}
            className="glass-card flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-semibold text-primary transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Ping All
          </button>
          <button
            onClick={() => setShowCharts(!showCharts)}
            className={`glass-card flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-semibold transition-all ${
              showCharts ? "text-secondary border-secondary/20" : "text-muted-foreground"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Charts
          </button>
        </div>

        {/* Add endpoint */}
        <div className="mb-6 glass-strong rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="w-4 h-4 text-primary" />
            <h2 className="font-display text-sm font-bold text-foreground">
              Add Endpoint
            </h2>
          </div>
          <AddEndpointForm onAdd={addEndpoint} />
        </div>

        {/* Endpoint grid */}
        {endpoints.length > 0 && (
          <div className="mb-6">
            <h2 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Monitored Endpoints
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {endpoints.map((ep, i) => (
                <div key={ep.id} className="fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
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
          <p className="font-mono text-[10px] text-muted-foreground/50">
            XSU Codex · Keep-Alive · 24/7
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
