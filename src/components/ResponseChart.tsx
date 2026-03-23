import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import type { PingResult } from "@/types/api";

interface ResponseChartProps {
  logs: PingResult[];
  endpointId: string;
}

export function ResponseChart({ logs, endpointId }: ResponseChartProps) {
  const data = logs
    .filter((l) => l.endpointId === endpointId && l.responseTime !== null)
    .slice(-30)
    .map((l) => ({
      time: l.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      ms: l.responseTime,
      status: l.status,
    }));

  if (data.length < 2) {
    return (
      <div className="h-24 flex items-center justify-center">
        <span className="font-mono text-[10px] text-muted-foreground/50">Collecting data...</span>
      </div>
    );
  }

  return (
    <div className="h-24 mt-2 glass-card rounded-xl p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`grad-${endpointId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(225, 84%, 58%)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="hsl(225, 84%, 58%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} width={35} tickFormatter={(v) => `${v}ms`} />
          <Tooltip
            contentStyle={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(24px)",
              border: "1px solid var(--glass-border)",
              borderRadius: "12px",
              fontSize: "11px",
              fontFamily: "JetBrains Mono",
            }}
            formatter={(value: number) => [`${value}ms`, "Response"]}
          />
          <Area type="monotone" dataKey="ms" stroke="hsl(225, 84%, 58%)" strokeWidth={1.5} fill={`url(#grad-${endpointId})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
