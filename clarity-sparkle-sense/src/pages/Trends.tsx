import { useState, useMemo } from "react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { toast } from "sonner";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  Clock,
  DollarSign,
  BarChart3,
  Target,
  AlertCircle,
  ChevronRight,
  X,
  Lightbulb,
  Info,
} from "lucide-react";

// 生成30天时间序列数据
const generate30DaysData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStr = `${date.getMonth() + 1}/${date.getDate()}`;
    
    // 基础值 + 随机波动 + 趋势
    const baseCalls = 15000 + Math.sin(i / 5) * 3000;
    const baseCost = 120 + Math.sin(i / 4) * 20;
    const baseLatency = 680 + Math.cos(i / 6) * 100;
    const baseAccuracy = 92 + Math.sin(i / 7) * 2;
    
    data.push({
      day: dayStr,
      calls: Math.round(baseCalls + Math.random() * 2000 - 1000),
      cost: +(baseCost + Math.random() * 15 - 7.5).toFixed(2),
      latency: Math.round(baseLatency + Math.random() * 80 - 40),
      accuracy: +(baseAccuracy + Math.random() * 1.5 - 0.75).toFixed(2),
    });
  }
  return data;
};

// 生成成本预测数据（历史30天 + 预测7天）
const generateCostForecastData = () => {
  const data = [];
  const today = new Date();
  
  // 历史数据（30天）
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStr = `${date.getMonth() + 1}/${date.getDate()}`;
    const baseCost = 120 + Math.sin(i / 4) * 20;
    data.push({
      day: dayStr,
      cost: +(baseCost + Math.random() * 15 - 7.5).toFixed(2),
      forecast: null,
      isForecast: false,
    });
  }
  
  // 预测数据（7天）
  const lastCost = data[data.length - 1].cost;
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayStr = `${date.getMonth() + 1}/${date.getDate()}`;
    const trendFactor = 1 + (i * 0.02); // 轻微上升趋势
    data.push({
      day: dayStr,
      cost: null,
      forecast: +(lastCost * trendFactor + Math.random() * 10 - 5).toFixed(2),
      isForecast: true,
    });
  }
  
  return data;
};

// 异常事件数据
const anomalyEvents = [
  {
    id: 1,
    time: "2026-04-19 14:32",
    type: "延迟异常",
    severity: "critical" as const,
    description: "P95 延迟突增至 2.4s，超过阈值 2x",
    impact: "影响用户体验，可能导致用户流失",
    suggestion: "1. 检查模型服务负载\n2. 启用缓存机制\n3. 考虑降级策略",
  },
  {
    id: 2,
    time: "2026-04-19 11:15",
    type: "成本波动",
    severity: "warning" as const,
    description: "GPT-5 Token 成本上涨 18%",
    impact: "月度预算可能超支约 ¥2,400",
    suggestion: "1. 评估模型切换方案\n2. 优化 Prompt 减少 Token 消耗\n3. 设置成本告警阈值",
  },
  {
    id: 3,
    time: "2026-04-18 22:08",
    type: "准确率下降",
    severity: "warning" as const,
    description: "HR Bot 准确率连续 3 小时低于 85%",
    impact: "用户投诉增加，服务质量下降",
    suggestion: "1. 检查知识库更新\n2. 回滚到上一版本\n3. 增加人工审核",
  },
  {
    id: 4,
    time: "2026-04-18 16:45",
    type: "流量峰值",
    severity: "info" as const,
    description: "Support Copilot QPS 达到历史峰值 1,240",
    impact: "系统负载正常，无性能影响",
    suggestion: "1. 监控资源使用情况\n2. 准备弹性扩容方案",
  },
  {
    id: 5,
    time: "2026-04-17 09:20",
    type: "模型切换",
    severity: "info" as const,
    description: "自动将 15% 流量从 Claude 4.5 切换至 Gemini 2.5",
    impact: "成本降低 12%，性能保持稳定",
    suggestion: "1. 持续监控新模型表现\n2. 逐步增加流量比例",
  },
  {
    id: 6,
    type: "错误率上升",
    time: "2026-04-16 20:15",
    severity: "critical" as const,
    description: "RAG Search 500 错误率上升至 2.3%",
    impact: "检索服务不稳定，影响回答质量",
    suggestion: "1. 检查向量数据库状态\n2. 重启检索服务\n3. 检查索引完整性",
  },
];

