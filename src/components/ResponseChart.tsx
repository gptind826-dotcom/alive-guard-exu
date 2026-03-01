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
        <span className="font-mono text-[10px] text-muted-foreground">
          // Collecting data points...
        </span>
      </div>
    );
  }

  return (
    <div className="h-24 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`grad-${endpointId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{ fontSize: 9, fill: "hsl(180, 30%, 55%)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: "hsl(180, 30%, 55%)" }}
            axisLine={false}
            tickLine={false}
            width={35}
            tickFormatter={(v) => `${v}ms`}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(230, 20%, 10%)",
              border: "1px solid hsl(180, 60%, 20%)",
              borderRadius: "2px",
              fontSize: "11px",
              fontFamily: "Share Tech Mono",
              color: "hsl(180, 100%, 90%)",
            }}
            formatter={(value: number) => [`${value}ms`, "Response"]}
          />
          <Area
            type="monotone"
            dataKey="ms"
            stroke="hsl(180, 100%, 50%)"
            strokeWidth={1.5}
            fill={`url(#grad-${endpointId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
