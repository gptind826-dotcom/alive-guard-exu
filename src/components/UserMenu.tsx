import { LogOut, User } from "lucide-react";
import type { User as AuthUser } from "@supabase/supabase-js";
import type { Profile } from "@/hooks/useProfile";

interface UserMenuProps {
  user: AuthUser;
  profile: Profile | null;
  onSignOut: () => void;
}

export function UserMenu({ user, profile, onSignOut }: UserMenuProps) {
  const name = profile?.display_name || user.email?.split("@")[0] || "User";
  const avatar = profile?.avatar_url;

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/50">
        {avatar ? (
          <img src={avatar} alt={name} className="w-7 h-7 rounded-full border-2 border-primary/20" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
        )}
        <span className="font-display text-xs font-medium text-foreground hidden sm:inline">{name}</span>
      </div>
      <button
        onClick={onSignOut}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/40 border border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="font-display text-[11px] font-medium hidden sm:inline">Exit</span>
      </button>
    </div>
  );
}
