import { Switch } from "@/components/ui/switch";
import { Settings, Volume2, Bell, Clock, Sun, Moon } from "lucide-react";
import type { Profile } from "@/hooks/useProfile";

interface SettingsPanelProps {
  profile: Profile;
  onUpdate: (updates: Partial<Profile>) => void;
}

const INTERVALS = [
  { label: "30s", value: 30 },
  { label: "1m", value: 60 },
  { label: "2m", value: 120 },
  { label: "5m", value: 300 },
];

export function SettingsPanel({ profile, onUpdate }: SettingsPanelProps) {
  return (
    <div className="glass rounded-2xl p-5 neon-box-cyan">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4" style={{ color: "hsl(var(--neon-cyan))" }} />
        <h2 className="font-display text-[10px] font-bold tracking-wider uppercase" style={{ color: "hsl(var(--neon-cyan))" }}>
          Config
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5" style={{ color: "hsl(var(--neon-pink))" }} />
            <span className="font-display text-[10px] font-bold tracking-wider uppercase text-foreground">Sound</span>
          </div>
          <Switch
            checked={profile.sound_enabled}
            onCheckedChange={(v) => onUpdate({ sound_enabled: v })}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5" style={{ color: "hsl(var(--neon-green))" }} />
            <span className="font-display text-[10px] font-bold tracking-wider uppercase text-foreground">Notify</span>
          </div>
          <Switch
            checked={profile.notifications_enabled}
            onCheckedChange={(v) => onUpdate({ notifications_enabled: v })}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
          <div className="flex items-center gap-2">
            {profile.theme === "dark" ? (
              <Moon className="w-3.5 h-3.5 text-primary" />
            ) : (
              <Sun className="w-3.5 h-3.5" style={{ color: "hsl(var(--neon-yellow))" }} />
            )}
            <span className="font-display text-[10px] font-bold tracking-wider uppercase text-foreground">Theme</span>
          </div>
          <button
            onClick={() => onUpdate({ theme: profile.theme === "dark" ? "light" : "dark" })}
            className="font-display text-[9px] font-bold tracking-wider uppercase px-3 py-1 rounded-lg gradient-cyber text-white hover:brightness-110 transition-all"
          >
            {profile.theme === "dark" ? "Dark" : "Light"}
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" style={{ color: "hsl(var(--neon-orange))" }} />
            <span className="font-display text-[10px] font-bold tracking-wider uppercase text-foreground">Rate</span>
          </div>
          <div className="flex gap-1">
            {INTERVALS.map((i) => (
              <button
                key={i.value}
                onClick={() => onUpdate({ ping_interval: i.value })}
                className={`font-mono text-[9px] font-bold px-2 py-1 rounded-lg transition-all ${
                  profile.ping_interval === i.value
                    ? "gradient-cyber text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
