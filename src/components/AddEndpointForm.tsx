import { useState } from "react";
import { Plus } from "lucide-react";

interface AddEndpointFormProps {
  onAdd: (url: string, name?: string) => void;
}

export function AddEndpointForm({ onAdd }: AddEndpointFormProps) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!url.trim()) {
      setError("URL is required");
      return;
    }
    
    try {
      new URL(url.trim());
    } catch {
      setError("Invalid URL format");
      return;
    }

    onAdd(url, name || undefined);
    setUrl("");
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Label (optional)"
          className="flex-shrink-0 sm:w-40 px-3 py-2 bg-muted border border-border rounded-sm font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_8px_hsl(var(--primary)/0.3)] transition-all"
        />
        <input
          type="text"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(""); }}
          placeholder="https://your-api-url.com"
          className="flex-1 px-3 py-2 bg-muted border border-border rounded-sm font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_8px_hsl(var(--primary)/0.3)] transition-all"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 border border-primary text-primary rounded-sm font-display text-xs uppercase tracking-widest hover:bg-primary/20 hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Deploy
        </button>
      </div>
      {error && <p className="text-destructive text-xs font-mono">[ERROR] {error}</p>}
    </form>
  );
}
