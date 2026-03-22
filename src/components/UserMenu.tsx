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
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {avatar ? (
          <img src={avatar} alt={name} className="w-8 h-8 rounded-full border-2 border-primary/20" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
        )}
        <span className="font-display text-sm text-foreground hidden sm:inline">{name}</span>
      </div>
      <button
        onClick={onSignOut}
        className="glass flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-all"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="font-display text-xs">Exit</span>
      </button>
    </div>
  );
}
