import { useState } from "react";
import { ArrowDown, ArrowUp, Minus, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { modelCompare } from "@/lib/mockData";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const cols = [
  { key: "accuracy", label: "准确率", suffix: "%", better: "high" as const, category: "quality" },
  { key: "hallucination", label: "幻觉率", suffix: "%", better: "low" as const, category: "quality" },
  { key: "blendedCost", label: "成本 / 1M", prefix: "$", better: "low" as const, category: "cost" },
  { key: "latencyP50", label: "P50 延迟", suffix: "ms", better: "low" as const, category: "performance" },
  { key: "latencyP95", label: "P95 延迟", suffix: "ms", better: "low" as const, category: "performance" },
  { key: "throughput", label: "吞吐量", suffix: " Token/s", better: "high" as const, category: "performance" },
  { key: "uptime", label: "在线时长", suffix: "%", better: "high" as const, category: "reliability" },
  { key: "valueIndex", label: "价值指数", better: "high" as const, category: "composite" },
];

const categoryLabels: Record<string, string> = {
  quality: "质量指标",
  cost: "成本指标",
  performance: "性能指标",
  reliability: "可靠性指标",
  composite: "综合指标",
};

export function ModelCompareTable() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  // For each col, find best value
  const best: Record<string, number> = {};
  cols.forEach((c) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values = modelCompare.map((m) => (m as any)[c.key] as number);
    best[c.key] = c.better === "high" ? Math.max(...values) : Math.min(...values);
  });

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">并排对比 · 所有指标</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">点击行查看详细对比 · 每行最佳值以金色高亮</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><ArrowUp className="h-3 w-3 text-success" />越好</span>
          <span className="inline-flex items-center gap-1"><ArrowDown className="h-3 w-3 text-destructive" />越差</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-elevated/40">
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5">指标</th>
              {modelCompare.map((m) => (
                <th key={m.id} className="text-right font-medium px-4 py-2.5 min-w-[140px]">
                  <div className="text-foreground">{m.name}</div>
                  <div className="text-[10px] font-normal text-muted-foreground">{m.vendor}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cols.map((c, idx) => (
              <Collapsible key={c.key} open={expandedRow === c.key} onOpenChange={(open) => setExpandedRow(open ? c.key : null)}>
                <CollapsibleTrigger asChild>
                  <tr 
                    className={`border-b border-border/60 last:border-0 ${idx % 2 ? "bg-surface-elevated/20" : ""} hover:bg-surface-elevated/40 cursor-pointer transition-colors`}
                  >
                    <td className="px-4 py-2.5 text-muted-foreground flex items-center gap-2">
                      {expandedRow === c.key ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      {c.label}
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-muted-foreground">
                        {categoryLabels[c.category]}
                      </span>
                    </td>
                    {modelCompare.map((m) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const v = (m as any)[c.key] as number;
                      const isBest = v === best[c.key];
                      // diff vs best (relative)
                      const bestVal = best[c.key];
                      let diff: number | null = null;
                      if (!isBest && bestVal !== 0) {
                        diff = c.better === "high"
                          ? ((v - bestVal) / bestVal) * 100
                          : ((bestVal - v) / bestVal) * 100;
                      }
                      return (
                        <td key={m.id} className="px-4 py-2.5 text-right tabular">
                          <div className="flex items-center justify-end gap-2">
                            <span className={isBest ? "text-primary font-semibold" : "text-foreground"}>
                              {c.prefix}{v}{c.suffix}
                            </span>
                            {isBest ? (
                              <span className="text-[9px] font-bold uppercase text-primary">最佳</span>
                            ) : diff !== null ? (
                              <span className={`text-[10px] inline-flex items-center gap-0.5 ${diff < -1 ? "text-destructive" : "text-muted-foreground"}`}>
                                {diff < 0 ? <ArrowDown className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
                                {Math.abs(diff).toFixed(0)}%
                              </span>
                            ) : null}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <tr className="border-b border-border/60 bg-surface-elevated/30">
                    <td colSpan={modelCompare.length + 1} className="px-4 py-4">
                      <MetricDetailRow colKey={c.key} category={c.category} />
                    </td>
                  </tr>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricDetailRow({ colKey, category }: { colKey: string; category: string }) {
  const getMetricInsight = () => {
    switch (colKey) {
      case "accuracy":
        return "准确率是模型输出与预期结果的一致程度。GPT-5 和 Claude 4.5 在此指标上领先，适合对准确性要求高的场景。";
      case "hallucination":
        return "幻觉率表示模型生成虚假信息的概率。越低越好，Claude 4.5 的幻觉率最低（1.8%）。";
      case "blendedCost":
        return "混合成本基于典型的输入/输出比例计算。DeepSeek V3.2 成本极低，适合大规模部署。";
      case "latencyP50":
        return "P50 延迟表示 50% 请求的首 Token 响应时间。Gemini 2.5 Pro 响应最快（322ms）。";
      case "latencyP95":
        return "P95 延迟表示 95% 请求的总响应时间。对于用户体验关键的场景，建议控制在 1000ms 以内。";
      case "throughput":
        return "吞吐量表示每秒生成的 Token 数量。Gemini 2.5 Pro 吞吐量最高（168 Token/s）。";
      case "uptime":
        return "在线时长表示服务可用性百分比。所有主流模型都保持在 99.9% 以上。";
      case "valueIndex":
        return "价值指数综合准确率、成本和延迟计算。DeepSeek V3.2 以 99 分领先，是性价比最优选择。";
      default:
        return "";
    }
  };

  // 计算该指标下各模型的排名
  const col = cols.find(c => c.key === colKey);
  const sortedModels = [...modelCompare].sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const va = (a as any)[colKey] as number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vb = (b as any)[colKey] as number;
    return col?.better === "high" ? vb - va : va - vb;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <BarChart3 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground leading-relaxed">{getMetricInsight()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3 mt-3">
        {sortedModels.map((m, idx) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const v = (m as any)[colKey] as number;
          const isBest = idx === 0;
          return (
            <div 
              key={m.id} 
              className={`rounded-lg border p-2.5 ${isBest ? 'border-primary/30 bg-primary/5' : 'border-border bg-surface'}`}
            >
              <div className="text-[10px] text-muted-foreground mb-1">#{idx + 1} {m.name}</div>
              <div className={`text-sm font-semibold tabular ${isBest ? 'text-primary' : ''}`}>
                {col?.prefix}{v}{col?.suffix}
              </div>
              {isBest && <div className="text-[9px] text-primary mt-1">最佳表现</div>}
            </div>
          );
        })}
      </div>
      
      <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/60">
        分类：{categoryLabels[category]} · 数据来源：过去30天生产环境统计
      </div>
    </div>
  );
}
