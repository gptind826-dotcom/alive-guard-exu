import { useState } from "react";
import { Plus, Globe } from "lucide-react";

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
    if (!url.trim()) { setError("URL is required"); return; }
    try { new URL(url.trim()); } catch { setError("Invalid URL format"); return; }
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
          className="flex-shrink-0 sm:w-40 px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
        />
        <div className="relative flex-1">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            placeholder="https://your-api.example.com"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-display text-sm font-semibold hover:brightness-110 transition-all shadow-md shadow-primary/15 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
      {error && (
        <p className="text-destructive text-xs font-mono pl-1">{error}</p>
      )}
    </form>
  );
}
