import { useState } from "react";
import { valueAssessment } from "@/lib/mockData";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface MonthlyData {
  month: string;
  value: number;
  cost: number;
  net: number;
}

export function RoiBridgeChart() {
  const data = valueAssessment.roiTrend;
  const totalValue = data.reduce((s, d) => s + d.value, 0);
  const totalCost = data.reduce((s, d) => s + d.cost, 0);
  const net = totalValue - totalCost;
  const [selectedMonth, setSelectedMonth] = useState<MonthlyData | null>(null);

  // 自定义点击处理
  const handleChartClick = (e: { activePayload?: Array<{ payload: MonthlyData }> }) => {
    if (e && e.activePayload && e.activePayload.length > 0) {
      setSelectedMonth(e.activePayload[0].payload);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 animate-fade-up">
        <header className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">价值 vs 成本 · 12 个月</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              点击数据点查看详情 · 累计净收益 ·{" "}
              <span className="text-emerald-400 font-medium">+${(net / 1000).toFixed(0)}k</span> 在此期间。
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Legend swatch="bg-primary" label="产生的价值" value={`$${(totalValue / 1000).toFixed(0)}k`} />
            <Legend swatch="bg-rose-400/70" label="AI 成本" value={`$${(totalCost / 1000).toFixed(0)}k`} />
          </div>
        </header>

        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={data} 
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              onClick={handleChartClick}
            >
              <defs>
                <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0 70% 65%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(0 70% 65%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
              />
              <Area
                type="monotone"
                dataKey="value"
                name="价值"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#valueGrad)"
                className="cursor-pointer"
              />
              <Area
                type="monotone"
                dataKey="cost"
                name="成本"
                stroke="hsl(0 70% 65%)"
                strokeWidth={1.5}
                fill="url(#costGrad)"
                className="cursor-pointer"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <MonthDetailDialog month={selectedMonth} onClose={() => setSelectedMonth(null)} />
    </>
  );
}

function Legend({ swatch, label, value }: { swatch: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-end leading-tight">
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${swatch}`} />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-mono text-foreground font-semibold">{value}</span>
    </div>
  );
}

function MonthDetailDialog({ month, onClose }: { month: MonthlyData | null; onClose: () => void }) {
  if (!month) return null;

  const roi = ((month.value - month.cost) / month.cost * 100).toFixed(0);
  const isPositive = month.net > 0;

  // 模拟价值来源分布
  const valueBreakdown = [
    { source: "节省人力成本", amount: Math.round(month.value * 0.57), color: "bg-primary" },
    { source: "加快交付周期", amount: Math.round(month.value * 0.24), color: "bg-primary/70" },
    { source: "减少错误返工", amount: Math.round(month.value * 0.11), color: "bg-primary/50" },
    { source: "提升客户满意度", amount: Math.round(month.value * 0.08), color: "bg-primary/30" },
  ];

  // 模拟成本分布
  const costBreakdown = [
    { source: "模型调用费用", amount: Math.round(month.cost * 0.65), color: "bg-rose-400" },
    { source: "基础设施成本", amount: Math.round(month.cost * 0.25), color: "bg-rose-400/70" },
    { source: "运维人力成本", amount: Math.round(month.cost * 0.10), color: "bg-rose-400/50" },
  ];

  // 计算累计数据
  const data = valueAssessment.roiTrend;
  const monthIndex = data.findIndex(d => d.month === month.month);
  const cumulativeValue = data.slice(0, monthIndex + 1).reduce((s, d) => s + d.value, 0);
  const cumulativeCost = data.slice(0, monthIndex + 1).reduce((s, d) => s + d.cost, 0);
  const cumulativeNet = cumulativeValue - cumulativeCost;

  return (
    <Dialog open={!!month} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <DialogTitle>{month.month} 月度详情</DialogTitle>
          </div>
          <DialogDescription>
            该月 AI 投资的价值与成本详细分析
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* 核心指标 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-center">
              <div className="text-[10px] uppercase tracking-wider text-primary mb-1">产生价值</div>
              <div className="text-lg font-bold text-primary">${(month.value / 1000).toFixed(1)}k</div>
            </div>
            <div className="rounded-lg border border-rose-400/30 bg-rose-400/5 p-3 text-center">
              <div className="text-[10px] uppercase tracking-wider text-rose-400 mb-1">AI 成本</div>
              <div className="text-lg font-bold text-rose-400">${(month.cost / 1000).toFixed(1)}k</div>
            </div>
            <div className={`rounded-lg border p-3 text-center ${isPositive ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
              <div className={`text-[10px] uppercase tracking-wider mb-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>净收益</div>
              <div className={`text-lg font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? '+' : ''}${(month.net / 1000).toFixed(1)}k
              </div>
            </div>
          </div>

          {/* ROI 指标 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPositive ? (
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-rose-400" />
                )}
                <span className="text-sm font-medium">月度 ROI</span>
              </div>
              <span className={`text-2xl font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {roi}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              每投入 $1 成本，产生 ${(month.value / month.cost).toFixed(2)} 价值
            </p>
          </div>

          {/* 价值来源 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              价值来源分布
            </h4>
            <div className="space-y-2">
              {valueBreakdown.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-muted-foreground">{item.source}</div>
                  <div className="flex-1 h-2 rounded-full bg-surface overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${(item.amount / month.value) * 100}%` }}
                    />
                  </div>
                  <div className="w-16 text-xs text-right font-mono">${(item.amount / 1000).toFixed(1)}k</div>
                </div>
              ))}
            </div>
          </div>

          {/* 成本分布 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-rose-400" />
              成本分布
            </h4>
            <div className="space-y-2">
              {costBreakdown.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-muted-foreground">{item.source}</div>
                  <div className="flex-1 h-2 rounded-full bg-surface overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${(item.amount / month.cost) * 100}%` }}
                    />
                  </div>
                  <div className="w-16 text-xs text-right font-mono">${(item.amount / 1000).toFixed(1)}k</div>
                </div>
              ))}
            </div>
          </div>

          {/* 累计数据 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-3">截至 {month.month} 累计数据</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-[10px] text-muted-foreground">累计价值</div>
                <div className="text-sm font-semibold text-primary">${(cumulativeValue / 1000).toFixed(0)}k</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">累计成本</div>
                <div className="text-sm font-semibold text-rose-400">${(cumulativeCost / 1000).toFixed(0)}k</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">累计净收益</div>
                <div className={`text-sm font-semibold ${cumulativeNet > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${(cumulativeNet / 1000).toFixed(0)}k
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
