import { useMemo, useState, useEffect } from "react";
import { ArrowRight, Beaker, RotateCcw, Sparkles, Play, CheckCircle2, Loader2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { modelCompare } from "@/lib/mockData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";

export function AbSimulator() {
  const [a, setA] = useState("gpt5");
  const [b, setB] = useState("deepseek");
  const [traffic, setTraffic] = useState(40); // % to model B
  const [monthlyCalls, setMonthlyCalls] = useState(1_000_000);
  const [avgTokens, setAvgTokens] = useState(1500);
  const [showResult, setShowResult] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);

  const reset = () => {
    setA("gpt5");
    setB("deepseek");
    setTraffic(40);
    setMonthlyCalls(1_000_000);
    setAvgTokens(1500);
    setShowResult(false);
    setSimulating(false);
    setSimulationProgress(0);
  };

  const runSimulation = () => {
    setSimulating(true);
    setSimulationProgress(0);
    
    // 模拟运行动画
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimulating(false);
          setShowResult(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const ma = modelCompare.find((m) => m.id === a)!;
  const mb = modelCompare.find((m) => m.id === b)!;

  const result = useMemo(() => {
    const totalTokens = (monthlyCalls * avgTokens) / 1_000_000; // in millions
    const callsB = (monthlyCalls * traffic) / 100;
    const callsA = monthlyCalls - callsB;

    // Baseline: 100% A
    const baselineCost = totalTokens * ma.blendedCost;
    const baselineAcc = ma.accuracy;
    const baselineLat = ma.latencyP95;

    // Mixed
    const tokensA = (callsA * avgTokens) / 1_000_000;
    const tokensB = (callsB * avgTokens) / 1_000_000;
    const mixedCost = tokensA * ma.blendedCost + tokensB * mb.blendedCost;
    const wA = callsA / monthlyCalls;
    const wB = callsB / monthlyCalls;
    const mixedAcc = ma.accuracy * wA + mb.accuracy * wB;
    const mixedLat = ma.latencyP95 * wA + mb.latencyP95 * wB;

    const savings = baselineCost - mixedCost;
    const accDelta = mixedAcc - baselineAcc;
    const latDelta = mixedLat - baselineLat;

    return { baselineCost, mixedCost, savings, baselineAcc, mixedAcc, accDelta, baselineLat, mixedLat, latDelta };
  }, [ma, mb, traffic, monthlyCalls, avgTokens]);

  const chartData = [
    { name: "成本 ($)", baseline: +result.baselineCost.toFixed(0), mixed: +result.mixedCost.toFixed(0) },
    { name: "准确率 ×100", baseline: +(result.baselineAcc * 100).toFixed(0), mixed: +(result.mixedAcc * 100).toFixed(0) },
    { name: "P95 (ms)", baseline: +result.baselineLat.toFixed(0), mixed: +result.mixedLat.toFixed(0) },
  ];

  const recommendation = result.savings > 0 && result.accDelta > -1.5
    ? `将 ${traffic}% 流量路由到 ${mb.name} → 每月节省 $${Math.abs(result.savings).toFixed(0)}，准确率仅损失 ${Math.abs(result.accDelta).toFixed(2)}pp。`
    : result.savings > 0
      ? `每月节省 $${result.savings.toFixed(0)}，但准确率下降 ${Math.abs(result.accDelta).toFixed(2)}pp — 上线前请审查质量 SLO。`
      : `${mb.name} 在此配置下更贵（+$${Math.abs(result.savings).toFixed(0)}/月）。建议保持 ${ma.name} 为主模型。`;

  return (
    <div className="rounded-xl border border-border bg-surface relative overflow-hidden">
      {/* glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />

      <div className="relative p-5 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary border border-primary/20">
                <Beaker className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-sm font-semibold tracking-tight">A/B 切换模拟器</h3>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border bg-surface-elevated rounded px-1.5 py-0.5">
                假设分析
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              将部分流量路由到更便宜或更快的模型，查看预估的月度影响。
            </p>
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-2.5 py-1.5 text-[11px] hover:border-border-strong transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> 重置
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <ModelPicker label="模型 A · 主模型" value={a} onChange={setA} disabled={b} />
              <ModelPicker label="模型 B · 变体" value={b} onChange={setB} disabled={a} />
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="text-muted-foreground">流向 {mb.name} 的流量</span>
                <span className="font-mono text-primary">{traffic}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={traffic}
                onChange={(e) => setTraffic(+e.target.value)}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                <span>100% {ma.name}</span>
                <span>各 50%</span>
                <span>100% {mb.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <NumberField label="月度调用次数" value={monthlyCalls} onChange={setMonthlyCalls} step={100_000} format={(v) => v.toLocaleString()} />
              <NumberField label="平均 Token / 调用" value={avgTokens} onChange={setAvgTokens} step={250} format={(v) => v.toLocaleString()} />
            </div>
          </div>

          {/* Result chart */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] text-muted-foreground">基线 (100% {ma.name}) vs 混合</span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-muted-foreground/60" />基线</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-primary" />混合</span>
              </div>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--surface-elevated))" }}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />
                  <Bar dataKey="baseline" fill="hsl(var(--muted-foreground) / 0.4)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mixed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Result summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <ResultCard
            label="月度成本"
            value={`$${result.mixedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            delta={result.savings >= 0 ? `−$${result.savings.toFixed(0)}` : `+$${Math.abs(result.savings).toFixed(0)}`}
            positive={result.savings >= 0}
          />
          <ResultCard
            label="混合准确率"
            value={`${result.mixedAcc.toFixed(2)}%`}
            delta={`${result.accDelta >= 0 ? "+" : ""}${result.accDelta.toFixed(2)}pp`}
            positive={result.accDelta >= 0}
          />
          <ResultCard
            label="平均 P95 延迟"
            value={`${Math.round(result.mixedLat)}ms`}
            delta={`${result.latDelta >= 0 ? "+" : ""}${Math.round(result.latDelta)}ms`}
            positive={result.latDelta <= 0}
          />
          <ResultCard
            label="年度影响"
            value={`${result.savings >= 0 ? "−" : "+"}$${Math.abs(result.savings * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            delta={result.savings >= 0 ? "节省" : "额外成本"}
            positive={result.savings >= 0}
            accent
          />
        </div>

        {/* Recommendation */}
        <div className="rounded-lg border border-primary/25 bg-primary/5 p-3.5 flex gap-3">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-gold text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-wider text-primary mb-1">AI 建议</div>
            <div className="text-sm leading-relaxed">{recommendation}</div>
          </div>
          <button 
            onClick={runSimulation}
            disabled={simulating}
            className="self-center inline-flex items-center gap-1.5 rounded-md bg-gradient-gold text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-95 transition-opacity disabled:opacity-50"
          >
            {simulating ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> 模拟中...</>
            ) : (
              <><Play className="h-3 w-3" /> 运行模拟</>
            )}
          </button>
        </div>
      </div>

      <SimulationResultSheet 
        open={showResult}
        onClose={() => setShowResult(false)}
        ma={ma}
        mb={mb}
        traffic={traffic}
        monthlyCalls={monthlyCalls}
        result={result}
        recommendation={recommendation}
      />
    </div>
  );
}

function ModelPicker({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-surface-elevated px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
      >
        {modelCompare.map((m) => (
          <option key={m.id} value={m.id} disabled={m.id === disabled}>
            {m.name} · {m.vendor}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberField({ label, value, onChange, step, format }: { label: string; value: number; onChange: (v: number) => void; step: number; format: (v: number) => string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      <div className="flex items-center rounded-md border border-border bg-surface-elevated overflow-hidden">
        <button
          onClick={() => onChange(Math.max(0, value - step))}
          className="px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors text-sm"
        >
          −
        </button>
        <div className="flex-1 text-center text-xs tabular font-medium">{format(value)}</div>
        <button
          onClick={() => onChange(value + step)}
          className="px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors text-sm"
        >
          +
        </button>
      </div>
    </div>
  );
}

function ResultCard({ label, value, delta, positive, accent }: { label: string; value: string; delta: string; positive: boolean; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${accent ? "border-primary/30 bg-primary/5" : "border-border bg-surface-elevated/40"}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-lg font-semibold tabular mt-1 ${accent ? "text-primary" : ""}`}>{value}</div>
      <div className={`text-[11px] tabular mt-0.5 ${positive ? "text-success" : "text-destructive"}`}>{delta}</div>
    </div>
  );
}

interface SimulationResultSheetProps {
  open: boolean;
  onClose: () => void;
  ma: typeof modelCompare[0];
  mb: typeof modelCompare[0];
  traffic: number;
  monthlyCalls: number;
  result: {
    baselineCost: number;
    mixedCost: number;
    savings: number;
    baselineAcc: number;
    mixedAcc: number;
    accDelta: number;
    baselineLat: number;
    mixedLat: number;
    latDelta: number;
  };
  recommendation: string;
}

function SimulationResultSheet({ open, onClose, ma, mb, traffic, monthlyCalls, result, recommendation }: SimulationResultSheetProps) {
  const [showCheckmarks, setShowCheckmarks] = useState(false);
  
  useEffect(() => {
    if (open) {
      setShowCheckmarks(false);
      const timer = setTimeout(() => setShowCheckmarks(true), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const steps = [
    { label: "加载模型配置", done: true },
    { label: `配置流量分配: ${100 - traffic}% ${ma.name} + ${traffic}% ${mb.name}`, done: true },
    { label: `计算月度调用: ${monthlyCalls.toLocaleString()} 次`, done: true },
    { label: "运行成本模拟", done: true },
    { label: "评估质量影响", done: true },
    { label: "生成优化建议", done: true },
  ];

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-primary" />
            A/B 模拟结果
          </SheetTitle>
          <SheetDescription>
            {ma.name} + {mb.name} 混合部署方案分析
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* 模拟步骤 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-4">模拟执行过程</h4>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`transition-all duration-300 ${showCheckmarks ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 流量分配可视化 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-3">流量分配方案</h4>
            <div className="h-4 rounded-full overflow-hidden flex">
              <div 
                className="bg-primary/60 flex items-center justify-center text-[9px] text-white"
                style={{ width: `${100 - traffic}%` }}
              >
                {100 - traffic > 15 && ma.name}
              </div>
              <div 
                className="bg-primary flex items-center justify-center text-[9px] text-white"
                style={{ width: `${traffic}%` }}
              >
                {traffic > 15 && mb.name}
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-muted-foreground">{ma.name}: {100 - traffic}%</span>
              <span className="text-primary font-medium">{mb.name}: {traffic}%</span>
            </div>
          </div>

          {/* 核心结果 */}
          <div className="grid grid-cols-2 gap-3">
            <ResultCardSimple
              label="月度成本"
              value={`$${result.mixedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              delta={result.savings >= 0 ? `节省 $${result.savings.toFixed(0)}` : `增加 $${Math.abs(result.savings).toFixed(0)}`}
              positive={result.savings >= 0}
            />
            <ResultCardSimple
              label="混合准确率"
              value={`${result.mixedAcc.toFixed(2)}%`}
              delta={`${result.accDelta >= 0 ? '+' : ''}${result.accDelta.toFixed(2)}pp`}
              positive={result.accDelta >= 0}
            />
            <ResultCardSimple
              label="平均延迟"
              value={`${Math.round(result.mixedLat)}ms`}
              delta={`${result.latDelta >= 0 ? '+' : ''}${Math.round(result.latDelta)}ms`}
              positive={result.latDelta <= 0}
            />
            <ResultCardSimple
              label="年度影响"
              value={`${result.savings >= 0 ? '节省' : '增加'} $${Math.abs(result.savings * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              delta={result.savings >= 0 ? "推荐方案" : "需谨慎"}
              positive={result.savings >= 0}
              accent
            />
          </div>

          {/* 详细对比 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-3">详细对比</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground">基线成本 (100% {ma.name})</span>
                <span className="font-mono">${result.baselineCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground">混合成本</span>
                <span className="font-mono text-primary">${result.mixedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground">基线准确率</span>
                <span className="font-mono">{result.baselineAcc.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">混合准确率</span>
                <span className="font-mono text-primary">{result.mixedAcc.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* AI 建议 */}
          <div className="rounded-lg border border-primary/25 bg-primary/5 p-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              AI 建议
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{recommendation}</p>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 rounded-md border border-border bg-surface-elevated px-4 py-2 text-xs font-medium hover:bg-surface transition-colors"
            >
              关闭
            </button>
            <button 
              className="flex-1 rounded-md bg-gradient-gold text-primary-foreground px-4 py-2 text-xs font-medium hover:opacity-95 transition-opacity"
            >
              导出报告
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ResultCardSimple({ label, value, delta, positive, accent }: { label: string; value: string; delta: string; positive: boolean; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${accent ? "border-primary/30 bg-primary/5" : "border-border bg-surface"}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-base font-semibold tabular mt-1 ${accent ? "text-primary" : ""}`}>{value}</div>
      <div className={`text-[10px] tabular mt-0.5 ${positive ? "text-emerald-400" : "text-rose-400"}`}>{delta}</div>
    </div>
  );
}
