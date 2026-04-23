import { useState } from "react";
import { valueAssessment } from "@/lib/mockData";
import { TrendingUp, DollarSign, Clock, Users, BarChart3, Target, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";

const statusStyles: Record<string, string> = {
  扩展中: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  稳定: "bg-primary/15 text-primary border-primary/30",
  待审查: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

interface ProjectItem {
  project: string;
  hoursSaved: number;
  costSaved: number;
  roi: number;
  status: string;
}

export function ValueByProject() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const sorted = [...valueAssessment.byProject].sort((a, b) => b.roi - a.roi);
  const maxRoi = Math.max(...sorted.map((p) => p.roi));

  return (
    <>
      <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 animate-fade-up">
        <header className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">价值 · 按项目</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              点击项目查看详情 · 按 ROI 排名 · &gt;150% 阈值标记"继续扩展"线
            </p>
          </div>
        </header>

        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left font-medium py-2 pr-4">项目</th>
                <th className="text-right font-medium py-2 px-3">节省工时</th>
                <th className="text-right font-medium py-2 px-3">节省成本</th>
                <th className="text-left font-medium py-2 px-3 w-[28%]">ROI</th>
                <th className="text-right font-medium py-2 pl-3">状态</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr 
                  key={p.project} 
                  onClick={() => setSelectedProject(p)}
                  className="border-t border-border/60 hover:bg-surface-elevated/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 pr-4 text-foreground/90 flex items-center gap-2">
                    {p.project}
                    <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </td>
                  <td className="py-3 px-3 text-right tabular font-mono text-foreground/90">
                    {p.hoursSaved.toLocaleString()}h
                  </td>
                  <td className="py-3 px-3 text-right tabular font-mono text-foreground/90">
                    ${p.costSaved.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                          style={{ width: `${(p.roi / maxRoi) * 100}%` }}
                        />
                        {/* 150% threshold marker */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-3 w-px bg-emerald-400/60"
                          style={{ left: `${(150 / maxRoi) * 100}%` }}
                          title="150% ROI threshold"
                        />
                      </div>
                      <span
                        className={`text-xs font-semibold tabular w-12 text-right ${
                          p.roi >= 150 ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {p.roi}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pl-3 text-right">
                    <span
                      className={`inline-flex items-center text-[10px] uppercase tracking-wider font-medium border rounded px-2 py-0.5 ${
                        statusStyles[p.status] || statusStyles.stable
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ProjectDetailSheet project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}

function ProjectDetailSheet({ project, onClose }: { project: ProjectItem | null; onClose: () => void }) {
  if (!project) return null;

  // 模拟详细数据
  const projectDetails: Record<string, { users: number; tasksPerDay: number; avgTimeBefore: number; avgTimeAfter: number; satisfaction: number }> = {
    "客服机器人": { users: 45, tasksPerDay: 2800, avgTimeBefore: 12, avgTimeAfter: 2, satisfaction: 4.6 },
    "营销引擎": { users: 18, tasksPerDay: 420, avgTimeBefore: 180, avgTimeAfter: 25, satisfaction: 4.4 },
    "RAG 检索": { users: 32, tasksPerDay: 890, avgTimeBefore: 25, avgTimeAfter: 5, satisfaction: 4.2 },
    "销售副驾驶": { users: 28, tasksPerDay: 650, avgTimeBefore: 45, avgTimeAfter: 12, satisfaction: 4.3 },
    "内部 HR 机器人": { users: 120, tasksPerDay: 180, avgTimeBefore: 30, avgTimeAfter: 8, satisfaction: 3.8 },
    "代码审查助手": { users: 35, tasksPerDay: 320, avgTimeBefore: 60, avgTimeAfter: 15, satisfaction: 4.1 },
  };

  const details = projectDetails[project.project] || { users: 0, tasksPerDay: 0, avgTimeBefore: 0, avgTimeAfter: 0, satisfaction: 0 };
  const efficiencyGain = ((details.avgTimeBefore - details.avgTimeAfter) / details.avgTimeBefore * 100).toFixed(0);

  const getStatusRecommendation = (status: string, roi: number) => {
    if (status === "扩展中") {
      return {
        title: "建议继续扩展",
        desc: "该项目 ROI 表现优异，建议扩大应用范围或增加使用团队。",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
      };
    }
    if (status === "待审查") {
      return {
        title: "需要关注",
        desc: "ROI 低于预期，建议分析原因并制定改进计划。",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
      };
    }
    return {
      title: "保持稳定",
      desc: "项目运行良好，维持当前策略即可。",
      color: "text-primary",
      bg: "bg-primary/10",
    };
  };

  const recommendation = getStatusRecommendation(project.status, project.roi);

  return (
    <Sheet open={!!project} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {project.project}
          </SheetTitle>
          <SheetDescription>
            项目价值详细分析
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* 核心指标 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
              <div className="text-[10px] uppercase tracking-wider text-primary mb-1">ROI</div>
              <div className="text-3xl font-bold text-primary">{project.roi}%</div>
            </div>
            <div className="rounded-lg border border-border bg-surface-elevated/40 p-4 text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">状态</div>
              <div className="text-lg font-semibold">{project.status}</div>
            </div>
          </div>

          {/* 节省统计 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              节省统计
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">节省工时</div>
                <div className="text-xl font-bold tabular">{project.hoursSaved.toLocaleString()}h</div>
                <div className="text-[10px] text-muted-foreground">相当于 {(project.hoursSaved / 160).toFixed(1)} 人月</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">节省成本</div>
                <div className="text-xl font-bold tabular text-emerald-400">${project.costSaved.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">基于平均人力成本计算</div>
              </div>
            </div>
          </div>

          {/* 使用数据 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              使用数据
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">活跃用户</span>
                <span className="text-sm font-medium">{details.users} 人</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">日均处理任务</span>
                <span className="text-sm font-medium">{details.tasksPerDay.toLocaleString()} 个</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">用户满意度</span>
                <div className="flex items-center gap-2">
                  <Progress value={details.satisfaction * 20} className="w-20 h-1.5" />
                  <span className="text-sm font-medium">{details.satisfaction}/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* 效率提升 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              效率提升
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">平均处理时间（AI前）</span>
                <span className="font-mono">{details.avgTimeBefore} 分钟</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">平均处理时间（AI后）</span>
                <span className="font-mono text-primary">{details.avgTimeAfter} 分钟</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">效率提升</span>
                <span className="text-lg font-bold text-emerald-400">{efficiencyGain}%</span>
              </div>
            </div>
          </div>

          {/* 建议 */}
          <div className={`rounded-lg border p-4 ${recommendation.bg} border-opacity-30`}>
            <h4 className={`text-sm font-medium mb-2 flex items-center gap-2 ${recommendation.color}`}>
              <BarChart3 className="h-4 w-4" />
              {recommendation.title}
            </h4>
            <p className="text-xs text-muted-foreground">{recommendation.desc}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
