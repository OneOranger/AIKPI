import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { ModelBreakdown } from "@/components/dashboard/ModelBreakdown";
import { ProjectsTable } from "@/components/dashboard/ProjectsTable";
import { LiveCallsFeed } from "@/components/dashboard/LiveCallsFeed";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";

export function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar activeKey="运营概览" />

      <main className="flex-1 min-w-0 relative">
        {/* ambient background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

        <div className="relative">
          <Topbar />

          <div className="px-6 lg:px-8 py-6 space-y-6 w-full">
            {/* Page header */}
            <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
              <div>
                <h1 className="text-[26px] font-semibold tracking-tight leading-tight">
                  运营<span className="text-gradient-gold">概览</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  每个模型、每个项目、每次调用 — 尽在掌控。
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <Metric label="活跃项目" value="12" />
                <Divider />
                <Metric label="活跃模型" value="8" />
                <Divider />
                <Metric label="在线时长 · 30天" value="99.99%" accent />
              </div>
            </header>

            <KpiGrid />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2">
                <TrendChart />
              </div>
              <div>
                <ModelBreakdown />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2">
                <ProjectsTable />
              </div>
              <div>
                <AlertsPanel />
              </div>
            </div>

            <LiveCallsFeed />

            <footer className="pt-2 pb-8 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>AI Pulse · KPI 仪表盘 · v0.1 演示</span>
              <span className="font-mono">构建 · 2026.04.18</span>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}

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
