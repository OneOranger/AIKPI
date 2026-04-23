import { valueAssessment } from "@/lib/mockData";

export function ValueBreakdown() {
  const total = valueAssessment.valueBreakdown.reduce((s, b) => s + b.amount, 0);

  return (
    <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 animate-fade-up">
      <header className="mb-4">
        <h2 className="text-base font-semibold tracking-tight">价值来源</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          可归因的总收益 ·{" "}
          <span className="text-foreground font-mono">${total.toLocaleString()}</span> · 最近 90 天
        </p>
      </header>

      {/* Stacked bar */}
      <div className="flex h-2 rounded-full overflow-hidden mb-4">
        {valueAssessment.valueBreakdown.map((b, i) => (
          <div
            key={b.source}
            style={{ width: `${b.share}%` }}
            className={
              i === 0
                ? "bg-primary"
                : i === 1
                  ? "bg-primary/70"
                  : i === 2
                    ? "bg-primary/45"
                    : "bg-primary/25"
            }
          />
        ))}
      </div>

      <ul className="space-y-2.5">
        {valueAssessment.valueBreakdown.map((b, i) => (
          <li key={b.source} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`h-2.5 w-2.5 rounded-sm shrink-0 ${
                  i === 0
                    ? "bg-primary"
                    : i === 1
                      ? "bg-primary/70"
                      : i === 2
                        ? "bg-primary/45"
                        : "bg-primary/25"
                }`}
              />
              <span className="truncate text-foreground/90">{b.source}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] text-muted-foreground tabular">{b.share}%</span>
              <span className="font-mono text-sm font-medium tabular">${b.amount.toLocaleString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
