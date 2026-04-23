import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, MoreHorizontal, FolderOpen, Activity, DollarSign, TrendingUp, Users, Clock } from "lucide-react";
import { projects } from "@/lib/mockData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const statusStyles: Record<string, string> = {
  健康: "bg-success/10 text-success border-success/20",
  警告: "bg-warning/10 text-warning border-warning/20",
  严重: "bg-destructive/10 text-destructive border-destructive/20",
};

// 项目详情扩展数据
const projectDetails: Record<string, {
  description: string;
  owner: string;
  createdAt: string;
  models: string[];
  dailyCalls: number;
  avgLatency: number;
  errorRate: string;
}> = {
  "客服助手": {
    description: "智能客服对话系统，支持多轮对话和意图识别",
    owner: "张小明",
    createdAt: "2025-08-15",
    models: ["GPT-5", "Claude 4.5 Sonnet"],
    dailyCalls: 120280,
    avgLatency: 420,
    errorRate: "0.12%",
  },
  "营销内容引擎": {
    description: "自动生成营销文案、邮件和社交媒体内容",
    owner: "李华",
    createdAt: "2025-09-20",
    models: ["GPT-5", "Gemini 2.5 Pro"],
    dailyCalls: 74840,
    avgLatency: 380,
    errorRate: "0.08%",
  },
  "RAG / 知识检索": {
    description: "基于向量数据库的企业知识检索系统",
    owner: "王芳",
    createdAt: "2025-10-05",
    models: ["Claude 4.5 Sonnet", "DeepSeek V3.2"],
    dailyCalls: 58900,
    avgLatency: 680,
    errorRate: "0.24%",
  },
  "代码审查助手": {
    description: "自动代码审查、Bug 检测和优化建议",
    owner: "刘强",
    createdAt: "2025-11-12",
    models: ["Claude 4.5 Sonnet", "GPT-5"],
    dailyCalls: 40200,
    avgLatency: 520,
    errorRate: "0.15%",
  },
  "销售外呼 AI": {
    description: "智能销售外呼系统，支持语音识别和合成",
    owner: "陈静",
    createdAt: "2025-12-01",
    models: ["GPT-5", "Gemini 2.5 Pro"],
    dailyCalls: 31270,
    avgLatency: 450,
    errorRate: "0.10%",
  },
  "内部 HR 机器人": {
    description: "员工自助服务机器人，处理请假、报销等流程",
    owner: "赵敏",
    createdAt: "2026-01-10",
    models: ["DeepSeek V3.2"],
    dailyCalls: 20290,
    avgLatency: 380,
    errorRate: "0.42%",
  },
};

export function ProjectsTable() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[number] | null>(null);

  return (
    <>
      <div className="rounded-xl border border-border bg-surface overflow-hidden animate-fade-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">热门项目</h3>
            <p className="text-xs text-muted-foreground mt-1">按支出排名 · 最近 7 天</p>
          </div>
          <button className="text-[11px] text-primary hover:text-primary-glow transition-colors">查看全部 →</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="font-medium px-5 py-2.5">项目</th>
                <th className="font-medium px-3 py-2.5">状态</th>
                <th className="font-medium px-3 py-2.5 text-right">调用次数</th>
                <th className="font-medium px-3 py-2.5 text-right">成本</th>
                <th className="font-medium px-3 py-2.5 text-right">ROI</th>
                <th className="font-medium px-3 py-2.5 text-right">趋势</th>
                <th className="font-medium px-3 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const trendUp = p.trend.startsWith("+");
                return (
                  <tr
                    key={p.name}
                    onClick={() => setSelectedProject(p)}
                    className="border-b border-border last:border-0 hover:bg-surface-elevated/50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-7 w-7 rounded-md bg-surface-muted border border-border flex items-center justify-center text-[10px] font-mono text-primary shrink-0">
                          {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{p.name}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{p.env}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider rounded border px-1.5 py-0.5 ${statusStyles[p.status]}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right tabular">{p.calls.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right tabular font-medium">${p.cost.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-mono font-medium text-primary tabular">{p.roi}%</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={`inline-flex items-center gap-0.5 font-mono tabular ${trendUp ? "text-success" : "text-destructive"}`}>
                        {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {p.trend.replace("+", "").replace("−", "")}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button 
                        className="text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              {selectedProject?.name}
            </SheetTitle>
            <SheetDescription>
              {selectedProject && projectDetails[selectedProject.name]?.description}
            </SheetDescription>
          </SheetHeader>
          
          {selectedProject && (
            <div className="mt-6 space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Users className="h-3.5 w-3.5" />
                    负责人
                  </div>
                  <div className="text-sm font-medium">{projectDetails[selectedProject.name]?.owner}</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    创建时间
                  </div>
                  <div className="text-sm font-medium">{projectDetails[selectedProject.name]?.createdAt}</div>
                </div>
              </div>

              {/* 状态卡片 */}
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">当前状态</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider rounded border px-1.5 py-0.5 ${statusStyles[selectedProject.status]}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {selectedProject.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary tabular">{selectedProject.roi}%</div>
                    <div className="text-[10px] text-muted-foreground">ROI</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold tabular">{selectedProject.trend}</div>
                    <div className="text-[10px] text-muted-foreground">趋势</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold tabular">{selectedProject.env}</div>
                    <div className="text-[10px] text-muted-foreground">环境</div>
                  </div>
                </div>
              </div>

              {/* 使用数据 */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  使用统计
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="text-sm text-muted-foreground">总调用次数</span>
                    <span className="font-mono font-medium tabular">{selectedProject.calls.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="text-sm text-muted-foreground">日均调用</span>
                    <span className="font-mono font-medium tabular">{projectDetails[selectedProject.name]?.dailyCalls.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="text-sm text-muted-foreground">总成本</span>
                    <span className="font-mono font-medium tabular">${selectedProject.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="text-sm text-muted-foreground">平均延迟</span>
                    <span className="font-mono font-medium tabular">{projectDetails[selectedProject.name]?.avgLatency}ms</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="text-sm text-muted-foreground">错误率</span>
                    <span className="font-mono font-medium tabular">{projectDetails[selectedProject.name]?.errorRate}</span>
                  </div>
                </div>
              </div>

              {/* 使用模型 */}
              <div>
                <h4 className="text-sm font-medium mb-3">使用模型</h4>
                <div className="flex flex-wrap gap-2">
                  {projectDetails[selectedProject.name]?.models.map((model) => (
                    <span key={model} className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
