import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { toast } from "sonner";
import {
  Plus,
  Search,
  FolderKanban,
  Activity,
  DollarSign,
  TrendingUp,
  Clock,
  Layers,
  MoreHorizontal,
  BarChart3,
  Cpu,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Target,
} from "lucide-react";

// Mock 数据 - 项目
const projectsData = [
  {
    id: "proj-001",
    name: "智能客服助手",
    description: "面向客户的智能问答系统",
    status: "active",
    calls: 1258900,
    monthlyCost: 28500,
    roi: 3.2,
    accuracy: 94.5,
    models: ["GPT-4", "Claude-3"],
    lastActive: "2分钟前",
    trend: [
      { v: 4200 }, { v: 4500 }, { v: 4300 }, { v: 4800 }, { v: 5100 }, { v: 5300 }, { v: 5600 },
    ],
  },
  {
    id: "proj-002",
    name: "代码生成引擎",
    description: "自动化代码补全与生成",
    status: "active",
    calls: 892300,
    monthlyCost: 18200,
    roi: 4.1,
    accuracy: 91.2,
    models: ["GPT-4", "CodeLlama"],
    lastActive: "5分钟前",
    trend: [
      { v: 3800 }, { v: 4100 }, { v: 3900 }, { v: 4200 }, { v: 4500 }, { v: 4700 }, { v: 4900 },
    ],
  },
  {
    id: "proj-003",
    name: "文档分析系统",
    description: "合同与法律文档智能解析",
    status: "active",
    calls: 456700,
    monthlyCost: 12400,
    roi: 2.8,
    accuracy: 96.8,
    models: ["Claude-3", "GPT-4"],
    lastActive: "12分钟前",
    trend: [
      { v: 2100 }, { v: 2300 }, { v: 2200 }, { v: 2500 }, { v: 2600 }, { v: 2800 }, { v: 2900 },
    ],
  },
  {
    id: "proj-004",
    name: "营销文案生成",
    description: "多语言营销内容自动生成",
    status: "paused",
    calls: 234500,
    monthlyCost: 5600,
    roi: 1.9,
    accuracy: 88.5,
    models: ["GPT-3.5"],
    lastActive: "2小时前",
    trend: [
      { v: 1200 }, { v: 1100 }, { v: 1000 }, { v: 900 }, { v: 800 }, { v: 700 }, { v: 600 },
    ],
  },
  {
    id: "proj-005",
    name: "数据分析助手",
    description: "业务数据智能分析与报告",
    status: "active",
    calls: 678900,
    monthlyCost: 15600,
    roi: 3.5,
    accuracy: 92.3,
    models: ["GPT-4", "Claude-3", "Gemini"],
    lastActive: "8分钟前",
    trend: [
      { v: 2800 }, { v: 3000 }, { v: 3200 }, { v: 3100 }, { v: 3400 }, { v: 3600 }, { v: 3800 },
    ],
  },
  {
    id: "proj-006",
    name: "语音转写服务",
    description: "会议录音转文字与摘要",
    status: "archived",
    calls: 123400,
    monthlyCost: 3200,
    roi: 1.5,
    accuracy: 85.2,
    models: ["Whisper", "GPT-3.5"],
    lastActive: "3天前",
    trend: [
      { v: 800 }, { v: 750 }, { v: 700 }, { v: 650 }, { v: 600 }, { v: 550 }, { v: 500 },
    ],
  },
  {
    id: "proj-007",
    name: "知识库问答",
    description: "企业内部知识检索与问答",
    status: "active",
    calls: 567800,
    monthlyCost: 11200,
    roi: 2.9,
    accuracy: 93.1,
    models: ["GPT-4", "Embedding-v3"],
    lastActive: "15分钟前",
    trend: [
      { v: 2200 }, { v: 2400 }, { v: 2300 }, { v: 2600 }, { v: 2800 }, { v: 3000 }, { v: 3200 },
    ],
  },
  {
    id: "proj-008",
    name: "图像描述生成",
    description: "产品图片自动描述生成",
    status: "paused",
    calls: 189200,
    monthlyCost: 4800,
    roi: 1.8,
    accuracy: 89.7,
    models: ["GPT-4V", "Claude-3"],
    lastActive: "1天前",
    trend: [
      { v: 900 }, { v: 850 }, { v: 800 }, { v: 750 }, { v: 700 }, { v: 650 }, { v: 600 },
    ],
  },
];

