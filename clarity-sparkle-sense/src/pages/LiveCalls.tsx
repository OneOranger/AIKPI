import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Activity,
  Zap,
  Clock,
  BarChart3,
  CheckCircle2,
  XCircle,
  Filter,
  Calendar,
  Cpu,
  Coins,
  Timer,
  ArrowRightLeft,
  Layers,
  RefreshCw,
} from "lucide-react";

// Mock 数据类型定义
interface CallRecord {
  id: string;
  time: string;
  model: string;
  project: string;
  status: "success" | "failed";
  latency: number;
  tokensIn: number;
  tokensOut: number;
  cost: number;
  request?: string;
  response?: string;
  timingBreakdown?: {
    queue: number;
    processing: number;
    generation: number;
    total: number;
  };
}

// Mock 数据
const mockCalls: CallRecord[] = [
  {
    id: "call_8f3a2b1c",
    time: "14:32:18",
    model: "gpt-4o",
    project: "智能客服",
    status: "success",
    latency: 1240,
    tokensIn: 342,
    tokensOut: 856,
    cost: 0.0284,
    request: "用户询问：如何重置我的账户密码？",
    response: "您可以通过以下步骤重置密码：1. 点击登录页面的'忘记密码'...",
    timingBreakdown: { queue: 45, processing: 320, generation: 875, total: 1240 },
  },
  {
    id: "call_9e4c5d2f",
    time: "14:31:52",
    model: "claude-3-opus",
    project: "文档分析",
    status: "success",
    latency: 2150,
    tokensIn: 2048,
    tokensOut: 1536,
    cost: 0.0892,
    request: "请分析这份合同的关键条款...",
    response: "根据合同内容，主要条款包括：服务期限、付款方式、违约责任...",
    timingBreakdown: { queue: 120, processing: 680, generation: 1350, total: 2150 },
  },
  {
    id: "call_7b1a8e3d",
    time: "14:31:45",
    model: "gpt-4o-mini",
    project: "内容生成",
    status: "success",
    latency: 380,
    tokensIn: 128,
    tokensOut: 256,
    cost: 0.0024,
    request: "生成一段产品描述，关于无线耳机",
    response: "这款无线耳机采用先进的降噪技术，续航长达30小时...",
    timingBreakdown: { queue: 20, processing: 85, generation: 275, total: 380 },
  },
  {
    id: "call_6c5f2a9b",
    time: "14:31:28",
    model: "gpt-4o",
    project: "代码助手",
    status: "failed",
    latency: 5200,
    tokensIn: 1024,
    tokensOut: 0,
    cost: 0.0156,
    request: "帮我优化这段Python代码的性能",
    response: "Error: Request timeout after 5000ms",
    timingBreakdown: { queue: 50, processing: 150, generation: 5000, total: 5200 },
  },
  {
    id: "call_5d4e7c1a",
    time: "14:30:56",
    model: "claude-3-sonnet",
    project: "智能客服",
    status: "success",
    latency: 890,
    tokensIn: 256,
    tokensOut: 512,
    cost: 0.0128,
    request: "查询我的订单状态，订单号：ORD2024001",
    response: "您的订单 ORD2024001 当前状态为：已发货，预计明天送达...",
    timingBreakdown: { queue: 35, processing: 210, generation: 645, total: 890 },
  },
  {
    id: "call_4a3b6f8e",
    time: "14:30:42",
    model: "gpt-4o",
    project: "数据分析",
    status: "success",
    latency: 1680,
    tokensIn: 768,
    tokensOut: 1024,
    cost: 0.0384,
    request: "分析Q3季度销售数据趋势",
    response: "Q3季度销售数据显示：整体增长15%，其中电子产品类别增长最为显著...",
    timingBreakdown: { queue: 60, processing: 420, generation: 1200, total: 1680 },
  },
  {
    id: "call_3c2d5a7f",
    time: "14:30:15",
    model: "gpt-4o-mini",
    project: "内容生成",
    status: "success",
    latency: 290,
    tokensIn: 64,
    tokensOut: 128,
    cost: 0.0012,
    request: "写一个简短的欢迎语",
    response: "欢迎！很高兴为您服务，请问有什么可以帮助您的？",
    timingBreakdown: { queue: 15, processing: 55, generation: 220, total: 290 },
  },
  {
    id: "call_2b1e4c6d",
    time: "14:29:58",
    model: "claude-3-opus",
    project: "文档分析",
    status: "success",
    latency: 3240,
    tokensIn: 3072,
    tokensOut: 2048,
    cost: 0.1456,
    request: "总结这份技术白皮书的核心观点",
    response: "白皮书提出了三个核心观点：1. AI技术将重塑行业格局...",
    timingBreakdown: { queue: 180, processing: 960, generation: 2100, total: 3240 },
  },
  {
    id: "call_1a0f3b5c",
    time: "14:29:31",
    model: "gpt-4o",
    project: "代码助手",
    status: "success",
    latency: 1420,
    tokensIn: 512,
    tokensOut: 768,
    cost: 0.0248,
    request: "解释这段React代码的作用",
    response: "这段代码定义了一个自定义Hook，用于管理表单状态...",
    timingBreakdown: { queue: 40, processing: 280, generation: 1100, total: 1420 },
  },
  {
    id: "call_0f9e2a4b",
    time: "14:29:12",
    model: "claude-3-sonnet",
    project: "智能客服",
    status: "failed",
    latency: 800,
    tokensIn: 128,
    tokensOut: 0,
    cost: 0.0016,
    request: "投诉产品质量问题",
    response: "Error: Rate limit exceeded",
    timingBreakdown: { queue: 30, processing: 120, generation: 650, total: 800 },
  },
  {
    id: "call_9d8c1f3a",
    time: "14:28:45",
    model: "gpt-4o-mini",
    project: "数据分析",
    status: "success",
    latency: 450,
    tokensIn: 192,
    tokensOut: 320,
    cost: 0.0032,
    request: "计算这组数据的平均值",
    response: "根据提供的数据 [10, 20, 30, 40, 50]，平均值为 30...",
    timingBreakdown: { queue: 25, processing: 95, generation: 330, total: 450 },
  },
  {
    id: "call_8e7b0d2c",
    time: "14:28:22",
    model: "gpt-4o",
    project: "内容生成",
    status: "success",
    latency: 1120,
    tokensIn: 256,
    tokensOut: 640,
    cost: 0.0216,
    request: "撰写一篇关于AI发展的博客文章",
    response: "人工智能正在改变我们的生活方式。从智能手机助手到自动驾驶汽车...",
    timingBreakdown: { queue: 50, processing: 240, generation: 830, total: 1120 },
  },
];

