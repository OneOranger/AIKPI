import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  FlaskConical,
  Play,
  CheckCircle,
  FileText,
  Plus,
  TrendingUp,
  BarChart3,
  Clock,
  ArrowRight,
  AlertCircle,
  Square,
  FileBarChart,
  X,
  Target,
  DollarSign,
  Users,
} from "lucide-react";

type ExperimentStatus = "running" | "completed" | "draft";
type ExperimentType = "model" | "prompt" | "parameter";

interface Experiment {
  id: string;
  name: string;
  status: ExperimentStatus;
  type: ExperimentType;
  controlGroup: string;
  treatmentGroup: string;
  accuracyDiff: number;
  costDiff: number;
  trafficSplit: number;
  startTime: string;
  endTime?: string;
  pValue: number;
  sampleSize: number;
}

const mockExperiments: Experiment[] = [
  {
    id: "exp-001",
    name: "GPT-4 vs Claude 3.5 客服场景测试",
    status: "running",
    type: "model",
    controlGroup: "GPT-4",
    treatmentGroup: "Claude 3.5 Sonnet",
    accuracyDiff: 3.2,
    costDiff: -15,
    trafficSplit: 50,
    startTime: "2026-04-01",
    pValue: 0.03,
    sampleSize: 12500,
  },
  {
    id: "exp-002",
    name: "Prompt V2 优化实验",
    status: "completed",
    type: "prompt",
    controlGroup: "Prompt V1",
    treatmentGroup: "Prompt V2 (CoT)",
    accuracyDiff: 8.5,
    costDiff: 5,
    trafficSplit: 100,
    startTime: "2026-03-15",
    endTime: "2026-03-29",
    pValue: 0.001,
    sampleSize: 30000,
  },
  {
    id: "exp-003",
    name: "Temperature 参数调优",
    status: "draft",
    type: "parameter",
    controlGroup: "temp=0.7",
    treatmentGroup: "temp=0.3",
    accuracyDiff: 0,
    costDiff: 0,
    trafficSplit: 30,
    startTime: "",
    pValue: 1,
    sampleSize: 0,
  },
  {
    id: "exp-004",
    name: "多语言翻译模型对比",
    status: "running",
    type: "model",
    controlGroup: "GPT-4",
    treatmentGroup: "DeepL API",
    accuracyDiff: -1.8,
    costDiff: -40,
    trafficSplit: 40,
    startTime: "2026-04-10",
    pValue: 0.12,
    sampleSize: 5600,
  },
  {
    id: "exp-005",
    name: "系统 Prompt 长度优化",
    status: "completed",
    type: "prompt",
    controlGroup: "长系统提示",
    treatmentGroup: "精简系统提示",
    accuracyDiff: -0.5,
    costDiff: -25,
    trafficSplit: 100,
    startTime: "2026-03-01",
    endTime: "2026-03-14",
    pValue: 0.45,
    sampleSize: 25000,
  },
  {
    id: "exp-006",
    name: "Max Tokens 参数实验",
    status: "running",
    type: "parameter",
    controlGroup: "max_tokens=2048",
    treatmentGroup: "max_tokens=4096",
    accuracyDiff: 5.1,
    costDiff: 18,
    trafficSplit: 50,
    startTime: "2026-04-12",
    pValue: 0.02,
    sampleSize: 8900,
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const statusConfig: Record<ExperimentStatus, { label: string; color: string; icon: any }> = {
  running: { label: "进行中", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20", icon: Play },
  completed: { label: "已完成", color: "bg-blue-500/15 text-blue-600 border-blue-500/20", icon: CheckCircle },
  draft: { label: "草稿", color: "bg-slate-500/15 text-slate-600 border-slate-500/20", icon: FileText },
};

const typeConfig: Record<ExperimentType, string> = {
  model: "模型对比",
  prompt: "Prompt 版本",
  parameter: "参数调优",
};

function ExperimentCard({ 
  experiment, 
  onClick, 
  onStop, 
  onViewReport 
}: { 
  experiment: Experiment; 
  onClick?: () => void;
  onStop?: () => void;
  onViewReport?: () => void;
}) {
  const status = statusConfig[experiment.status];
  const StatusIcon = status.icon;
  const isSignificant = experiment.pValue < 0.05 && experiment.status !== "draft";

  return (
    <Card 
      className="bg-surface border-border hover:border-border-strong/60 transition-colors animate-fade-up cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base font-semibold truncate">{experiment.name}</CardTitle>
              <Badge variant="outline" className={status.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
              {isSignificant && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
                  显著
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs mt-1.5">
              {typeConfig[experiment.type]} · ID: {experiment.id}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 对照组 vs 实验组 */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">对照组</div>
            <div className="font-medium truncate bg-muted/50 rounded px-2 py-1">{experiment.controlGroup}</div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">实验组</div>
            <div className="font-medium truncate bg-primary/10 rounded px-2 py-1 text-primary">{experiment.treatmentGroup}</div>
          </div>
        </div>

        {/* 关键指标 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
              <BarChart3 className="h-3 w-3" />
              准确率差异
            </div>
            <div className={`text-lg font-semibold ${experiment.accuracyDiff >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {experiment.accuracyDiff > 0 ? "+" : ""}{experiment.accuracyDiff}%
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              成本差异
            </div>
            <div className={`text-lg font-semibold ${experiment.costDiff <= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {experiment.costDiff > 0 ? "+" : ""}{experiment.costDiff}%
            </div>
          </div>
        </div>

        {/* 流量分配 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">流量分配</span>
            <span className="font-medium">{experiment.trafficSplit}% / {100 - experiment.trafficSplit}%</span>
          </div>
          <Progress value={experiment.trafficSplit} className="h-2" />
        </div>

        {/* 时间和统计 */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>
              {experiment.startTime || "未开始"}
              {experiment.endTime && ` → ${experiment.endTime}`}
            </span>
          </div>
          {experiment.status !== "draft" && (
            <div className="flex items-center gap-1.5">
              <span>p = {experiment.pValue.toFixed(3)}</span>
              <span className="text-border">|</span>
              <span>n = {experiment.sampleSize.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
          {experiment.status === "running" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={onStop}
            >
              <Square className="h-3 w-3 mr-1" />
              停止实验
            </Button>
          )}
          {experiment.status === "completed" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-xs"
              onClick={onViewReport}
            >
              <FileBarChart className="h-3 w-3 mr-1" />
              查看报告
            </Button>
          )}
          {experiment.status === "draft" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-xs"
              onClick={() => toast.info("开始运行实验")}
            >
              <Play className="h-3 w-3 mr-1" />
              开始运行
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CreateExperimentDialog({ onCreate }: { onCreate?: (data: { name: string; type: string; traffic: number }) => void }) {
  const [open, setOpen] = useState(false);
  const [trafficSplit, setTrafficSplit] = useState([50]);
  const [expName, setExpName] = useState("");
  const [expType, setExpType] = useState("");
  const [controlGroup, setControlGroup] = useState("");
  const [treatmentGroup, setTreatmentGroup] = useState("");

  const handleCreate = () => {
    if (!expName.trim()) {
      toast.error("请输入实验名称");
      return;
    }
    if (!expType) {
      toast.error("请选择实验类型");
      return;
    }
    if (!controlGroup || !treatmentGroup) {
      toast.error("请选择对照组和实验组");
      return;
    }

    onCreate?.({
      name: expName,
      type: expType,
      traffic: trafficSplit[0],
    });

    toast.success("实验创建成功", {
      description: `实验 "${expName}" 已创建，流量分配: ${trafficSplit[0]}%`,
    });

    // 重置表单
    setExpName("");
    setExpType("");
    setControlGroup("");
    setTreatmentGroup("");
    setTrafficSplit([50]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-gold text-primary-foreground hover:opacity-95 transition-opacity">
          <Plus className="h-4 w-4 mr-1.5" />
          创建实验
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            创建新实验
          </DialogTitle>
          <DialogDescription>配置 A/B 测试或 Prompt 优化实验的参数</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">实验名称</label>
            <Input 
              placeholder="输入实验名称..." 
              className="bg-background border-border" 
              value={expName}
              onChange={(e) => setExpName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">实验类型</label>
            <Select value={expType} onValueChange={setExpType}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="选择实验类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="model">模型对比</SelectItem>
                <SelectItem value="prompt">Prompt 版本</SelectItem>
                <SelectItem value="parameter">参数调优</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">对照组</label>
              <Select value={controlGroup} onValueChange={setControlGroup}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="选择对照组" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt4">GPT-4</SelectItem>
                  <SelectItem value="gpt35">GPT-3.5</SelectItem>
                  <SelectItem value="claude">Claude 3.5</SelectItem>
                  <SelectItem value="prompt-v1">Prompt V1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">实验组</label>
              <Select value={treatmentGroup} onValueChange={setTreatmentGroup}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="选择实验组" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt4">GPT-4</SelectItem>
                  <SelectItem value="gpt35">GPT-3.5</SelectItem>
                  <SelectItem value="claude">Claude 3.5</SelectItem>
                  <SelectItem value="prompt-v2">Prompt V2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">流量分配比例</label>
              <span className="text-sm font-semibold text-primary">{trafficSplit[0]}% / {100 - trafficSplit[0]}%</span>
            </div>
            <Slider
              value={trafficSplit}
              onValueChange={setTrafficSplit}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>实验组</span>
              <span>对照组</span>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-700">
              <span className="font-medium">提示：</span>
              建议实验组流量不超过 50%，以确保对照组有足够样本量进行统计对比。
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-border">
            取消
          </Button>
          <Button 
            className="bg-gradient-gold text-primary-foreground hover:opacity-95 transition-opacity"
            onClick={handleCreate}
          >
            创建实验
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Experiments() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredExperiments = mockExperiments.filter((exp) => {
    if (activeTab === "all") return true;
    return exp.status === activeTab;
  });

  const stats = {
    running: mockExperiments.filter((e) => e.status === "running").length,
    completed: mockExperiments.filter((e) => e.status === "completed").length,
    avgImprovement: mockExperiments
      .filter((e) => e.status === "completed" && e.pValue < 0.05)
      .reduce((acc, e) => acc + e.accuracyDiff, 0) / 
      Math.max(1, mockExperiments.filter((e) => e.status === "completed" && e.pValue < 0.05).length),
  };

  // 处理实验卡片点击
  const handleExperimentClick = (exp: Experiment) => {
    setSelectedExperiment(exp);
    setIsDetailOpen(true);
  };

  // 处理停止实验
  const handleStopExperiment = (exp: Experiment) => {
    toast.success("实验已停止", {
      description: `实验 "${exp.name}" 已停止运行`,
    });
  };

  // 处理查看报告
  const handleViewReport = (exp: Experiment) => {
    toast.success("正在生成报告", {
      description: `实验 "${exp.name}" 的详细报告`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar activeKey="实验管理" />
      <main className="flex-1 relative overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-5" />
        <Topbar crumb="Experiments" />
        <div className="px-6 lg:px-8 py-6 space-y-6">
          {/* 页面头部 */}
          <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
            <div>
              <h1 className="text-[26px] font-semibold tracking-tight leading-tight">
                实验管理
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                A/B 测试与 Prompt 优化实验
              </p>
            </div>
            <CreateExperimentDialog onCreate={(data) => {
              toast.success("创建实验", {
                description: `${data.name} (${data.type}) - 流量: ${data.traffic}%`,
              });
            }} />
          </header>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up">
            <Card className="bg-surface border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">进行中实验</div>
                    <div className="text-2xl font-semibold">{stats.running}</div>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Play className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-surface border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">已完成实验</div>
                    <div className="text-2xl font-semibold">{stats.completed}</div>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-surface border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">平均提升幅度</div>
                    <div className="text-2xl font-semibold text-emerald-600">+{stats.avgImprovement.toFixed(1)}%</div>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 实验列表 */}
          <div className="animate-fade-up">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-surface border border-border mb-4">
                <TabsTrigger value="all" className="data-[state=active]:bg-background">
                  全部
                  <Badge variant="secondary" className="ml-2 text-[10px]">
                    {mockExperiments.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="running" className="data-[state=active]:bg-background">
                  进行中
                  <Badge variant="secondary" className="ml-2 text-[10px]">
                    {mockExperiments.filter((e) => e.status === "running").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-background">
                  已完成
                  <Badge variant="secondary" className="ml-2 text-[10px]">
                    {mockExperiments.filter((e) => e.status === "completed").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="draft" className="data-[state=active]:bg-background">
                  草稿
                  <Badge variant="secondary" className="ml-2 text-[10px]">
                    {mockExperiments.filter((e) => e.status === "draft").length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredExperiments.map((experiment) => (
                    <ExperimentCard 
                      key={experiment.id} 
                      experiment={experiment} 
                      onClick={() => handleExperimentClick(experiment)}
                      onStop={() => handleStopExperiment(experiment)}
                      onViewReport={() => handleViewReport(experiment)}
                    />
                  ))}
                </div>
                {filteredExperiments.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>暂无{activeTab === "all" ? "" : statusConfig[activeTab as ExperimentStatus]?.label}实验</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <footer className="pt-2 pb-8 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>AI Pulse · KPI Dashboard · v0.1 demo</span>
            <span className="font-mono">build · 2026.04.18</span>
          </footer>
        </div>
      </main>

      {/* 实验详情弹窗 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px] bg-surface border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedExperiment && (
                <>
                  <FlaskConical className="h-5 w-5 text-primary" />
                  <span>{selectedExperiment.name}</span>
                  <Badge variant="outline" className={statusConfig[selectedExperiment.status].color}>
                    {(() => {
                      const IconComponent = statusConfig[selectedExperiment.status].icon;
                      return IconComponent && <IconComponent className="h-3 w-3 mr-1" />;
                    })()}
                    {statusConfig[selectedExperiment.status].label}
                  </Badge>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedExperiment && `${typeConfig[selectedExperiment.type]} · ID: ${selectedExperiment.id}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedExperiment && (
            <div className="space-y-6">
              {/* 对照组 vs 实验组 */}
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center flex-1">
                    <p className="text-xs text-muted-foreground mb-1">对照组</p>
                    <p className="font-medium">{selectedExperiment.controlGroup}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground mx-4" />
                  <div className="text-center flex-1">
                    <p className="text-xs text-muted-foreground mb-1">实验组</p>
                    <p className="font-medium text-primary">{selectedExperiment.treatmentGroup}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">流量分配</span>
                    <span className="font-medium">{selectedExperiment.trafficSplit}% / {100 - selectedExperiment.trafficSplit}%</span>
                  </div>
                  <Progress value={selectedExperiment.trafficSplit} className="h-2" />
                </div>
              </div>

              {/* 关键指标对比 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">准确率差异</span>
                  </div>
                  <p className={`text-2xl font-semibold ${selectedExperiment.accuracyDiff >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {selectedExperiment.accuracyDiff > 0 ? "+" : ""}{selectedExperiment.accuracyDiff}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedExperiment.accuracyDiff >= 0 ? "实验组表现更好" : "对照组表现更好"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">成本差异</span>
                  </div>
                  <p className={`text-2xl font-semibold ${selectedExperiment.costDiff <= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {selectedExperiment.costDiff > 0 ? "+" : ""}{selectedExperiment.costDiff}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedExperiment.costDiff <= 0 ? "成本降低" : "成本增加"}
                  </p>
                </div>
              </div>

              {/* 统计信息 */}
              {selectedExperiment.status !== "draft" && (
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-medium">统计数据</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">P值</p>
                      <p className="text-lg font-semibold">{selectedExperiment.pValue.toFixed(3)}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedExperiment.pValue < 0.05 ? "统计显著" : "不显著"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">样本量</p>
                      <p className="text-lg font-semibold">{selectedExperiment.sampleSize.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">置信度</p>
                      <p className="text-lg font-semibold">95%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 时间信息 */}
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">时间信息</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">开始时间</span>
                    <span>{selectedExperiment.startTime || "未开始"}</span>
                  </div>
                  {selectedExperiment.endTime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">结束时间</span>
                      <span>{selectedExperiment.endTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 建议 */}
              {selectedExperiment.status === "completed" && selectedExperiment.pValue < 0.05 && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-emerald-600">实验结论</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        实验组在统计上显著优于对照组，建议将实验组方案推广到全量流量。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-2">
                {selectedExperiment.status === "running" && (
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => {
                      handleStopExperiment(selectedExperiment);
                      setIsDetailOpen(false);
                    }}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    停止实验
                  </Button>
                )}
                {selectedExperiment.status === "completed" && (
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      handleViewReport(selectedExperiment);
                      setIsDetailOpen(false);
                    }}
                  >
                    <FileBarChart className="h-4 w-4 mr-2" />
                    查看完整报告
                  </Button>
                )}
                <Button variant="outline" className="flex-1" onClick={() => setIsDetailOpen(false)}>
                  关闭
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
