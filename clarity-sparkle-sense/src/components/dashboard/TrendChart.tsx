import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { trendData } from "@/lib/mockData";

const tabs = [
  { id: "calls", label: "调用次数", suffix: "", color: "hsl(43 55% 54%)" },
  { id: "cost", label: "成本", suffix: "$", color: "hsl(43 80% 70%)" },
  { id: "latency", label: "延迟", suffix: "ms", color: "hsl(40 30% 55%)" },
] as const;

export function TrendChart() {
  const [tab, setTab] = useState<typeof tabs[number]["id"]>("calls");
  const active = tabs.find((t) => t.id === tab)!;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight">实时活动</h3>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
              流式传输
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">所有项目 · 最近 24 小时</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-0.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                tab === t.id
                  ? "bg-surface-elevated text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[260px] px-2 pb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="trend-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={active.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={active.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 100% / 0.04)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="hsl(40 6% 56%)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={5}
            />
            <YAxis
              stroke="hsl(40 6% 56%)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(0 0% 8%)",
                border: "1px solid hsl(0 0% 16%)",
                borderRadius: 8,
                fontSize: 11,
                padding: "6px 10px",
              }}
              labelStyle={{ color: "hsl(40 6% 56%)", fontSize: 10, marginBottom: 2 }}
              itemStyle={{ color: "hsl(40 20% 96%)" }}
              formatter={(v: number) => [`${active.suffix}${v.toLocaleString()}`, active.label]}
              cursor={{ stroke: "hsl(0 0% 30%)", strokeDasharray: "3 3" }}
            />
            <Area
              type="monotone"
              dataKey={tab}
              stroke={active.color}
              strokeWidth={2}
              fill="url(#trend-grad)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
