import { models } from "@/lib/mockData";

export function ModelBreakdown() {
  const total = models.reduce((s, m) => s + m.calls, 0);
  return (
    <div className="rounded-xl border border-border bg-surface p-5 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">模型分布</h3>
          <p className="text-xs text-muted-foreground mt-1">流量占比 · 成功率 · 成本</p>
        </div>
        <button className="text-[11px] text-primary hover:text-primary-glow transition-colors">对比 →</button>
      </div>

      {/* Stacked share bar */}
      <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-surface-muted mb-5">
        {models.map((m) => (
          <div
            key={m.name}
            style={{ width: `${m.share}%`, background: m.color }}
            className="h-full"
            title={`${m.name} · ${m.share}%`}
          />
        ))}
      </div>

      <div className="space-y-3">
        {models.map((m) => (
          <div key={m.name} className="grid grid-cols-12 items-center gap-3 text-xs">
            <div className="col-span-5 flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: m.color }} />
              <span className="truncate font-medium">{m.name}</span>
            </div>
            <div className="col-span-3 tabular text-muted-foreground">
              {(m.calls / 1000).toFixed(1)}k
            </div>
            <div className="col-span-2 tabular text-muted-foreground">
              {m.success}%
            </div>
            <div className="col-span-2 tabular text-right font-medium">
              ${m.cost.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-border grid grid-cols-3 gap-3 text-center">
        <Stat label="总计" value={`${(total / 1_000_000).toFixed(2)}M`} />
        <Stat label="平均延迟" value="867ms" />
        <Stat label="最佳 $/调用" value="$0.0036" hint="DeepSeek" />
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{label}</div>
      <div className="text-sm font-semibold tabular">{value}</div>
      {hint && <div className="text-[10px] text-primary mt-0.5">{hint}</div>}
    </div>
  );
}
