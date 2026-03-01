import { Switch } from "@/components/ui/switch";
import { Settings, Volume2, Bell, Clock, Palette } from "lucide-react";
import type { Profile } from "@/hooks/useProfile";

interface SettingsPanelProps {
  profile: Profile;
  onUpdate: (updates: Partial<Profile>) => void;
}

const INTERVALS = [
  { label: "30s", value: 30 },
  { label: "1min", value: 60 },
  { label: "2min", value: 120 },
  { label: "5min", value: 300 },
];

export function SettingsPanel({ profile, onUpdate }: SettingsPanelProps) {
  return (
    <div className="border border-border rounded-sm bg-card/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4 text-primary" />
        <h2 className="font-display text-xs uppercase tracking-widest text-muted-foreground">
          Configuration
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sound */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-sm border border-border">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-secondary" />
            <span className="font-mono text-xs text-foreground">Sound</span>
          </div>
          <Switch
            checked={profile.sound_enabled}
            onCheckedChange={(v) => onUpdate({ sound_enabled: v })}
          />
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-sm border border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-accent" />
            <span className="font-mono text-xs text-foreground">Notify</span>
          </div>
          <Switch
            checked={profile.notifications_enabled}
            onCheckedChange={(v) => onUpdate({ notifications_enabled: v })}
          />
        </div>

        {/* Theme */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-sm border border-border">
          <div className="flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-xs text-foreground">Theme</span>
          </div>
          <button
            onClick={() => onUpdate({ theme: profile.theme === "dark" ? "light" : "dark" })}
            className="font-mono text-[10px] uppercase px-2 py-1 border border-border rounded-sm text-primary hover:bg-primary/10 transition-all"
          >
            {profile.theme === "dark" ? "DARK" : "LIGHT"}
          </button>
        </div>

        {/* Ping Interval */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-sm border border-border">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-neon-yellow" style={{ color: "hsl(50, 100%, 55%)" }} />
            <span className="font-mono text-xs text-foreground">Interval</span>
          </div>
          <div className="flex gap-1">
            {INTERVALS.map((i) => (
              <button
                key={i.value}
                onClick={() => onUpdate({ ping_interval: i.value })}
                className={`font-mono text-[9px] px-1.5 py-0.5 rounded-sm border transition-all ${
                  profile.ping_interval === i.value
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
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
