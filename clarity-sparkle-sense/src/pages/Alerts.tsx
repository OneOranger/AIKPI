import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  Plus,
  Mail,
  MessageSquare,
  Slack,
  CheckCircle,
  VolumeX,
  Eye,
  Clock,
  TrendingDown,
  DollarSign,
  Zap,
  BrainCircuit,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// 严重程度类型
type Severity = "critical" | "warning" | "info";

// 活跃告警类型
interface ActiveAlert {
  id: string;
  title: string;
  severity: Severity;
  triggeredAt: string;
  project: string;
  model: string;
  currentValue: string;
  threshold: string;
  metric: string;
}

// 告警规则类型
interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: string;
  threshold: string;
  channels: string[];
  enabled: boolean;
  severity: Severity;
}

// 历史记录类型
interface AlertHistory {
  id: string;
  alertName: string;
  severity: Severity;
  triggeredAt: string;
  resolvedAt: string;
  duration: string;
  status: "resolved" | "muted" | "acknowledged";
}

// Mock 数据
const mockActiveAlerts: ActiveAlert[] = [
  {
    id: "1",
    title: "准确率跌破阈值",
    severity: "critical",
    triggeredAt: "2026-04-20 14:32:18",
    project: "智能客服系统",
    model: "GPT-4-Turbo",
    currentValue: "78.5%",
    threshold: "85%",
    metric: "准确率",
  },
  {
    id: "2",
    title: "API 响应延迟过高",
    severity: "warning",
    triggeredAt: "2026-04-20 13:15:42",
    project: "内容生成平台",
    model: "Claude-3-Opus",
    currentValue: "2.8s",
    threshold: "2.0s",
    metric: "延迟",
  },
  {
    id: "3",
    title: "成本超出预算",
    severity: "warning",
    triggeredAt: "2026-04-20 12:08:33",
    project: "数据分析助手",
    model: "Gemini-Pro",
    currentValue: "¥1,250",
    threshold: "¥1,000",
    metric: "日成本",
  },
  {
    id: "4",
    title: "幻觉率上升",
    severity: "info",
    triggeredAt: "2026-04-20 10:45:21",
    project: "知识问答系统",
    model: "Llama-3-70B",
    currentValue: "12.3%",
    threshold: "10%",
    metric: "幻觉率",
  },
  {
    id: "5",
    title: "Token 消耗异常",
    severity: "critical",
    triggeredAt: "2026-04-20 09:22:07",
    project: "文档总结服务",
    model: "GPT-4-Turbo",
    currentValue: "45K/min",
    threshold: "30K/min",
    metric: "Token速率",
  },
  {
    id: "6",
    title: "用户满意度下降",
    severity: "warning",
    triggeredAt: "2026-04-20 08:55:14",
    project: "智能客服系统",
    model: "GPT-3.5-Turbo",
    currentValue: "3.2",
    threshold: "4.0",
    metric: "满意度评分",
  },
];

const mockAlertRules: AlertRule[] = [
  {
    id: "1",
    name: "准确率监控",
    metric: "准确率",
    condition: "小于",
    threshold: "85%",
    channels: ["email", "dingtalk"],
    enabled: true,
    severity: "critical",
  },
  {
    id: "2",
    name: "延迟监控",
    metric: "响应延迟",
    condition: "大于",
    threshold: "2.0s",
    channels: ["email", "slack"],
    enabled: true,
    severity: "warning",
  },
  {
    id: "3",
    name: "成本控制",
    metric: "日成本",
    condition: "大于",
    threshold: "¥1,000",
    channels: ["wecom"],
    enabled: true,
    severity: "warning",
  },
  {
    id: "4",
    name: "幻觉率监控",
    metric: "幻觉率",
    condition: "大于",
    threshold: "10%",
    channels: ["email"],
    enabled: false,
    severity: "info",
  },
  {
    id: "5",
    name: "Token 消耗预警",
    metric: "Token速率",
    condition: "大于",
    threshold: "30K/min",
    channels: ["dingtalk", "slack"],
    enabled: true,
    severity: "critical",
  },
  {
    id: "6",
    name: "用户满意度监控",
    metric: "满意度评分",
    condition: "小于",
    threshold: "4.0",
    channels: ["wecom", "email"],
    enabled: true,
    severity: "warning",
  },
];

