import { retrievalMetrics } from "@/lib/mockData";

export function RetrievalMetrics() {
  return (
    <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 animate-fade-up">
      <header className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight">RAG · 检索质量</h2>
            <span className="text-[10px] uppercase tracking-wider text-primary border border-primary/30 rounded px-1.5 py-0.5">
              IR
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            检索增强生成的 Recall@K、精确率、F1-Score 和 MRR。
          </p>
        </div>
      </header>

      {/* Top scalar metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Stat label="精确率" value={`${retrievalMetrics.precision}%`} />
        <Stat label="F1-Score" value={retrievalMetrics.f1.toFixed(1)} accent />
        <Stat label="MRR" value={retrievalMetrics.mrr.toFixed(3)} />
        <Stat label="分块命中率" value={`${retrievalMetrics.chunkHitRate}%`} />
      </div>

      {/* Recall@K bars */}
      <div>
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
          <span>Recall@K</span>
          <span>检索到的 Top-K 相关文档</span>
        </div>
        <ul className="space-y-2">
          {retrievalMetrics.recallAtK.map((r) => (
            <li key={r.k} className="grid grid-cols-[40px_1fr_56px] items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground">{r.k}</span>
              <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                  style={{ width: `${r.recall}%` }}
                />
              </div>
              <span className="text-sm font-semibold tabular text-right">{r.recall.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-xl font-semibold tabular mt-1 ${accent ? "text-gradient-gold" : ""}`}>{value}</div>
    </div>
  );
}
