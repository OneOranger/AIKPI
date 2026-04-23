import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowDownRight, ArrowUpRight, TrendingUp, TrendingDown, Activity, DollarSign, Cpu, CheckCircle } from "lucide-react";
import { kpis } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// 扩展 KPI 数据，添加子指标
const kpiDetails: Record<string, {
  icon: React.ReactNode;
  subMetrics: { label: string; value: string; change: string; positive: boolean }[];
  description: string;
}> = {
  calls: {
    icon: <Activity className="h-5 w-5" />,
    description: "所有项目的 API 调用总量，包括成功和失败的请求",
    subMetrics: [
      { label: "成功调用", value: "2,478,291", change: "+12.6%", positive: true },
      { label: "失败调用", value: "3,101", change: "-2.1%", positive: true },
      { label: "平均 QPS", value: "28.7", change: "+5.2%", positive: true },
      { label: "峰值 QPS", value: "142", change: "+8.4%", positive: true },
    ],
  },
  cost: {
    icon: <DollarSign className="h-5 w-5" />,
    description: "本月累计 API 调用成本，按模型提供商计费",
    subMetrics: [
      { label: "OpenAI", value: "$8,420.50", change: "+5.2%", positive: false },
      { label: "Anthropic", value: "$5,218.30", change: "-12.4%", positive: true },
      { label: "Google", value: "$2,890.20", change: "+3.1%", positive: false },
      { label: "DeepSeek", value: "$1,718.20", change: "-28.5%", positive: true },
    ],
  },
  tokens: {
    icon: <Cpu className="h-5 w-5" />,
    description: "处理的 Token 总量，包括输入和输出 Token",
    subMetrics: [
      { label: "输入 Token", value: "880.4 M", change: "+22.1%", positive: true },
      { label: "输出 Token", value: "539.6 M", change: "+28.4%", positive: true },
      { label: "平均输入/请求", value: "354", change: "-2.1%", positive: true },
      { label: "平均输出/请求", value: "217", change: "+4.2%", positive: false },
    ],
  },
  success: {
    icon: <CheckCircle className="h-5 w-5" />,
    description: "API 调用成功率及延迟指标",
    subMetrics: [
      { label: "P50 延迟", value: "420ms", change: "-8.2%", positive: true },
      { label: "P95 延迟", value: "842ms", change: "-3.1%", positive: true },
      { label: "P99 延迟", value: "1,240ms", change: "+2.4%", positive: false },
      { label: "超时率", value: "0.08%", change: "-0.02pp", positive: true },
    ],
  },
};

export function KpiGrid() {
  const [selectedKpi, setSelectedKpi] = useState<typeof kpis[number] | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map((k, idx) => (
          <KpiCard 
            key={k.id} 
            kpi={k} 
            delay={idx * 60} 
            onClick={() => setSelectedKpi(k)}
          />
        ))}
      </div>

      <Dialog open={!!selectedKpi} onOpenChange={() => setSelectedKpi(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedKpi && kpiDetails[selectedKpi.id]?.icon}
              {selectedKpi?.label}
            </DialogTitle>
            <DialogDescription>
              {selectedKpi && kpiDetails[selectedKpi.id]?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedKpi && (
            <div className="space-y-6">
              {/* 主指标 */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <div className="text-3xl font-bold tabular">{selectedKpi.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{selectedKpi.sub}</div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  selectedKpi.deltaPositive ? "text-emerald-500" : "text-rose-500"
                }`}>
                  {selectedKpi.deltaPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {selectedKpi.delta}
                </div>
              </div>

              {/* 子指标 */}
              <div>
                <h4 className="text-sm font-medium mb-3">详细指标</h4>
                <div className="grid grid-cols-2 gap-3">
                  {kpiDetails[selectedKpi.id]?.subMetrics.map((metric) => (
                    <div key={metric.label} className="p-3 rounded-lg border border-border bg-card">
                      <div className="text-xs text-muted-foreground">{metric.label}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-semibold tabular">{metric.value}</span>
                        <span className={`text-xs ${metric.positive ? "text-emerald-500" : "text-rose-500"}`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 趋势图 */}
              <div>
                <h4 className="text-sm font-medium mb-2">最近 28 天趋势</h4>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedKpi.spark}>
                      <defs>
                        <linearGradient id={`dialog-grad-${selectedKpi.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(43 55% 54%)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(43 55% 54%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="hsl(43 55% 54%)"
                        strokeWidth={2}
                        fill={`url(#dialog-grad-${selectedKpi.id})`}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function KpiCard({ kpi, delay, onClick }: { kpi: typeof kpis[number]; delay: number; onClick: () => void }) {
  const positive = kpi.deltaPositive;
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border border-border bg-surface hover:border-border-strong hover:bg-surface-elevated cursor-pointer transition-colors animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60" />

      <div className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-medium">{kpi.label}</span>
          <span
            className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-medium rounded px-1.5 py-0.5 border ${
              positive
                ? "text-success border-success/20 bg-success/5"
                : "text-destructive border-destructive/20 bg-destructive/5"
            }`}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {kpi.delta}
          </span>
        </div>
        <div className="mt-2.5 text-[28px] leading-none font-semibold tabular tracking-tight">
          {kpi.value}
        </div>
        <div className="mt-1.5 text-[11px] text-muted-foreground tabular">{kpi.sub}</div>
      </div>

      {/* sparkline */}
      <div className="h-14 px-1 -mb-px">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={kpi.spark}>
            <defs>
              <linearGradient id={`grad-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(43 55% 54%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(43 55% 54%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="hsl(43 55% 54%)"
              strokeWidth={1.5}
              fill={`url(#grad-${kpi.id})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
