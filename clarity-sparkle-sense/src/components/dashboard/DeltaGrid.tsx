import { useState } from "react";
import { valueAssessment } from "@/lib/mockData";
import { ArrowDown, ArrowUp, TrendingUp, Calculator, Database, Clock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

function formatVal(v: number, unit: string) {
  if (unit === "$") return `$${v.toFixed(2)}`;
  if (unit === "/5") return `${v.toFixed(1)}/5`;
  if (unit === "%") return `${v.toFixed(1)}%`;
  if (unit === "min") return `${v.toFixed(1)} min`;
  if (unit === "s") return `${v}s`;
  return v.toLocaleString();
}

function pctDelta(baseline: number, post: number, better: "high" | "low") {
  if (baseline === 0) return 0;
  const raw = ((post - baseline) / baseline) * 100;
  return better === "high" ? raw : -raw;
}

interface DeltaItem {
  key: string;
  label: string;
  baseline: number;
  postAi: number;
  unit: string;
  better: string;
  narrative: string;
}

export function DeltaGrid() {
  const [selectedDelta, setSelectedDelta] = useState<DeltaItem | null>(null);

  return (
    <>
      <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 animate-fade-up">
        <header className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">基线 · vs · AI 上线后</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              点击卡片查看详情 · 绿色 = 改善
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">6 个维度</span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {valueAssessment.deltas.map((d) => {
            const delta = pctDelta(d.baseline, d.postAi, d.better as "high" | "low");
            const positive = delta > 0;

            // Bar widths: normalize so both values fit visually
            const max = Math.max(d.baseline, d.postAi);
            const baselineW = (d.baseline / max) * 100;
            const postW = (d.postAi / max) * 100;

            return (
              <div
                key={d.key}
                onClick={() => setSelectedDelta(d)}
                className="rounded-xl border border-border bg-background/40 p-4 hover:border-primary/40 hover:bg-surface-elevated/40 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{d.label}</span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      positive ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {Math.abs(delta).toFixed(0)}%
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {/* Baseline */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">基线</span>
                      <span className="font-mono text-foreground/80">{formatVal(d.baseline, d.unit)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                      <div
                        className="h-full bg-muted-foreground/40 rounded-full"
                        style={{ width: `${baselineW}%` }}
                      />
                    </div>
                  </div>
                  {/* Post-AI */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-primary font-medium">AI 上线后</span>
                      <span className="font-mono text-primary font-semibold">{formatVal(d.postAi, d.unit)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                        style={{ width: `${postW}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground mt-3 leading-snug">{d.narrative}</p>
              </div>
            );
          })}
        </div>
      </section>

      <DeltaDetailSheet delta={selectedDelta} onClose={() => setSelectedDelta(null)} />
    </>
  );
}

function DeltaDetailSheet({ delta, onClose }: { delta: DeltaItem | null; onClose: () => void }) {
  if (!delta) return null;

  const deltaValue = pctDelta(delta.baseline, delta.postAi, delta.better as "high" | "low");
  const positive = deltaValue > 0;
  const absDelta = Math.abs(deltaValue);

  // 生成模拟趋势数据
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"][i],
    value: delta.baseline + (delta.postAi - delta.baseline) * (i / 11) + (Math.random() - 0.5) * (delta.baseline * 0.1),
  }));

  const getCalculationProcess = () => {
    const change = delta.postAi - delta.baseline;
    const percentChange = ((change / delta.baseline) * 100).toFixed(1);
    
    return {
      formula: `变化率 = (AI后数值 - 基线数值) / 基线数值 × 100%`,
      steps: [
        `基线数值: ${formatVal(delta.baseline, delta.unit)}`,
        `AI上线后数值: ${formatVal(delta.postAi, delta.unit)}`,
        `绝对变化: ${change > 0 ? '+' : ''}${formatVal(change, delta.unit)}`,
        `百分比变化: ${percentChange}%`,
        `改善方向: ${delta.better === 'high' ? '数值越高越好' : '数值越低越好'}`,
      ],
    };
  };

  const getDataSource = () => {
    const sources: Record<string, string> = {
      time: "任务处理时间追踪系统 · 基于 12,450 个任务样本",
      cost: "财务系统 · 包含人工成本和 AI 调用成本",
      errorRate: "质量管理系统 · QA 团队审核数据",
      throughput: "生产环境监控 · 每日任务完成数统计",
      csat: "客户满意度调查 · NPS 评分系统",
      firstResponse: "客服系统 · 首次响应时间记录",
    };
    return sources[delta.key] || "综合数据源";
  };

  const calc = getCalculationProcess();

  return (
    <Sheet open={!!delta} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {delta.label} 详情
          </SheetTitle>
          <SheetDescription>
            基线 vs AI 上线后对比分析
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* 核心指标对比 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-surface-elevated/40 p-4 text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">基线</div>
              <div className="text-2xl font-bold text-foreground/80">{formatVal(delta.baseline, delta.unit)}</div>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
              <div className="text-[10px] uppercase tracking-wider text-primary mb-1">AI 上线后</div>
              <div className="text-2xl font-bold text-primary">{formatVal(delta.postAi, delta.unit)}</div>
            </div>
          </div>

          {/* 变化幅度 */}
          <div className={`rounded-lg border p-4 ${positive ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">变化幅度</span>
              <span className={`text-2xl font-bold ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {positive ? '+' : ''}{absDelta.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{delta.narrative}</p>
          </div>

          {/* 趋势图 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              12个月趋势
            </h4>
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="deltaTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fill="url(#deltaTrend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 计算过程 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              计算过程
            </h4>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground bg-surface p-2 rounded font-mono">{calc.formula}</p>
              <div className="space-y-1">
                {calc.steps.map((step, i) => (
                  <div key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="text-primary">{i + 1}.</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 数据来源 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              数据来源
            </h4>
            <p className="text-xs text-muted-foreground">{getDataSource()}</p>
            <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              数据更新时间：4分钟前
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
