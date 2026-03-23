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
          className="flex-shrink-0 sm:w-40 px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
        />
        <input
          type="text"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(""); }}
          placeholder="https://your-api-url.com"
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/85 text-primary-foreground rounded-xl font-display text-sm font-semibold shadow-lg shadow-primary/15 hover:shadow-primary/25 hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-destructive/10">
          <p className="text-destructive text-[11px] font-mono">{error}</p>
        </div>
      )}
    </form>
  );
}
