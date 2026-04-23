import { consistencyScores } from "@/lib/mockData";
import { Repeat } from "lucide-react";

export function ConsistencyPanel() {
  return (
    <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 animate-fade-up">
      <header className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Repeat className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold tracking-tight">一致性</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            相同 Prompt × 5 次运行 · 答案的语义相似度 (0-1)。
          </p>
        </div>
      </header>

      <ul className="space-y-3">
        {consistencyScores.map((c) => {
          const pct = c.score * 100;
          const tier =
            c.score >= 0.9 ? "high" : c.score >= 0.8 ? "mid" : "low";
          const colors = {
            high: "from-primary to-primary/60",
            mid: "from-amber-400 to-amber-500/60",
            low: "from-rose-500 to-rose-500/60",
          }[tier];
          const tierLabel = {
            high: { label: "稳定", chip: "bg-primary/15 text-primary border-primary/30" },
            mid: { label: "波动", chip: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
            low: { label: "不稳定", chip: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
          }[tier];

          return (
            <li key={c.project} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 items-center">
              <span className="text-sm text-foreground/90 truncate">{c.project}</span>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center text-[10px] uppercase tracking-wider font-medium border rounded px-1.5 py-0.5 ${tierLabel.chip}`}
                >
                  {tierLabel.label}
                </span>
                <span className="text-sm font-semibold tabular w-12 text-right">{c.score.toFixed(2)}</span>
              </div>
              <div className="col-span-2 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${colors}`} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
