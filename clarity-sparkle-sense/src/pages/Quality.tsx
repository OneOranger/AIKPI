import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { QualityHeadline } from "@/components/dashboard/QualityHeadline";
import { AccuracyByTask } from "@/components/dashboard/AccuracyByTask";
import { RetrievalMetrics } from "@/components/dashboard/RetrievalMetrics";
import { JudgeScores } from "@/components/dashboard/JudgeScores";
import { ConsistencyPanel } from "@/components/dashboard/ConsistencyPanel";
import { ErrorTypeDistribution } from "@/components/dashboard/ErrorTypeDistribution";
import { UserFeedbackPanel } from "@/components/dashboard/UserFeedbackPanel";
import { QualityTrendChart } from "@/components/dashboard/QualityTrendChart";

export function Quality() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar activeKey="质量评估" />

      <main className="flex-1 min-w-0 relative">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

        <div className="relative">
          <Topbar crumb="质量评估" />

          <div className="px-6 lg:px-8 py-6 space-y-6 w-full">
            <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
              <div>
                <h1 className="text-[26px] font-semibold tracking-tight leading-tight">
                  质量<span className="text-gradient-gold">指标</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  准确率 · 召回率 · 幻觉率 · 一致性 · LLM 评判与人类反馈 — 每个信号都在回答"AI 真的正确吗？"
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  自动评估运行中 · 每小时 412 样本
                </span>
              </div>
            </header>

            <QualityHeadline />

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
              <div className="xl:col-span-3">
                <QualityTrendChart />
              </div>
              <div className="xl:col-span-2">
                <JudgeScores />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <AccuracyByTask />
              <RetrievalMetrics />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <ErrorTypeDistribution />
              <ConsistencyPanel />
              <UserFeedbackPanel />
            </div>

            <footer className="pt-2 pb-8 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>AI Pulse · 质量指标 · v0.1 演示</span>
              <span className="font-mono">构建 · 2026.04.18</span>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