const mockAlertHistory: AlertHistory[] = [
  {
    id: "1",
    alertName: "服务可用性下降",
    severity: "critical",
    triggeredAt: "2026-04-19 22:15:33",
    resolvedAt: "2026-04-19 22:45:12",
    duration: "29分钟",
    status: "resolved",
  },
  {
    id: "2",
    alertName: "错误率突增",
    severity: "warning",
    triggeredAt: "2026-04-19 18:30:45",
    resolvedAt: "2026-04-19 19:05:22",
    duration: "34分钟",
    status: "resolved",
  },
  {
    id: "3",
    alertName: "模型版本异常",
    severity: "info",
    triggeredAt: "2026-04-19 15:20:18",
    resolvedAt: "-",
    duration: "-",
    status: "muted",
  },
  {
    id: "4",
    alertName: "吞吐量下降",
    severity: "warning",
    triggeredAt: "2026-04-19 11:45:09",
    resolvedAt: "2026-04-19 12:10:33",
    duration: "25分钟",
    status: "acknowledged",
  },
  {
    id: "5",
    alertName: "内存使用率过高",
    severity: "critical",
    triggeredAt: "2026-04-18 20:05:27",
    resolvedAt: "2026-04-18 20:25:41",
    duration: "20分钟",
    status: "resolved",
  },
  {
    id: "6",
    alertName: "API 限流触发",
    severity: "warning",
    triggeredAt: "2026-04-18 16:30:55",
    resolvedAt: "2026-04-18 17:00:18",
    duration: "29分钟",
    status: "resolved",
  },
  {
    id: "7",
    alertName: "缓存命中率低",
    severity: "info",
    triggeredAt: "2026-04-18 10:15:42",
    resolvedAt: "2026-04-18 10:45:30",
    duration: "29分钟",
    status: "resolved",
  },
  {
    id: "8",
    alertName: "数据库连接池耗尽",
    severity: "critical",
    triggeredAt: "2026-04-17 23:50:11",
    resolvedAt: "2026-04-18 00:15:45",
    duration: "25分钟",
    status: "resolved",
  },
  {
    id: "9",
    alertName: "模型推理超时",
    severity: "warning",
    triggeredAt: "2026-04-17 19:22:38",
    resolvedAt: "2026-04-17 19:50:52",
    duration: "28分钟",
    status: "acknowledged",
  },
  {
    id: "10",
    alertName: "配置变更检测",
    severity: "info",
    triggeredAt: "2026-04-17 14:05:19",
    resolvedAt: "-",
    duration: "-",
    status: "muted",
  },
];

// 严重程度配置
const severityConfig: Record<Severity, { icon: typeof AlertTriangle; color: string; label: string; bgColor: string }> = {
  critical: {
    icon: AlertTriangle,
    color: "text-red-500",
    label: "紧急",
    bgColor: "bg-red-500/10 border-red-500/20",
  },
  warning: {
    icon: AlertCircle,
    color: "text-orange-500",
    label: "警告",
    bgColor: "bg-orange-500/10 border-orange-500/20",
  },
  info: {
    icon: Info,
    color: "text-yellow-500",
    label: "提示",
    bgColor: "bg-yellow-500/10 border-yellow-500/20",
  },
};

// 通知渠道图标映射
const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  dingtalk: MessageSquare,
  wecom: MessageSquare,
  slack: Slack,
};

// 指标图标映射
const metricIcons: Record<string, typeof TrendingDown> = {
  准确率: CheckCircle,
  延迟: Zap,
  成本: DollarSign,
  幻觉率: BrainCircuit,
};

