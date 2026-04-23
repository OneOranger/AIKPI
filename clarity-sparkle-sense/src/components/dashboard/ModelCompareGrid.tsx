import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, LineChart, Line } from "recharts";
import { Check, Cpu, Crown, Zap, X, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { modelCompare, type ModelCompare, modelTrend } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const vendorAccent: Record<string, string> = {
  OpenAI: "from-emerald-500/30 to-emerald-500/0",
  Anthropic: "from-orange-500/30 to-orange-500/0",
  Google: "from-sky-500/30 to-sky-500/0",
  DeepSeek: "from-violet-500/30 to-violet-500/0",
};

const vendorColors: Record<string, string> = {
  OpenAI: "#10b981",
  Anthropic: "#f97316",
  Google: "#0ea5e9",
  DeepSeek: "#8b5cf6",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const badgeIcon: Record<string, any> = {
  旗舰: Crown,
  均衡: Check,
  多模态: Cpu,
  "性价比之王": Zap,
};

export function ModelCompareGrid() {
  const [selectedModel, setSelectedModel] = useState<ModelCompare | null>(null);
  
  // Find best per metric
  const bestAccuracy = Math.max(...modelCompare.map((m) => m.accuracy));
  const bestCost = Math.min(...modelCompare.map((m) => m.blendedCost));
  const bestLatency = Math.min(...modelCompare.map((m) => m.latencyP95));
  const bestValue = Math.max(...modelCompare.map((m) => m.valueIndex));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {modelCompare.map((m) => (
          <ModelCard
            key={m.id}
            model={m}
            isBestAccuracy={m.accuracy === bestAccuracy}
            isBestCost={m.blendedCost === bestCost}
            isBestLatency={m.latencyP95 === bestLatency}
            isBestValue={m.valueIndex === bestValue}
            onClick={() => setSelectedModel(m)}
          />
        ))}
      </div>

      <ModelDetailDialog 
        model={selectedModel} 
        onClose={() => setSelectedModel(null)} 
      />
    </>
  );
}

function ModelCard({
  model,
  isBestAccuracy,
  isBestCost,
  isBestLatency,
  isBestValue,
  onClick,
}: {
  model: ModelCompare;
  isBestAccuracy: boolean;
  isBestCost: boolean;
  isBestLatency: boolean;
  isBestValue: boolean;
  onClick: () => void;
}) {
  const Icon = badgeIcon[model.badge] ?? Check;
  const gradient = vendorAccent[model.vendor] ?? "from-primary/30 to-primary/0";

  return (
    <div 
      onClick={onClick}
      className="group relative rounded-xl border border-border bg-surface overflow-hidden hover:border-border-strong hover:bg-surface-elevated transition-all cursor-pointer"
    >
      {/* Top accent */}
      <div className={`h-px bg-gradient-to-r ${gradient}`} />
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${gradient} opacity-40 pointer-events-none`} />

      <div className="relative p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>{model.vendor}</span>
              <span className="text-border-strong">·</span>
              <span>{model.context} 上下文</span>
            </div>
            <div className="text-base font-semibold tracking-tight mt-0.5">{model.name}</div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            <Icon className="h-3 w-3" />
            {model.badge}
          </span>
        </div>

        {/* Spark (accuracy 14d) */}
        <div className="h-10 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={model.spark} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`sg-${model.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={1.5} fill={`url(#sg-${model.id})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Core metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Metric label="准确率" value={`${model.accuracy}%`} best={isBestAccuracy} />
          <Metric label="混合成本" value={`$${model.blendedCost.toFixed(2)}`} suffix="/1M" best={isBestCost} />
          <Metric label="P95 延迟" value={`${model.latencyP95}ms`} best={isBestLatency} />
          <Metric label="价值指数" value={model.valueIndex.toString()} best={isBestValue} accent />
        </div>

        {/* Bars */}
        <div className="space-y-1.5 pt-1">
          <Bar label="推理能力" value={model.reasoning} />
          <Bar label="编程能力" value={model.coding} />
          <Bar label="多语言能力" value={model.multilingual} />
        </div>

        {/* Footer mini stats */}
        <div className="flex items-center justify-between pt-2 border-t border-border text-[10px] text-muted-foreground">
          <span className="tabular">输入 ${model.inputCost.toFixed(2)} / 输出 ${model.outputCost.toFixed(2)}</span>
          <span className="tabular">{model.throughput} Token/s</span>
          <span className="tabular text-success">{model.uptime}%</span>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, suffix, best, accent }: { label: string; value: string; suffix?: string; best?: boolean; accent?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-surface-elevated px-2.5 py-2 relative">
      {best && (
        <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold uppercase tracking-wider px-1 py-px rounded bg-primary text-primary-foreground">
          最佳
        </span>
      )}
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-sm font-semibold tabular mt-0.5 ${accent ? "text-primary" : ""}`}>
        {value}
        {suffix && <span className="text-[10px] text-muted-foreground font-normal ml-0.5">{suffix}</span>}
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
        <div
          className="h-full bg-gradient-gold rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-foreground w-8 text-right tabular">{value}</span>
    </div>
  );
}

function ModelDetailDialog({ model, onClose }: { model: ModelCompare | null; onClose: () => void }) {
  if (!model) return null;

  const Icon = badgeIcon[model.badge] ?? Check;
  const trendData = modelTrend.map(d => ({
    day: d.day,
    value: d[model.id as keyof typeof d] as number,
  }));

  // 优劣势分析
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  if (model.accuracy >= 93) strengths.push("准确率领先，适合高精度任务");
  if (model.blendedCost <= 2.5) strengths.push("成本极低，适合大规模部署");
  if (model.latencyP95 <= 700) strengths.push("响应速度快，实时性好");
  if (model.reasoning >= 94) strengths.push("推理能力强，适合复杂逻辑");
  if (model.coding >= 94) strengths.push("代码生成能力优秀");
  if (model.multilingual >= 94) strengths.push("多语言支持出色");
  
  if (model.accuracy < 90) weaknesses.push("准确率偏低，需人工复核");
  if (model.blendedCost > 5) weaknesses.push("成本较高，需控制调用量");
  if (model.latencyP95 > 900) weaknesses.push("延迟较高，不适合实时场景");
  if (model.hallucination > 3) weaknesses.push("幻觉率偏高，需注意事实准确性");

  return (
    <Dialog open={!!model} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <Icon className="h-3 w-3" />
              {model.badge}
            </span>
            <DialogTitle className="text-xl">{model.name}</DialogTitle>
          </div>
          <DialogDescription>
            {model.vendor} · {model.context} 上下文 · 在线率 {model.uptime}%
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* 核心指标 */}
          <div className="grid grid-cols-4 gap-3">
            <MetricBox label="准确率" value={`${model.accuracy}%`} highlight={model.accuracy >= 93} />
            <MetricBox label="混合成本" value={`$${model.blendedCost.toFixed(2)}`} suffix="/1M" highlight={model.blendedCost <= 2.5} />
            <MetricBox label="P95 延迟" value={`${model.latencyP95}ms`} highlight={model.latencyP95 <= 700} />
            <MetricBox label="价值指数" value={model.valueIndex.toString()} highlight={model.valueIndex >= 95} accent />
          </div>

          {/* 历史趋势图 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              30天准确率趋势
            </h4>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <defs>
                    <linearGradient id={`trend-${model.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={vendorColors[model.vendor] || "hsl(var(--primary))"} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={vendorColors[model.vendor] || "hsl(var(--primary))"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={vendorColors[model.vendor] || "hsl(var(--primary))"} 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 优劣势分析 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                优势
              </h4>
              <ul className="space-y-2">
                {strengths.length > 0 ? strengths.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    {s}
                  </li>
                )) : (
                  <li className="text-xs text-muted-foreground">各项指标均衡</li>
                )}
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                注意事项
              </h4>
              <ul className="space-y-2">
                {weaknesses.length > 0 ? weaknesses.map((w, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    {w}
                  </li>
                )) : (
                  <li className="text-xs text-muted-foreground">无明显短板</li>
                )}
              </ul>
            </div>
          </div>

          {/* 详细指标 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-3">详细指标</h4>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground">输入成本</span>
                <p className="font-mono font-medium">${model.inputCost.toFixed(2)} / 1M tokens</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">输出成本</span>
                <p className="font-mono font-medium">${model.outputCost.toFixed(2)} / 1M tokens</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">幻觉率</span>
                <p className="font-mono font-medium">{model.hallucination}%</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">P50 延迟</span>
                <p className="font-mono font-medium">{model.latencyP50}ms</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">吞吐量</span>
                <p className="font-mono font-medium">{model.throughput} Token/s</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">上下文窗口</span>
                <p className="font-mono font-medium">{model.context}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MetricBox({ label, value, suffix, highlight, accent }: { label: string; value: string; suffix?: string; highlight?: boolean; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 text-center ${highlight ? 'border-primary/30 bg-primary/5' : 'border-border bg-surface-elevated/40'}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-lg font-semibold tabular mt-1 ${accent ? 'text-primary' : ''}`}>
        {value}
        {suffix && <span className="text-xs text-muted-foreground ml-0.5">{suffix}</span>}
      </div>
    </div>
  );
}
