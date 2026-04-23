import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ModelCompareGrid } from "@/components/dashboard/ModelCompareGrid";
import { ModelCompareTable } from "@/components/dashboard/ModelCompareTable";
import { AbSimulator } from "@/components/dashboard/AbSimulator";
import { TaskMatrix } from "@/components/dashboard/TaskMatrix";
import { AccuracyTrendChart } from "@/components/dashboard/AccuracyTrendChart";
import { PromptVersionCompare } from "@/components/dashboard/PromptVersionCompare";

export function ModelCompare() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar activeKey="模型对比" />

      <main className="flex-1 min-w-0 relative">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

        <div className="relative">
          <Topbar crumb="模型对比" />

          <div className="px-6 lg:px-8 py-6 space-y-6 w-full">
            <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
              <div>
                <h1 className="text-[26px] font-semibold tracking-tight leading-tight">
                  模型<span className="text-gradient-gold">对比</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  成本、准确率与延迟并排对比 · 通过 A/B 切换模拟器在上线前预估影响。
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <Metric label="追踪模型" value="4" />
                <Divider />
                <Metric label="评估样本 · 30天" value="48,210" />
                <Divider />
                <Metric label="最佳性价比" value="DeepSeek V3.2" accent />
              </div>
            </header>

            <ModelCompareGrid />

            <AbSimulator />

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
              <div className="xl:col-span-3">
                <AccuracyTrendChart />
              </div>
              <div className="xl:col-span-2">
                <TaskMatrix />
              </div>
            </div>

            <ModelCompareTable />

            <PromptVersionCompare />

            <footer className="pt-2 pb-8 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>AI Pulse · 模型对比 · v0.1 演示</span>
              <span className="font-mono">构建 · 2026.04.18</span>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-end leading-tight">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold tabular ${accent ? "text-primary" : ""}`}>{value}</span>
    </div>
  );
}

function Divider() {
  return <span className="h-6 w-px bg-border" />;
}
