import { valueAssessment } from "@/lib/mockData";
import { TrendingUp, DollarSign, Clock, ShieldCheck } from "lucide-react";

export function ValueHeadline() {
  const { headline, period, project } = valueAssessment;
  const items = [
    {
      icon: TrendingUp,
      label: "ROI",
      value: `${headline.roi}%`,
      sub: "价值 ÷ 成本 · 最近 90 天",
      accent: true,
    },
    {
      icon: DollarSign,
      label: "本月净节省",
      value: `$${(headline.monthlySavings / 1000).toFixed(1)}k`,
      sub: "人工 + 基础设施 + 返工",
    },
    {
      icon: Clock,
      label: "回本周期",
      value: `${headline.paybackDays}天`,
      sub: "自首次部署起",
    },
    {
      icon: ShieldCheck,
      label: "置信度",
      value: `${Math.round(headline.confidence * 100)}%`,
      sub: "模型 · 基于 18,420 个事件",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.06] via-card/60 to-card/40 backdrop-blur-sm p-6 animate-fade-up">
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">高管模式</span>
            <span className="h-px w-8 bg-primary/40" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{period}</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mt-1">
            AI 投资回报率 <span className="text-gradient-gold">3.2 倍</span>。
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{project} · 自动归因于 AI 前基线。</p>
        </div>
        <div className="text-[11px] text-muted-foreground font-mono">已验证 · 2026.04.18</div>
      </div>

      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((it) => (
          <div
            key={it.label}
            className={`rounded-xl border p-4 ${
              it.accent
                ? "border-primary/40 bg-primary/[0.05]"
                : "border-border bg-background/40"
            }`}
          >
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <it.icon className={`h-3.5 w-3.5 ${it.accent ? "text-primary" : ""}`} />
              {it.label}
            </div>
            <div className={`text-3xl font-semibold tabular mt-2 ${it.accent ? "text-gradient-gold" : ""}`}>
              {it.value}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">{it.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