export function Alerts() {
  const [activeTab, setActiveTab] = useState("active");
  const [rules, setRules] = useState(mockAlertRules);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState(mockActiveAlerts);
  const [alertHistory, setAlertHistory] = useState(mockAlertHistory);
  
  // 新建规则表单状态
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleMetric, setNewRuleMetric] = useState("");
  const [newRuleCondition, setNewRuleCondition] = useState("");
  const [newRuleThreshold, setNewRuleThreshold] = useState("");
  const [newRuleSeverity, setNewRuleSeverity] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  
  // 历史记录排序
  const [historySort, setHistorySort] = useState<{ field: keyof AlertHistory; direction: 'asc' | 'desc' }>({
    field: 'triggeredAt',
    direction: 'desc'
  });

  // 统计数量
  const activeCount = activeAlerts.length;
  const triggeredToday = 12;
  const mutedCount = alertHistory.filter(h => h.status === "muted").length;
  const totalRules = rules.length;

  // 切换规则状态
  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
    const rule = rules.find(r => r.id === id);
    if (rule) {
      toast.success(rule.enabled ? "规则已禁用" : "规则已启用", {
        description: `规则: ${rule.name}`,
      });
    }
  };

  // 获取严重程度样式
  const getSeverityStyle = (severity: Severity) => severityConfig[severity];

  // 获取状态徽章
  const getStatusBadge = (status: AlertHistory["status"]) => {
    switch (status) {
      case "resolved":
        return <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">已解决</Badge>;
      case "muted":
        return <Badge variant="secondary" className="bg-gray-500/10 text-gray-600 border-gray-500/20">已静默</Badge>;
      case "acknowledged":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">已确认</Badge>;
    }
  };

  // 处理静默告警
  const handleMuteAlert = (alert: ActiveAlert) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== alert.id));
    setAlertHistory(prev => [{
      id: Date.now().toString(),
      alertName: alert.title,
      severity: alert.severity,
      triggeredAt: alert.triggeredAt,
      resolvedAt: "-",
      duration: "-",
      status: "muted"
    }, ...prev]);
    toast.success("告警已静默", {
      description: alert.title,
    });
  };

  // 处理确认告警
  const handleAckAlert = (alert: ActiveAlert) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== alert.id));
    setAlertHistory(prev => [{
      id: Date.now().toString(),
      alertName: alert.title,
      severity: alert.severity,
      triggeredAt: alert.triggeredAt,
      resolvedAt: new Date().toLocaleString('zh-CN'),
      duration: "刚刚",
      status: "acknowledged"
    }, ...prev]);
    toast.success("告警已确认", {
      description: alert.title,
    });
  };

  // 处理创建规则
  const handleCreateRule = () => {
    if (!newRuleName.trim()) {
      toast.error("请输入规则名称");
      return;
    }
    if (!newRuleMetric) {
      toast.error("请选择监控指标");
      return;
    }
    if (!newRuleThreshold.trim()) {
      toast.error("请输入阈值");
      return;
    }
    if (selectedChannels.length === 0) {
      toast.error("请至少选择一个通知渠道");
      return;
    }

    const newRule: AlertRule = {
      id: (rules.length + 1).toString(),
      name: newRuleName,
      metric: newRuleMetric === "accuracy" ? "准确率" : 
              newRuleMetric === "latency" ? "响应延迟" : 
              newRuleMetric === "cost" ? "成本" : 
              newRuleMetric === "hallucination" ? "幻觉率" : 
              newRuleMetric === "token" ? "Token 消耗" : "用户满意度",
      condition: newRuleCondition === "gt" ? "大于" : 
                 newRuleCondition === "lt" ? "小于" : 
                 newRuleCondition === "eq" ? "等于" : 
                 newRuleCondition === "gte" ? "大于等于" : "小于等于",
      threshold: newRuleThreshold,
      channels: selectedChannels,
      enabled: true,
      severity: (newRuleSeverity || "warning") as Severity,
    };

    setRules(prev => [...prev, newRule]);
    toast.success("规则创建成功", {
      description: `规则 "${newRuleName}" 已创建`,
    });

    // 重置表单
    setNewRuleName("");
    setNewRuleMetric("");
    setNewRuleCondition("");
    setNewRuleThreshold("");
    setNewRuleSeverity("");
    setSelectedChannels([]);
    setDialogOpen(false);
  };

  // 切换通知渠道选择
  const toggleChannel = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(c => c !== channelId)
        : [...prev, channelId]
    );
  };

  // 排序历史记录
  const sortedHistory = [...alertHistory].sort((a, b) => {
    const aVal = a[historySort.field];
    const bVal = b[historySort.field];
    if (historySort.direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  // 切换排序
  const toggleSort = (field: keyof AlertHistory) => {
    setHistorySort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar activeKey="告警管理" />
      <main className="flex-1 relative overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-5" />
        <Topbar crumb="告警管理" />
        <div className="px-6 lg:px-8 py-6 space-y-6">
          {/* 页面头部 */}
          <header className="flex flex-wrap items-center justify-between gap-4 animate-fade-up">
            <div>
              <h1 className="text-[26px] font-semibold tracking-tight leading-tight">
                告警<span className="text-gradient-gold">管理</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                监控系统状态，及时发现并处理异常
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-gold text-primary-foreground hover:opacity-95">
                  <Plus className="h-4 w-4 mr-1" />
                  新建规则
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>创建告警规则</DialogTitle>
                  <DialogDescription>
                    配置新的监控规则，当指标满足条件时触发告警
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="ruleName">规则名称</Label>
                    <Input 
                      id="ruleName" 
                      placeholder="例如：准确率监控" 
                      value={newRuleName}
                      onChange={(e) => setNewRuleName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>监控指标</Label>
                    <Select value={newRuleMetric} onValueChange={setNewRuleMetric}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择监控指标" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accuracy">准确率</SelectItem>
                        <SelectItem value="latency">响应延迟</SelectItem>
                        <SelectItem value="cost">成本</SelectItem>
                        <SelectItem value="hallucination">幻觉率</SelectItem>
                        <SelectItem value="token">Token 消耗</SelectItem>
                        <SelectItem value="satisfaction">用户满意度</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>条件</Label>
                      <Select value={newRuleCondition} onValueChange={setNewRuleCondition}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择条件" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gt">大于</SelectItem>
                          <SelectItem value="lt">小于</SelectItem>
                          <SelectItem value="eq">等于</SelectItem>
                          <SelectItem value="gte">大于等于</SelectItem>
                          <SelectItem value="lte">小于等于</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="threshold">阈值</Label>
                      <Input 
                        id="threshold" 
                        placeholder="例如：85" 
                        value={newRuleThreshold}
                        onChange={(e) => setNewRuleThreshold(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>通知渠道</Label>
                    <div className="flex flex-wrap gap-3 pt-1">
                      {[
                        { id: "email", label: "邮件", icon: Mail },
                        { id: "dingtalk", label: "钉钉", icon: MessageSquare },
                        { id: "wecom", label: "企业微信", icon: MessageSquare },
                        { id: "slack", label: "Slack", icon: Slack },
                      ].map((channel) => (
                        <label
                          key={channel.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                            selectedChannels.includes(channel.id) 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border bg-surface hover:bg-surface-elevated'
                          }`}
                          onClick={() => toggleChannel(channel.id)}
                        >
                          <input 
                            type="checkbox" 
                            className="rounded border-border" 
                            checked={selectedChannels.includes(channel.id)}
                            onChange={() => {}}
                          />
                          <channel.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{channel.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>严重程度</Label>
                    <Select value={newRuleSeverity} onValueChange={setNewRuleSeverity}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择严重程度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            紧急
                          </div>
                        </SelectItem>
                        <SelectItem value="warning">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            警告
                          </div>
                        </SelectItem>
                        <SelectItem value="info">
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-yellow-500" />
                            提示
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    取消
                  </Button>
                  <Button
                    className="bg-gradient-gold text-primary-foreground"
                    onClick={handleCreateRule}
                  >
                    创建规则
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </header>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">活跃告警</p>
                    <p className="text-2xl font-bold text-red-500 mt-1">{activeCount}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">今日已触发</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{triggeredToday}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">已静默</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{mutedCount}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <VolumeX className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">告警规则总数</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{totalRules}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs 内容 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-up">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="active">
                活跃告警
                <Badge variant="secondary" className="ml-2 bg-red-500/10 text-red-600">
                  {activeCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rules">告警规则</TabsTrigger>
              <TabsTrigger value="history">历史记录</TabsTrigger>
            </TabsList>

            {/* 活跃告警列表 */}
            <TabsContent value="active" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeAlerts.map((alert) => {
                  const severity = getSeverityStyle(alert.severity);
                  const Icon = severity.icon;
                  return (
                    <Card
                      key={alert.id}
                      className={`border ${severity.bgColor} transition-all hover:shadow-md`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${severity.bgColor}`}>
                            <Icon className={`h-5 w-5 ${severity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-foreground">{alert.title}</h3>
                              <Badge variant="outline" className={severity.color}>
                                {severity.label}
                              </Badge>
                            </div>
                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{alert.triggeredAt}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span>项目：{alert.project}</span>
                                <span>模型：{alert.model}</span>
                              </div>
                              <div className="flex items-center gap-2 pt-1">
                                <span className="font-medium text-foreground">{alert.currentValue}</span>
                                <span className="text-muted-foreground">vs</span>
                                <span>阈值 {alert.threshold}</span>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={() => handleMuteAlert(alert)}
                              >
                                <VolumeX className="h-3.5 w-3.5 mr-1" />
                                静默
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={() => handleAckAlert(alert)}
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                确认
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8">
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                详情
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {activeAlerts.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <p className="text-muted-foreground">当前没有活跃告警</p>
                </div>
              )}
            </TabsContent>

            {/* 告警规则列表 */}
            <TabsContent value="rules" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>规则名称</TableHead>
                        <TableHead>监控指标</TableHead>
                        <TableHead>条件表达式</TableHead>
                        <TableHead>通知渠道</TableHead>
                        <TableHead>严重程度</TableHead>
                        <TableHead className="text-right">状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rules.map((rule) => {
                        const severity = getSeverityStyle(rule.severity);
                        return (
                          <TableRow 
                            key={rule.id}
                            className={rule.enabled ? '' : 'opacity-50'}
                          >
                            <TableCell className="font-medium">{rule.name}</TableCell>
                            <TableCell>{rule.metric}</TableCell>
                            <TableCell>
                              <code className="px-2 py-1 rounded bg-muted text-xs">
                                {rule.condition} {rule.threshold}
                              </code>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {rule.channels.map((channel) => {
                                  const ChannelIcon = channelIcons[channel] || Mail;
                                  return (
                                    <div
                                      key={channel}
                                      className="h-7 w-7 rounded-md bg-surface border border-border flex items-center justify-center"
                                      title={channel}
                                    >
                                      <ChannelIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                    </div>
                                  );
                                })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={severity.color}>
                                {severity.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Switch
                                checked={rule.enabled}
                                onCheckedChange={() => toggleRule(rule.id)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 历史记录 */}
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>告警名称</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleSort('severity')}
                        >
                          <div className="flex items-center gap-1">
                            严重程度
                            {historySort.field === 'severity' && (
                              historySort.direction === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleSort('triggeredAt')}
                        >
                          <div className="flex items-center gap-1">
                            触发时间
                            {historySort.field === 'triggeredAt' && (
                              historySort.direction === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>解决时间</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleSort('duration')}
                        >
                          <div className="flex items-center gap-1">
                            持续时间
                            {historySort.field === 'duration' && (
                              historySort.direction === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedHistory.map((history) => {
                        const severity = getSeverityStyle(history.severity);
                        return (
                          <TableRow key={history.id}>
                            <TableCell className="font-medium">{history.alertName}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <severity.icon className={`h-4 w-4 ${severity.color}`} />
                                <span className={severity.color}>{severity.label}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {history.triggeredAt}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {history.resolvedAt}
                            </TableCell>
                            <TableCell>{history.duration}</TableCell>
                            <TableCell>{getStatusBadge(history.status)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <footer className="pt-2 pb-8 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>AI Pulse · KPI Dashboard · v0.1 demo</span>
            <span className="font-mono">build · 2026.04.18</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
