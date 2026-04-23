import { promptVersions } from "@/lib/mockData";
import { ArrowDown, ArrowUp, Crown, Sparkles } from "lucide-react";

type Metric = {
  key: keyof (typeof promptVersions)[number];
  label: string;
  unit?: string;
  format: (v: number) => string;
  // "high" = higher is better, "low" = lower is better
  direction: "high" | "low";
};

const metrics: Metric[] = [
  { key: "accuracy", label: "准确率", format: (v) => `${v.toFixed(1)}%`, direction: "high" },
  { key: "helpfulRate", label: "有用率", format: (v) => `${v.toFixed(1)}%`, direction: "high" },
  { key: "tokensIn", label: "平均 Token · 输入", format: (v) => v.toLocaleString(), direction: "low" },
  { key: "tokensOut", label: "平均 Token · 输出", format: (v) => v.toLocaleString(), direction: "low" },
  { key: "costPer1k", label: "成本 · 每次调用", format: (v) => `$${v.toFixed(4)}`, direction: "low" },
  { key: "latency", label: "延迟 · P50", format: (v) => `${v}ms`, direction: "low" },
];

function bestIndex(key: Metric["key"], direction: Metric["direction"]) {
  const values = promptVersions.map((p) => p[key] as number);
  const target = direction === "high" ? Math.max(...values) : Math.min(...values);
  return values.indexOf(target);
}

function deltaPct(value: number, base: number, direction: Metric["direction"]) {
  if (base === 0) return 0;
  const raw = ((value - base) / base) * 100;
  // For "low is better" metrics, flip the sign so positive = improvement
  return direction === "high" ? raw : -raw;
}

export function PromptVersionCompare() {
  // Compute overall winner = version with the most metric wins
  const winsByVersion = promptVersions.map(() => 0);
  metrics.forEach((m) => {
    winsByVersion[bestIndex(m.key, m.direction)] += 1;
  });
  const overallWinner = winsByVersion.indexOf(Math.max(...winsByVersion));
  const baseline = promptVersions[0];

  return (
    <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 animate-fade-up">
      <header className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold tracking-tight">Prompt 版本对比</h2>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5">
              Claude 4.5 Sonnet
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            相同模型，三个 Prompt 迭代版本 · 每项指标高亮获胜者 · 与 V1 基线的差异。
          </p>
        </div>
        <div className="text-[11px] text-muted-foreground">
          评估集 · <span className="font-mono text-foreground">5,104 prompts</span> · 最近 7 天
        </div>
      </header>

      {/* Version header cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {promptVersions.map((p, i) => {
          const isWinner = i === overallWinner;
          return (
            <div
              key={p.version}
              className={`relative rounded-xl border p-4 transition-colors ${
                isWinner
                  ? "border-primary/50 bg-primary/[0.04]"
                  : "border-border bg-background/40"
              }`}
            >
              {isWinner && (
                <span className="absolute -top-2 right-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                  <Crown className="h-3 w-3" /> 综合最佳
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold tabular text-gradient-gold">{p.version}</span>
                  <span className="text-xs text-muted-foreground">{p.label}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{winsByVersion[i]} 胜</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-snug min-h-[2.5rem]">{p.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60 text-[10px] text-muted-foreground">
                <span>@{p.author}</span>
                <span className="font-mono">{p.updated} 更新</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Metric matrix */}
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="text-left font-medium py-2 pr-4">指标</th>
              {promptVersions.map((p) => (
                <th key={p.version} className="text-right font-medium py-2 px-3">
                  {p.version}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => {
              const winner = bestIndex(m.key, m.direction);
              return (
                <tr key={m.key} className="border-t border-border/60">
                  <td className="py-3 pr-4 text-foreground/90">{m.label}</td>
                  {promptVersions.map((p, i) => {
                    const value = p[m.key] as number;
                    const isWinner = i === winner;
                    const isBaseline = i === 0;
                    const delta = isBaseline ? 0 : deltaPct(value, baseline[m.key] as number, m.direction);
                    const positive = delta > 0;
                    return (
                      <td key={p.version} className="py-3 px-3 text-right tabular">
                        <div className="flex items-center justify-end gap-2">
                          {isWinner && <Crown className="h-3 w-3 text-primary" />}
                          <span
                            className={`font-medium ${
                              isWinner ? "text-primary" : "text-foreground/90"
                            }`}
                          >
                            {m.format(value)}
                          </span>
                        </div>
                        {!isBaseline && (
                          <div
                            className={`flex items-center justify-end gap-0.5 text-[10px] mt-0.5 ${
                              positive ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {positive ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
                            {Math.abs(delta).toFixed(1)}%
                          </div>
                        )}
                        {isBaseline && (
                          <div className="text-[10px] text-muted-foreground mt-0.5">基线</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="mt-4 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span>
          <span className="text-primary font-semibold">V3</span> 在 {winsByVersion[2]}/{metrics.length} 项指标上获胜 ·
          <span className="text-emerald-400"> +8.3pp 准确率</span> &
          <span className="text-emerald-400"> −21% 成本</span> vs V1。
        </span>
        <span className="font-mono">prompt-registry · claude-4.5-sonnet</span>
      </footer>
    </section>
  );
}
