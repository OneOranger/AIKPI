import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ValueHeadline } from "@/components/dashboard/ValueHeadline";
import { DeltaGrid } from "@/components/dashboard/DeltaGrid";
import { RoiBridgeChart } from "@/components/dashboard/RoiBridgeChart";
import { ValueBreakdown } from "@/components/dashboard/ValueBreakdown";
import { ValueByProject } from "@/components/dashboard/ValueByProject";
import { DecisionPanel } from "@/components/dashboard/DecisionPanel";

export function ValueAssessment() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar activeKey="价值评估" />

      <main className="flex-1 min-w-0 relative">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

        <div className="relative">
          <Topbar crumb="价值评估" />

          <div className="px-6 lg:px-8 py-6 space-y-6 w-full">
            <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
              <div>
                <h1 className="text-[26px] font-semibold tracking-tight leading-tight">
                  价值<span className="text-gradient-gold">评估</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  高管模式仪表盘 · 为管理层解答"AI 是否值得投资？"的一站式的视图。
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  实时归因 · 4分钟前同步
                </span>
              </div>
            </header>

            <ValueHeadline />

            <DeltaGrid />

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
              <div className="xl:col-span-3">
                <RoiBridgeChart />
              </div>
              <div className="xl:col-span-2">
                <ValueBreakdown />
              </div>
            </div>

            <ValueByProject />

            <DecisionPanel />

            <footer className="pt-2 pb-8 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>AI Pulse · 价值评估 · v0.1 演示</span>
              <span className="font-mono">构建 · 2026.04.18</span>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
