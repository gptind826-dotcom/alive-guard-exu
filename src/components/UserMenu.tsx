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
      <div className="flex items-center gap-2.5">
        {avatar ? (
          <img src={avatar} alt={name} className="w-8 h-8 rounded-xl object-cover ring-1 ring-border" />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
            <User className="w-4 h-4 text-primary" />
          </div>
        )}
        <span className="font-display text-sm font-medium text-foreground hidden sm:inline">{name}</span>
      </div>
      <button
        onClick={onSignOut}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="font-display text-xs font-medium hidden sm:inline">Sign out</span>
      </button>
    </div>
  );
}