// 性能衰退预警
const degradationAlerts = [
  {
    id: 1,
    title: "准确率持续下降",
    metric: "Overall Accuracy",
    current: "91.2%",
    previous: "93.8%",
    trend: "-2.6pp",
    days: 7,
    icon: Target,
  },
  {
    id: 2,
    title: "延迟逐渐上升",
    metric: "P95 Latency",
    current: "892ms",
    previous: "720ms",
    trend: "+24%",
    days: 5,
    icon: Clock,
  },
  {
    id: 3,
    title: "成本增长过快",
    metric: "Daily Cost",
    current: "$142.80",
    previous: "$118.40",
    trend: "+20.6%",
    days: 7,
    icon: DollarSign,
  },
];

// 同比/环比卡片数据
const comparisonCards = [
  {
    id: "calls",
    title: "调用量环比",
    value: "2.48M",
    change: "+12.4%",
    isPositive: true,
    icon: BarChart3,
    sparkData: [65, 70, 68, 75, 80, 78, 85, 88, 92, 95],
  },
  {
    id: "cost",
    title: "成本环比",
    value: "$18,247",
    change: "−8.1%",
    isPositive: true,
    icon: DollarSign,
    sparkData: [80, 78, 75, 72, 70, 68, 65, 62, 60, 58],
  },
  {
    id: "latency",
    title: "延迟环比",
    value: "720ms",
    change: "+5.2%",
    isPositive: false,
    icon: Clock,
    sparkData: [60, 62, 65, 63, 68, 70, 72, 75, 73, 78],
  },
  {
    id: "accuracy",
    title: "准确率环比",
    value: "93.4%",
    change: "+1.8pp",
    isPositive: true,
    icon: Target,
    sparkData: [70, 72, 75, 74, 78, 80, 82, 85, 88, 92],
  },
];

// 根据时间范围生成数据
const generateDataByRange = (days: number) => {
  const data = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStr = `${date.getMonth() + 1}/${date.getDate()}`;
    
    // 根据天数调整基础值和波动
    const factor = days > 30 ? 3 : days > 7 ? 1 : 0.3;
    const baseCalls = 15000 * factor + Math.sin(i / 5) * 3000 * factor;
    const baseCost = 120 * factor + Math.sin(i / 4) * 20 * factor;
    const baseLatency = 680 + Math.cos(i / 6) * 100;
    const baseAccuracy = 92 + Math.sin(i / 7) * 2;
    
    data.push({
      day: dayStr,
      calls: Math.round(baseCalls + Math.random() * 2000 * factor - 1000 * factor),
      cost: +(baseCost + Math.random() * 15 * factor - 7.5 * factor).toFixed(2),
      latency: Math.round(baseLatency + Math.random() * 80 - 40),
      accuracy: +(baseAccuracy + Math.random() * 1.5 - 0.75).toFixed(2),
    });
  }
  return data;
};

// 生成成本预测数据
const generateCostForecastByRange = (days: number) => {
  const data = [];
  const today = new Date();
  const factor = days > 30 ? 3 : days > 7 ? 1 : 0.3;
  
  // 历史数据
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStr = `${date.getMonth() + 1}/${date.getDate()}`;
    const baseCost = 120 * factor + Math.sin(i / 4) * 20 * factor;
    data.push({
      day: dayStr,
      cost: +(baseCost + Math.random() * 15 * factor - 7.5 * factor).toFixed(2),
      forecast: null,
      isForecast: false,
    });
  }
  
  // 预测数据（7天）
  const lastCost = data[data.length - 1].cost;
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayStr = `${date.getMonth() + 1}/${date.getDate()}`;
    const trendFactor = 1 + (i * 0.02);
    data.push({
      day: dayStr,
      cost: null,
      forecast: +(lastCost * trendFactor + Math.random() * 10 - 5).toFixed(2),
      isForecast: true,
    });
  }
  
  return data;
};

const costForecastData = generateCostForecastData();

