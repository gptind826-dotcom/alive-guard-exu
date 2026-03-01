import { LogOut, User } from "lucide-react";
import type { User as AuthUser } from "@supabase/supabase-js";
import type { Profile } from "@/hooks/useProfile";

interface UserMenuProps {
  user: AuthUser;
  profile: Profile | null;
  onSignOut: () => void;
}

export function UserMenu({ user, profile, onSignOut }: UserMenuProps) {
  const name = profile?.display_name || user.email?.split("@")[0] || "Operator";
  const avatar = profile?.avatar_url;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-7 h-7 rounded-full border border-primary/50"
          />
        ) : (
          <div className="w-7 h-7 rounded-full border border-primary/50 flex items-center justify-center bg-primary/10">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
        )}
        <span className="font-mono text-xs text-foreground hidden sm:inline">
          {name}
        </span>
      </div>
      <button
        onClick={onSignOut}
        className="flex items-center gap-1.5 px-2 py-1 border border-border rounded-sm text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-all"
      >
        <LogOut className="w-3 h-3" />
        <span className="font-mono text-[10px] uppercase">Exit</span>
      </button>
    </div>
  );
}