// 状态配置
const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "活跃", variant: "default" },
  paused: { label: "暂停", variant: "secondary" },
  archived: { label: "归档", variant: "outline" },
};

// 格式化数字
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// 格式化货币
function formatCurrency(num: number): string {
  return "¥" + num.toLocaleString();
}

export function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projectsData[0] | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // 新建项目表单状态
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectModel, setNewProjectModel] = useState("");

  // 筛选项目
  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 统计数据
  const totalProjects = projectsData.length;
  const activeProjects = projectsData.filter((p) => p.status === "active").length;
  const totalMonthlyCost = projectsData
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.monthlyCost, 0);
  const avgRoi = projectsData
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.roi, 0) / activeProjects || 0;

  // 处理项目卡片点击
  const handleProjectClick = (project: typeof projectsData[0]) => {
    setSelectedProject(project);
    setIsSheetOpen(true);
  };

  // 处理创建项目
  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error("请输入项目名称");
      return;
    }
    if (!newProjectModel) {
      toast.error("请选择模型");
      return;
    }
    
    toast.success("项目创建成功", {
      description: `项目 "${newProjectName}" 已创建`,
    });
    
    // 重置表单
    setNewProjectName("");
    setNewProjectDesc("");
    setNewProjectModel("");
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar activeKey="项目管理" />
      <main className="flex-1 relative overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-5" />
        <Topbar crumb="Projects" />
        <div className="px-6 lg:px-8 py-6 space-y-6">
          {/* 页面头部 */}
          <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
            <div>
              <h1 className="text-[26px] font-semibold tracking-tight leading-tight">
                项目<span className="text-gradient-gold">管理</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                管理所有 AI 项目，监控调用量、成本与 ROI
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索项目..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    新建项目
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>新建项目</DialogTitle>
                    <DialogDescription>
                      创建一个新的 AI 项目，配置基本信息和模型
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">项目名称</label>
                      <Input 
                        placeholder="输入项目名称" 
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">项目描述</label>
                      <Input 
                        placeholder="输入项目描述" 
                        value={newProjectDesc}
                        onChange={(e) => setNewProjectDesc(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">选择模型</label>
                      <Select value={newProjectModel} onValueChange={setNewProjectModel}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择模型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="claude-3">Claude-3</SelectItem>
                          <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                          <SelectItem value="gemini">Gemini</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={handleCreateProject}>创建项目</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {/* 统计概览行 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 animate-fade-up" style={{ animationDelay: "60ms" }}>
            <StatCard
              icon={FolderKanban}
              label="总项目数"
              value={totalProjects.toString()}
              subtext="包含所有状态"
            />
            <StatCard
              icon={Activity}
              label="活跃项目"
              value={activeProjects.toString()}
              subtext="正在运行中"
              accent
            />
            <StatCard
              icon={DollarSign}
              label="本月总成本"
              value={formatCurrency(totalMonthlyCost)}
              subtext="活跃项目合计"
            />
            <StatCard
              icon={TrendingUp}
              label="平均 ROI"
              value={avgRoi.toFixed(1) + "x"}
              subtext="投资回报比"
              accent
            />
          </div>

          {/* 筛选器 */}
          <div className="flex items-center gap-2 animate-fade-up" style={{ animationDelay: "120ms" }}>
            <span className="text-sm text-muted-foreground">状态筛选：</span>
            <div className="flex gap-2">
              {[
                { key: "all", label: "全部" },
                { key: "active", label: "活跃" },
                { key: "paused", label: "暂停" },
                { key: "archived", label: "归档" },
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={statusFilter === filter.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(filter.key)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 项目卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: "180ms" }}>
            {filteredProjects.map((project, idx) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                delay={idx * 60} 
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>

          {/* 空状态 */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12 animate-fade-up">
              <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">没有找到匹配的项目</p>
            </div>
          )}

          <footer className="pt-2 pb-8 text-[11px] text-muted-foreground flex items-center justify-between animate-fade-up" style={{ animationDelay: "240ms" }}>
            <span>AI Pulse · Projects · v0.1 demo</span>
            <span className="font-mono">build · 2026.04.18</span>
          </footer>
        </div>
      </main>

      {/* 项目详情侧面板 */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl bg-surface border-border overflow-y-auto">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="text-base flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              {selectedProject?.name}
            </SheetTitle>
            <SheetDescription className="text-xs">
              {selectedProject?.description}
            </SheetDescription>
          </SheetHeader>

          {selectedProject && (
            <div className="mt-6 space-y-6">
              {/* 状态徽章 */}
              <div className="flex items-center gap-2">
                <Badge variant={statusConfig[selectedProject.status].variant} className="text-xs">
                  {statusConfig[selectedProject.status].label}
                </Badge>
                <span className="text-xs text-muted-foreground">ID: {selectedProject.id}</span>
              </div>

              {/* 关键指标 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">总调用量</span>
                  </div>
                  <p className="text-xl font-semibold">{formatNumber(selectedProject.calls)}</p>
                </div>
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">月成本</span>
                  </div>
                  <p className="text-xl font-semibold">¥{selectedProject.monthlyCost.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">ROI</span>
                  </div>
                  <p className="text-xl font-semibold text-primary">{selectedProject.roi}x</p>
                </div>
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">准确率</span>
                  </div>
                  <p className="text-xl font-semibold">{selectedProject.accuracy}%</p>
                </div>
              </div>

              {/* 模型使用情况 */}
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">使用模型</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.models.map((model) => (
                    <Badge key={model} variant="outline" className="text-xs px-3 py-1">
                      {model}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 历史趋势图表 */}
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">7天调用趋势</h4>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedProject.trend}>
                      <defs>
                        <linearGradient id="detail-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(43 55% 54%)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(43 55% 54%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 100% / 0.04)" vertical={false} />
                      <XAxis dataKey="v" hide />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(0 0% 8%)",
                          border: "1px solid hsl(0 0% 16%)",
                          borderRadius: 8,
                          fontSize: 11,
                        }}
                        formatter={(v: number) => [v.toLocaleString(), "调用量"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="hsl(43 55% 54%)"
                        strokeWidth={2}
                        fill="url(#detail-grad)"
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => {
                  toast.success("已打开项目控制台", { description: selectedProject.name });
                }}>
                  打开控制台
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => {
                  toast.info("设置功能开发中");
                }}>
                  项目设置
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// 统计卡片组件
function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  accent?: boolean;
}) {
  return (
    <Card className="border-border bg-surface hover:border-border-strong transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-medium">
              {label}
            </p>
            <p className={`text-[28px] leading-none font-semibold tabular tracking-tight mt-2.5 ${accent ? "text-primary" : ""}`}>
              {value}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1.5">{subtext}</p>
          </div>
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent ? "bg-primary/10" : "bg-surface-elevated"}`}>
            <Icon className={`h-5 w-5 ${accent ? "text-primary" : "text-muted-foreground"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 项目卡片组件
function ProjectCard({
  project,
  delay,
  onClick,
}: {
  project: typeof projectsData[number];
  delay: number;
  onClick?: () => void;
}) {
  const status = statusConfig[project.status];

  return (
    <Card
      className="group border-border bg-surface hover:border-border-strong transition-all hover:shadow-lg overflow-hidden cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      {/* 顶部装饰线 */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold truncate">{project.name}</CardTitle>
              <Badge variant={status.variant} className="text-[10px]">{status.label}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">{project.description}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 关键指标 */}
        <div className="grid grid-cols-4 gap-2">
          <MetricItem label="调用量" value={formatNumber(project.calls)} />
          <MetricItem label="月成本" value={"¥" + (project.monthlyCost / 1000).toFixed(1) + "k"} />
          <MetricItem label="ROI" value={project.roi + "x"} accent />
          <MetricItem label="准确率" value={project.accuracy + "%"} />
        </div>

        {/* 模型列表 */}
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="flex gap-1.5 flex-wrap">
            {project.models.map((model) => (
              <Badge key={model} variant="outline" className="text-[10px] font-normal">
                {model}
              </Badge>
            ))}
          </div>
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>最近活跃: {project.lastActive}</span>
          </div>
          {/* 迷你 Sparkline */}
          <div className="h-8 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={project.trend}>
                <defs>
                  <linearGradient id={`grad-${project.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(43 55% 54%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(43 55% 54%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="hsl(43 55% 54%)"
                  strokeWidth={1.5}
                  fill={`url(#grad-${project.id})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 指标项组件
function MetricItem({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-semibold tabular mt-0.5 ${accent ? "text-primary" : ""}`}>
        {value}
      </p>
    </div>
  );
}