export function Trends() {
  const [timeRange, setTimeRange] = useState("30");
  const [activeMetric, setActiveMetric] = useState("calls");
  const [selectedAnomaly, setSelectedAnomaly] = useState<typeof anomalyEvents[0] | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<typeof degradationAlerts[0] | null>(null);
  const [isAnomalyDialogOpen, setIsAnomalyDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  // 根据时间范围动态生成数据
  const trendData = useMemo(() => generateDataByRange(parseInt(timeRange)), [timeRange]);

  const metricTabs = [
    { id: "calls", label: "调用量", unit: "", color: "hsl(43 55% 54%)" },
    { id: "cost", label: "成本", unit: "$", color: "hsl(43 80% 70%)" },
    { id: "latency", label: "延迟", unit: "ms", color: "hsl(40 30% 55%)" },
    { id: "accuracy", label: "准确率", unit: "%", color: "hsl(142 60% 45%)" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "warning":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-info/10 text-info border-info/20";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-3.5 w-3.5" />;
      case "warning":
        return <AlertCircle className="h-3.5 w-3.5" />;
      default:
        return <Activity className="h-3.5 w-3.5" />;
    }
  };

  // 处理异常事件点击
  const handleAnomalyClick = (anomaly: typeof anomalyEvents[0]) => {
    setSelectedAnomaly(anomaly);
    setIsAnomalyDialogOpen(true);
  };

  // 处理性能预警点击
  const handleAlertClick = (alert: typeof degradationAlerts[0]) => {
    setSelectedAlert(alert);
    setIsAlertDialogOpen(true);
    toast.info(`查看 ${alert.title} 详情`, {
      description: `当前值: ${alert.current}，趋势: ${alert.trend}`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar activeKey="趋势分析" />
      <main className="flex-1 relative overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-5" />
        <Topbar crumb="Trends" />
        <div className="px-6 lg:px-8 py-6 space-y-6">
          {/* 页面头部 */}
          <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
            <div>
              <h1 className="text-[26px] font-semibold tracking-tight leading-tight">
                趋势 <span className="text-gradient-gold">分析</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                同比环比分析 · 成本预测 · 异常检测 · 性能衰退预警
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px] h-9 text-xs">
                  <Clock className="h-3.5 w-3.5 mr-2" />
                  <SelectValue placeholder="选择时间范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">最近 7 天</SelectItem>
                  <SelectItem value="30">最近 30 天</SelectItem>
                  <SelectItem value="90">最近 90 天</SelectItem>
                  <SelectItem value="180">最近 180 天</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>

          {/* 同比/环比卡片行 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-fade-up">
            {comparisonCards.map((card, idx) => (
              <Card
                key={card.id}
                className="bg-surface border-border overflow-hidden"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center">
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">{card.title}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-medium ${
                        card.isPositive
                          ? "border-success/20 text-success bg-success/5"
                          : "border-destructive/20 text-destructive bg-destructive/5"
                      }`}
                    >
                      {card.isPositive ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {card.change}
                    </Badge>
                  </div>
                  <div className="mt-3 text-2xl font-semibold tabular tracking-tight">
                    {card.value}
                  </div>
                  {/* 迷你趋势图 */}
                  <div className="mt-3 h-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={card.sparkData.map((v, i) => ({ i, v }))}
                      >
                        <defs>
                          <linearGradient id={`spark-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="0%"
                              stopColor={card.isPositive ? "hsl(142 60% 45%)" : "hsl(0 70% 65%)"}
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="100%"
                              stopColor={card.isPositive ? "hsl(142 60% 45%)" : "hsl(0 70% 65%)"}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke={card.isPositive ? "hsl(142 60% 45%)" : "hsl(0 70% 65%)"}
                          strokeWidth={1.5}
                          fill={`url(#spark-${card.id})`}
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 多指标趋势图 */}
          <Card className="bg-surface border-border animate-fade-up">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-semibold tracking-tight">
                    多指标趋势分析
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    过去 {timeRange} 天核心指标变化趋势
                  </p>
                </div>
                <Tabs value={activeMetric} onValueChange={setActiveMetric}>
                  <TabsList className="h-8 bg-background border border-border">
                    {metricTabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="text-[11px] px-3 data-[state=active]:bg-surface-elevated"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trendData}
                    margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="metric-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor={
                            metricTabs.find((t) => t.id === activeMetric)?.color
                          }
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor={
                            metricTabs.find((t) => t.id === activeMetric)?.color
                          }
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(0 0% 100% / 0.04)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke="hsl(40 6% 56%)"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      interval={Math.floor(parseInt(timeRange) / 6)}
                    />
                    <YAxis
                      stroke="hsl(40 6% 56%)"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(0 0% 8%)",
                        border: "1px solid hsl(0 0% 16%)",
                        borderRadius: 8,
                        fontSize: 11,
                        padding: "6px 10px",
                      }}
                      labelStyle={{
                        color: "hsl(40 6% 56%)",
                        fontSize: 10,
                        marginBottom: 2,
                      }}
                      itemStyle={{ color: "hsl(40 20% 96%)" }}
                      formatter={(v: number) => [
                        `${metricTabs.find((t) => t.id === activeMetric)?.unit}${v.toLocaleString()}`,
                        metricTabs.find((t) => t.id === activeMetric)?.label,
                      ]}
                      cursor={{ stroke: "hsl(0 0% 30%)", strokeDasharray: "3 3" }}
                    />
                    <Area
                      type="monotone"
                      dataKey={activeMetric}
                      stroke={metricTabs.find((t) => t.id === activeMetric)?.color}
                      strokeWidth={2}
                      fill="url(#metric-grad)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 成本预测图表 + 异常检测面板 */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 animate-fade-up">
            {/* 成本预测图表 */}
            <Card className="bg-surface border-border xl:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold tracking-tight">
                      成本预测
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      基于历史数据的未来 7 天成本预测
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">历史成本</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-dashed border border-primary" />
                      <span className="text-muted-foreground">预测趋势</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={costForecastData}
                      margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="cost-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(43 55% 54%)" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="hsl(43 55% 54%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="forecast-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(43 80% 70%)" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="hsl(43 80% 70%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(0 0% 100% / 0.04)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        stroke="hsl(40 6% 56%)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        interval={4}
                      />
                      <YAxis
                        stroke="hsl(40 6% 56%)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        width={40}
                        tickFormatter={(v) => `$${v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(0 0% 8%)",
                          border: "1px solid hsl(0 0% 16%)",
                          borderRadius: 8,
                          fontSize: 11,
                          padding: "6px 10px",
                        }}
                        labelStyle={{
                          color: "hsl(40 6% 56%)",
                          fontSize: 10,
                          marginBottom: 2,
                        }}
                        itemStyle={{ color: "hsl(40 20% 96%)" }}
                        formatter={(v: number, name: string) => [
                          `$${v?.toFixed?.(2) || v}`,
                          name === "cost" ? "历史成本" : "预测成本",
                        ]}
                        cursor={{ stroke: "hsl(0 0% 30%)", strokeDasharray: "3 3" }}
                      />
                      <ReferenceLine
                        x={costForecastData[29]?.day}
                        stroke="hsl(0 0% 30%)"
                        strokeDasharray="3 3"
                      />
                      <Area
                        type="monotone"
                        dataKey="cost"
                        stroke="hsl(43 55% 54%)"
                        strokeWidth={2}
                        fill="url(#cost-grad)"
                        isAnimationActive={false}
                        connectNulls
                      />
                      <Area
                        type="monotone"
                        dataKey="forecast"
                        stroke="hsl(43 80% 70%)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="url(#forecast-grad)"
                        isAnimationActive={false}
                        connectNulls
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* 异常检测面板 */}
            <Card className="bg-surface border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    异常检测
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px]">
                    6 个异常
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                  {anomalyEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3 hover:bg-surface-elevated/50 transition-colors cursor-pointer"
                      onClick={() => handleAnomalyClick(event)}
                    >
                      <div
                        className={`h-7 w-7 rounded-md border flex items-center justify-center shrink-0 ${getSeverityColor(
                          event.severity
                        )}`}
                      >
                        {getSeverityIcon(event.severity)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{event.type}</span>
                          <Badge
                            variant="outline"
                            className={`text-[9px] px-1 py-0 ${getSeverityColor(
                              event.severity
                            )}`}
                          >
                            {event.severity === "critical"
                              ? "严重"
                              : event.severity === "warning"
                              ? "警告"
                              : "信息"}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                          {event.description}
                        </p>
                        <span className="text-[10px] text-muted-foreground/70">
                          {event.time}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 self-center" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 性能衰退预警 */}
          <div className="animate-fade-up">
            <h3 className="text-sm font-semibold tracking-tight mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-destructive" />
              性能衰退预警
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {degradationAlerts.map((alert, idx) => (
                <Card
                  key={alert.id}
                  className="bg-surface border-border border-l-4 border-l-destructive/60 cursor-pointer hover:border-destructive/80 hover:shadow-md transition-all"
                  style={{ animationDelay: `${idx * 60}ms` }}
                  onClick={() => handleAlertClick(alert)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <alert.icon className="h-4 w-4 text-destructive" />
                        </div>
                        <div>
                          <p className="text-xs font-medium">{alert.title}</p>
                          <p className="text-[10px] text-muted-foreground">{alert.metric}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] border-destructive/20 text-destructive bg-destructive/5"
                      >
                        {alert.days} 天趋势
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <p className="text-lg font-semibold tabular">{alert.current}</p>
                        <p className="text-[10px] text-muted-foreground">
                          前值: {alert.previous}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-destructive text-sm font-medium">
                        <TrendingDown className="h-4 w-4" />
                        {alert.trend}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 页脚 */}
          <footer className="pt-2 pb-8 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>AI Pulse · Trends Analysis · v0.1 demo</span>
            <span className="font-mono">build · 2026.04.20</span>
          </footer>
        </div>
      </main>

      {/* 异常事件详情弹窗 */}
      <Dialog open={isAnomalyDialogOpen} onOpenChange={setIsAnomalyDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-surface border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAnomaly && (
                <>
                  <div className={`h-8 w-8 rounded-md border flex items-center justify-center ${getSeverityColor(selectedAnomaly.severity)}`}>
                    {getSeverityIcon(selectedAnomaly.severity)}
                  </div>
                  <span>{selectedAnomaly.type}</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedAnomaly?.time}
            </DialogDescription>
          </DialogHeader>
          {selectedAnomaly && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background border border-border">
                <p className="text-sm text-muted-foreground">{selectedAnomaly.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Info className="h-4 w-4 text-primary" />
                  <span>影响分析</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {selectedAnomaly.impact}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Lightbulb className="h-4 w-4 text-warning" />
                  <span>建议操作</span>
                </div>
                <div className="pl-6 text-sm text-muted-foreground whitespace-pre-line">
                  {selectedAnomaly.suggestion}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={() => {
                  toast.success("已创建工单", { description: `处理 ${selectedAnomaly.type}` });
                  setIsAnomalyDialogOpen(false);
                }}>
                  创建工单
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsAnomalyDialogOpen(false)}>
                  关闭
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 性能预警详情弹窗 */}
      <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-surface border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAlert && (
                <>
                  <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <selectedAlert.icon className="h-4 w-4 text-destructive" />
                  </div>
                  <span>{selectedAlert.title}</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedAlert?.metric} · {selectedAlert?.days} 天趋势
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background border border-border">
                  <p className="text-xs text-muted-foreground mb-1">当前值</p>
                  <p className="text-xl font-semibold text-destructive">{selectedAlert.current}</p>
                </div>
                <div className="p-4 rounded-lg bg-background border border-border">
                  <p className="text-xs text-muted-foreground mb-1">前值</p>
                  <p className="text-xl font-semibold">{selectedAlert.previous}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-2">
                  <TrendingDown className="h-4 w-4" />
                  <span>趋势变化: {selectedAlert.trend}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  该指标在过去 {selectedAlert.days} 天内呈现下降趋势，建议关注并采取相应措施。
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Lightbulb className="h-4 w-4 text-warning" />
                  <span>优化建议</span>
                </div>
                <ul className="pl-6 text-sm text-muted-foreground space-y-1 list-disc">
                  <li>检查相关配置和参数设置</li>
                  <li>分析近期变更对指标的影响</li>
                  <li>考虑调整告警阈值</li>
                  <li>定期监控指标变化趋势</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={() => {
                  toast.success("已设置追踪", { description: `将持续监控 ${selectedAlert.metric}` });
                  setIsAlertDialogOpen(false);
                }}>
                  设置追踪
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsAlertDialogOpen(false)}>
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
