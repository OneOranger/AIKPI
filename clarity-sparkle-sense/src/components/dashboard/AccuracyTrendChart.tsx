import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { modelTrend } from "@/lib/mockData";

const series = [
  { key: "gpt5", name: "GPT-5", color: "hsl(43 55% 54%)" },
  { key: "claude45", name: "Claude 4.5", color: "hsl(43 80% 70%)" },
  { key: "gemini25", name: "Gemini 2.5", color: "hsl(40 30% 55%)" },
  { key: "deepseek", name: "DeepSeek V3.2", color: "hsl(40 12% 38%)" },
];

export function AccuracyTrendChart() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">准确率趋势 · 30 天</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">基于真实值评估集自动评估</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[10px]">
          {series.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className="h-1.5 w-3 rounded-sm" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={modelTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} interval={3} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} domain={[85, 96]} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 11,
              }}
            />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={1.75}
                dot={false}
                activeDot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
