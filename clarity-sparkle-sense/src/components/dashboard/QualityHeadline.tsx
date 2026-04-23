import { qualityHeadline } from "@/lib/mockData";
import { Target, AlertTriangle, CheckCircle2, Heart } from "lucide-react";

function Delta({ value, inverse }: { value: number; inverse?: boolean }) {
  const positive = inverse ? value < 0 : value > 0;
  const color = positive ? "text-emerald-400" : "text-rose-400";
  const sign = value > 0 ? "+" : "";
  return (
    <span className={`text-[11px] font-semibold ${color}`}>
      {sign}
      {value.toFixed(1)}
      {inverse ? "pp" : "pp"}
    </span>
  );
}

export function QualityHeadline() {
  const items = [
    {
      icon: Target,
      label: "整体准确率",
      value: `${qualityHeadline.overallAccuracy}%`,
      delta: qualityHeadline.accuracyDelta,
      inverse: false,
      sub: "所有任务加权",
      accent: true,
    },
    {
      icon: AlertTriangle,
      label: "幻觉率",
      value: `${qualityHeadline.hallucinationRate}%`,
      delta: qualityHeadline.hallucinationDelta,
      inverse: true,
      sub: "自动事实核查 vs 知识库",
    },
    {
      icon: CheckCircle2,
      label: "任务完成率",
      value: `${qualityHeadline.taskCompletion}%`,
      delta: qualityHeadline.taskCompletionDelta,
      inverse: false,
      sub: "端到端成功",
    },
    {
      icon: Heart,
      label: "用户 CSAT",
      value: `${qualityHeadline.csat}/5`,
      delta: qualityHeadline.csatDelta,
      inverse: false,
      sub: "点赞 + 1-5 评分",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 animate-fade-up">
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">质量</span>
            <span className="h-px w-8 bg-primary/40" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">最近 30 天</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mt-1">
            AI 到底有多准确？
          </h2>
        </div>
        <div className="text-[11px] text-muted-foreground text-right leading-tight">
          <div>{qualityHeadline.evaluatedSamples.toLocaleString()} 个样本已评估</div>
          <div className="font-mono mt-0.5">{qualityHeadline.judgeModel}</div>
        </div>
      </div>

      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((it) => (
          <div
            key={it.label}
            className={`rounded-xl border p-4 ${
              it.accent ? "border-primary/40 bg-primary/[0.05]" : "border-border bg-background/40"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <it.icon className={`h-3.5 w-3.5 ${it.accent ? "text-primary" : ""}`} />
                <span>{it.label}</span>
              </div>
              <Delta value={it.delta} inverse={it.inverse} />
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
