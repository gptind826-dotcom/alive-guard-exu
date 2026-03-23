import { Switch } from "@/components/ui/switch";
import { Settings, Volume2, Bell, Clock, Palette } from "lucide-react";
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
    <div className="glass-strong rounded-2xl p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <Settings className="w-4 h-4 text-primary" />
        <h2 className="font-display text-sm font-bold text-foreground">Settings</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-3.5 h-3.5 text-secondary" />
            <span className="font-display text-xs font-medium text-foreground">Sound</span>
          </div>
          <Switch
            checked={profile.sound_enabled}
            onCheckedChange={(v) => onUpdate({ sound_enabled: v })}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
          <div className="flex items-center gap-2.5">
            <Bell className="w-3.5 h-3.5 text-accent" />
            <span className="font-display text-xs font-medium text-foreground">Notify</span>
          </div>
          <Switch
            checked={profile.notifications_enabled}
            onCheckedChange={(v) => onUpdate({ notifications_enabled: v })}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
          <div className="flex items-center gap-2.5">
            <Palette className="w-3.5 h-3.5 text-primary" />
            <span className="font-display text-xs font-medium text-foreground">Theme</span>
          </div>
          <button
            onClick={() => onUpdate({ theme: profile.theme === "dark" ? "light" : "dark" })}
            className="font-mono text-[10px] px-3 py-1 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-all"
          >
            {profile.theme === "dark" ? "Dark" : "Light"}
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
          <div className="flex items-center gap-2.5">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span className="font-display text-xs font-medium text-foreground">Interval</span>
          </div>
          <div className="flex gap-1">
            {INTERVALS.map((i) => (
              <button
                key={i.value}
                onClick={() => onUpdate({ ping_interval: i.value })}
                className={`font-mono text-[9px] px-2 py-0.5 rounded-md font-semibold transition-all ${
                  profile.ping_interval === i.value
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted/60"
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
