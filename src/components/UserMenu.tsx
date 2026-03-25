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
          <img src={avatar} alt={name} className="w-8 h-8 rounded-xl object-cover ring-2 ring-primary/30" />
        ) : (
          <div className="w-8 h-8 rounded-xl gradient-cyber flex items-center justify-center shadow-md shadow-primary/20">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="font-display text-[10px] font-bold tracking-wider uppercase text-foreground hidden sm:inline">{name}</span>
      </div>
      <button
        onClick={onSignOut}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-muted-foreground hover:text-accent hover:neon-box-pink transition-all"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="font-display text-[10px] font-bold tracking-wider uppercase hidden sm:inline">Exit</span>
      </button>
    </div>
  );
}