// 统计卡片组件
function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendUp,
  onClick,
  clickable,
}: {
  title: string;
  value: string;
  unit?: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  onClick?: () => void;
  clickable?: boolean;
}) {
  return (
    <Card 
      className={`bg-surface border-border ${clickable ? 'cursor-pointer hover:border-border-strong hover:shadow-md transition-all' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold tracking-tight">{value}</span>
              {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
            </div>
            {trend && (
              <p className={`text-[11px] mt-1 ${trendUp ? "text-success" : "text-muted-foreground"}`}>
                {trend}
              </p>
            )}
          </div>
          <div className="h-8 w-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LiveCalls() {
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [callData, setCallData] = useState<CallRecord[]>(mockCalls);

  // 计算统计数据
  const totalCalls = callData.length;
  const successCalls = callData.filter((c) => c.status === "success").length;
  const successRate = ((successCalls / totalCalls) * 100).toFixed(1);
  const avgLatency = Math.round(
    callData.reduce((sum, c) => sum + c.latency, 0) / totalCalls
  );
  const totalTokens = callData.reduce((sum, c) => sum + c.tokensIn + c.tokensOut, 0);
  const totalCost = callData.reduce((sum, c) => sum + c.cost, 0).toFixed(4);

  // 筛选数据
  const filteredCalls = callData.filter((call) => {
    if (modelFilter !== "all" && call.model !== modelFilter) return false;
    if (projectFilter !== "all" && call.project !== projectFilter) return false;
    if (statusFilter !== "all" && call.status !== statusFilter) return false;
    return true;
  });

  const handleRowClick = (call: CallRecord) => {
    setSelectedCall(call);
    setIsSheetOpen(true);
  };

  // 刷新数据
  const handleRefresh = () => {
    setIsRefreshing(true);
    // 模拟数据刷新
    setTimeout(() => {
      // 随机调整一些数据模拟刷新
      const refreshedData = callData.map(call => ({
        ...call,
        latency: Math.max(100, call.latency + Math.floor(Math.random() * 200 - 100)),
      }));
      setCallData(refreshedData);
      setIsRefreshing(false);
      toast.success("数据已刷新", {
        description: `已更新 ${callData.length} 条调用记录`,
      });
    }, 1000);
  };

  // 统计卡片点击跳转筛选
  const handleSuccessCardClick = () => {
    setStatusFilter("success");
    toast.info("已筛选成功状态的调用", {
      description: "显示所有成功的调用记录",
    });
  };

  const handleFailedCardClick = () => {
    setStatusFilter("failed");
    toast.info("已筛选失败状态的调用", {
      description: "显示所有失败的调用记录",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar activeKey="实时调用" />
      <main className="flex-1 relative overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-5" />
        <Topbar crumb="Live Calls" />
        <div className="px-6 lg:px-8 py-6 space-y-6">
          {/* 页面标题 */}
          <header className="animate-fade-up">
            <h1 className="text-[26px] font-semibold tracking-tight leading-tight">
              实时调用 <span className="text-gradient-gold">监控</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              追踪每一次模型调用，分析性能与成本
            </p>
          </header>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
            <StatCard
              title="当前 QPS"
              value="12.5"
              unit="req/s"
              icon={Zap}
              trend="+8% vs 上小时"
              trendUp={true}
            />
            <StatCard
              title="成功率"
              value={successRate}
              unit="%"
              icon={CheckCircle2}
              trend="稳定运行中"
              trendUp={true}
              clickable
              onClick={handleSuccessCardClick}
            />
            <StatCard
              title="平均 Latency"
              value={avgLatency.toString()}
              unit="ms"
              icon={Clock}
              trend="-15% vs 上小时"
              trendUp={true}
            />
            <StatCard
              title="失败调用数"
              value={(totalCalls - successCalls).toString()}
              icon={BarChart3}
              trend="点击查看详情"
              trendUp={false}
              clickable
              onClick={handleFailedCardClick}
            />
          </div>

          {/* 筛选器栏 */}
          <div className="flex flex-wrap items-center gap-3 animate-fade-up">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <span>筛选：</span>
            </div>
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger className="w-[140px] h-8 text-xs bg-surface border-border">
                <SelectValue placeholder="全部模型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部模型</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
              </SelectContent>
            </Select>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[140px] h-8 text-xs bg-surface border-border">
                <SelectValue placeholder="全部项目" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部项目</SelectItem>
                <SelectItem value="智能客服">智能客服</SelectItem>
                <SelectItem value="文档分析">文档分析</SelectItem>
                <SelectItem value="内容生成">内容生成</SelectItem>
                <SelectItem value="代码助手">代码助手</SelectItem>
                <SelectItem value="数据分析">数据分析</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] h-8 text-xs bg-surface border-border">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="success">成功</SelectItem>
                <SelectItem value="failed">失败</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? '刷新中...' : '刷新'}
            </Button>
            <div className="flex items-center gap-2 ml-auto">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">最近 1 小时</span>
            </div>
          </div>

          {/* 实时调用流表格 */}
          <Card className="bg-surface border-border animate-fade-up overflow-hidden">
            <CardHeader className="px-5 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-semibold">实时调用流</CardTitle>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
                    实时更新
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>总 Token: <span className="text-foreground font-medium">{totalTokens.toLocaleString()}</span></span>
                  <span>总成本: <span className="text-foreground font-medium">${totalCost}</span></span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground w-[100px]">时间</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">模型</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">项目</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground w-[80px]">状态</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground w-[100px]">Latency</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">Token</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground w-[80px]">成本</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCalls.map((call) => (
                      <TableRow
                        key={call.id}
                        className="border-border cursor-pointer hover:bg-surface-elevated/50 transition-colors"
                        onClick={() => handleRowClick(call)}
                      >
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {call.time}
                        </TableCell>
                        <TableCell className="text-xs font-medium">{call.model}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{call.project}</TableCell>
                        <TableCell>
                          {call.status === "success" ? (
                            <Badge variant="default" className="text-[10px] bg-success/15 text-success border-success/20 hover:bg-success/20">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              成功
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px]">
                              <XCircle className="h-3 w-3 mr-1" />
                              失败
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs tabular-nums">{call.latency}ms</TableCell>
                        <TableCell className="text-xs tabular-nums text-muted-foreground">
                          {call.tokensIn} / {call.tokensOut}
                        </TableCell>
                        <TableCell className="text-xs tabular-nums font-medium">${call.cost.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* 调用详情侧面板 */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg bg-surface border-border overflow-y-auto">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="text-base flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              调用详情
            </SheetTitle>
            <SheetDescription className="text-xs">
              {selectedCall?.id}
            </SheetDescription>
          </SheetHeader>

          {selectedCall && (
            <div className="mt-6 space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-background border border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">模型</p>
                  <p className="text-sm font-medium">{selectedCall.model}</p>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">项目</p>
                  <p className="text-sm font-medium">{selectedCall.project}</p>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">状态</p>
                  <div className="flex items-center gap-1">
                    {selectedCall.status === "success" ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        <span className="text-sm font-medium text-success">成功</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 text-destructive" />
                        <span className="text-sm font-medium text-destructive">失败</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">时间</p>
                  <p className="text-sm font-medium font-mono">{selectedCall.time}</p>
                </div>
              </div>

              {/* Token 分析 */}
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">Token 分析</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">输入 Token</span>
                    <span className="text-sm font-medium tabular-nums">{selectedCall.tokensIn}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">输出 Token</span>
                    <span className="text-sm font-medium tabular-nums">{selectedCall.tokensOut}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">总计</span>
                    <span className="text-sm font-semibold tabular-nums">{selectedCall.tokensIn + selectedCall.tokensOut}</span>
                  </div>
                </div>
              </div>

              {/* 耗时分解 */}
              {selectedCall.timingBreakdown && (
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Timer className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-medium">耗时分解</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">队列等待</span>
                      <span className="text-sm font-medium tabular-nums">{selectedCall.timingBreakdown.queue}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">请求处理</span>
                      <span className="text-sm font-medium tabular-nums">{selectedCall.timingBreakdown.processing}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">内容生成</span>
                      <span className="text-sm font-medium tabular-nums">{selectedCall.timingBreakdown.generation}ms</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">总计</span>
                      <span className="text-sm font-semibold tabular-nums">{selectedCall.timingBreakdown.total}ms</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 成本 */}
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">成本</h4>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">本次调用成本</span>
                  <span className="text-lg font-semibold tabular-nums text-primary">${selectedCall.cost.toFixed(4)}</span>
                </div>
              </div>

              {/* 请求/响应内容 */}
              <Tabs defaultValue="request" className="w-full">
                <TabsList className="w-full bg-background border border-border">
                  <TabsTrigger value="request" className="flex-1 text-xs">
                    <ArrowRightLeft className="h-3 w-3 mr-1" />
                    请求
                  </TabsTrigger>
                  <TabsTrigger value="response" className="flex-1 text-xs">
                    <ArrowRightLeft className="h-3 w-3 mr-1 rotate-180" />
                    响应
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="request" className="mt-2">
                  <div className="p-3 rounded-lg bg-background border border-border">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                      {selectedCall.request}
                    </pre>
                  </div>
                </TabsContent>
                <TabsContent value="response" className="mt-2">
                  <div className="p-3 rounded-lg bg-background border border-border">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                      {selectedCall.response}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
