// AI Pulse 演示仪表盘模拟数据

export const sparkline = (n: number, base: number, variance: number, trend = 0) =>
  Array.from({ length: n }, (_, i) => ({
    i,
    v: Math.max(0, base + Math.sin(i / 2) * variance + (Math.random() - 0.5) * variance + i * trend),
  }));

export const kpis = [
  {
    id: "calls",
    label: "总调用次数",
    value: "2,481,392",
    delta: "+12.4%",
    deltaPositive: true,
    sub: "对比最近 7 天",
    spark: sparkline(28, 80, 18, 0.6),
    accent: "primary",
  },
  {
    id: "cost",
    label: "本月支出",
    value: "$18,247.20",
    delta: "−8.1%",
    deltaPositive: true,
    sub: "节省: $1.6k",
    spark: sparkline(28, 60, 14, -0.3),
    accent: "primary",
  },
  {
    id: "tokens",
    label: "已处理 Token",
    value: "1.42 B",
    delta: "+24.7%",
    deltaPositive: true,
    sub: "输入 / 输出: 62% / 38%",
    spark: sparkline(28, 70, 22, 0.9),
    accent: "primary",
  },
  {
    id: "success",
    label: "成功率",
    value: "99.81%",
    delta: "+0.12pp",
    deltaPositive: true,
    sub: "P95 延迟 842ms",
    spark: sparkline(28, 90, 6, 0.05),
    accent: "primary",
  },
];

export const trendData = Array.from({ length: 48 }, (_, i) => {
  const t = i / 47;
  const wave = Math.sin(t * 6) * 18;
  return {
    time: `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
    calls: Math.round(120 + wave + Math.random() * 30 + t * 80),
    cost: +(2.4 + wave * 0.04 + Math.random() * 0.5 + t * 1.2).toFixed(2),
    latency: Math.round(620 + Math.random() * 220 - wave * 2),
  };
});

export const models = [
  { name: "GPT-5", calls: 928_410, cost: 7421.4, share: 38, color: "hsl(43 55% 54%)", success: 99.92, latency: 712 },
  { name: "Claude 4.5 Sonnet", calls: 612_088, cost: 4982.1, share: 25, color: "hsl(43 80% 70%)", success: 99.74, latency: 901 },
  { name: "Gemini 2.5 Pro", calls: 487_220, cost: 3120.7, share: 20, color: "hsl(40 30% 55%)", success: 99.81, latency: 654 },
  { name: "DeepSeek V3.2", calls: 268_551, cost: 980.4, share: 11, color: "hsl(40 12% 38%)", success: 99.42, latency: 1120 },
  { name: "Llama 4 405B", calls: 185_123, cost: 1742.6, share: 6, color: "hsl(40 6% 28%)", success: 99.18, latency: 1340 },
];

export const projects = [
  { name: "客服助手", env: "生产", calls: 842_104, cost: 6210.8, roi: 412, status: "健康", trend: "+18%" },
  { name: "营销内容引擎", env: "生产", calls: 524_389, cost: 4120.2, roi: 287, status: "健康", trend: "+9%" },
  { name: "RAG / 知识检索", env: "生产", calls: 412_910, cost: 3088.4, roi: 196, status: "警告", trend: "−4%" },
  { name: "代码审查助手", env: "预发布", calls: 281_440, cost: 2104.6, roi: 154, status: "健康", trend: "+22%" },
  { name: "销售外呼 AI", env: "生产", calls: 218_902, cost: 1620.9, roi: 318, status: "健康", trend: "+11%" },
  { name: "内部 HR 机器人", env: "生产", calls: 142_087, cost: 612.1, roi: 92, status: "严重", trend: "−12%" },
];

export const liveCalls = [
  { id: "req_8af2", project: "客服助手", model: "GPT-5", tokens: 1842, latency: 612, cost: 0.0184, status: 200, time: "2秒前" },
  { id: "req_8af1", project: "RAG 检索", model: "Claude 4.5", tokens: 4120, latency: 1124, cost: 0.0412, status: 200, time: "3秒前" },
  { id: "req_8af0", project: "营销引擎", model: "GPT-5", tokens: 892, latency: 488, cost: 0.0089, status: 200, time: "4秒前" },
  { id: "req_8aef", project: "代码审查", model: "Gemini 2.5", tokens: 6210, latency: 1840, cost: 0.0312, status: 200, time: "5秒前" },
  { id: "req_8aee", project: "HR 机器人", model: "DeepSeek V3", tokens: 412, latency: 920, cost: 0.0012, status: 429, time: "6秒前" },
  { id: "req_8aed", project: "销售 AI", model: "Claude 4.5", tokens: 1284, latency: 712, cost: 0.0128, status: 200, time: "7秒前" },
  { id: "req_8aec", project: "客服助手", model: "GPT-5", tokens: 982, latency: 540, cost: 0.0098, status: 200, time: "8秒前" },
  { id: "req_8aeb", project: "RAG 检索", model: "Claude 4.5", tokens: 3210, latency: 988, cost: 0.0321, status: 500, time: "9秒前" },
];

// Detailed model comparison dataset (per 1M tokens basis)
export type ModelCompare = {
  id: string;
  name: string;
  vendor: string;
  badge: string;
  context: string;
  // Cost per 1M tokens (input / output, USD)
  inputCost: number;
  outputCost: number;
  blendedCost: number;
  // Quality
  accuracy: number;       // 0-100
  hallucination: number;  // 0-100 (lower better)
  reasoning: number;      // 0-100
  coding: number;         // 0-100
  multilingual: number;   // 0-100
  // Performance
  latencyP50: number;     // ms first token
  latencyP95: number;     // ms total
  throughput: number;     // tokens/s
  uptime: number;         // %
  // Composite
  valueIndex: number;     // performance / cost composite, higher better
  // 14 day accuracy spark
  spark: { i: number; v: number }[];
};

export const modelCompare: ModelCompare[] = [
  {
    id: "gpt5",
    name: "GPT-5",
    vendor: "OpenAI",
    badge: "旗舰",
    context: "400K",
    inputCost: 5.0,
    outputCost: 15.0,
    blendedCost: 8.0,
    accuracy: 94.2,
    hallucination: 2.1,
    reasoning: 96,
    coding: 94,
    multilingual: 92,
    latencyP50: 412,
    latencyP95: 712,
    throughput: 142,
    uptime: 99.98,
    valueIndex: 87,
    spark: sparkline(14, 92, 2, 0.15),
  },
  {
    id: "claude45",
    name: "Claude 4.5 Sonnet",
    vendor: "Anthropic",
    badge: "均衡",
    context: "500K",
    inputCost: 3.0,
    outputCost: 12.0,
    blendedCost: 5.4,
    accuracy: 93.6,
    hallucination: 1.8,
    reasoning: 95,
    coding: 96,
    multilingual: 89,
    latencyP50: 488,
    latencyP95: 901,
    throughput: 118,
    uptime: 99.95,
    valueIndex: 92,
    spark: sparkline(14, 91, 2, 0.18),
  },
  {
    id: "gemini25",
    name: "Gemini 2.5 Pro",
    vendor: "Google",
    badge: "多模态",
    context: "2M",
    inputCost: 1.25,
    outputCost: 5.0,
    blendedCost: 2.3,
    accuracy: 91.4,
    hallucination: 3.2,
    reasoning: 92,
    coding: 89,
    multilingual: 95,
    latencyP50: 322,
    latencyP95: 654,
    throughput: 168,
    uptime: 99.92,
    valueIndex: 96,
    spark: sparkline(14, 89, 3, 0.16),
  },
  {
    id: "deepseek",
    name: "DeepSeek V3.2",
    vendor: "DeepSeek",
    badge: "性价比之王",
    context: "128K",
    inputCost: 0.27,
    outputCost: 1.1,
    blendedCost: 0.5,
    accuracy: 88.7,
    hallucination: 4.1,
    reasoning: 89,
    coding: 91,
    multilingual: 84,
    latencyP50: 612,
    latencyP95: 1120,
    throughput: 96,
    uptime: 99.78,
    valueIndex: 99,
    spark: sparkline(14, 86, 3, 0.14),
  },
];

// Per-task win matrix (which model is best for which scenario)
export const taskMatrix = [
  { task: "客服支持",     gpt5: 92, claude45: 95, gemini25: 90, deepseek: 87 },
  { task: "代码生成",      gpt5: 94, claude45: 96, gemini25: 89, deepseek: 91 },
  { task: "RAG / 检索",      gpt5: 93, claude45: 94, gemini25: 92, deepseek: 86 },
  { task: "长上下文摘要", gpt5: 90, claude45: 92, gemini25: 96, deepseek: 82 },
  { task: "多语言",         gpt5: 92, claude45: 89, gemini25: 95, deepseek: 84 },
  { task: "结构化抽取",gpt5: 95, claude45: 94, gemini25: 91, deepseek: 89 },
  { task: "创意写作",     gpt5: 93, claude45: 95, gemini25: 88, deepseek: 85 },
];

// 30-day blended cost & accuracy for the trend chart
export const modelTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  gpt5: +(94 + Math.sin(i / 3) * 0.6 + Math.random() * 0.4).toFixed(2),
  claude45: +(93.5 + Math.sin(i / 4) * 0.5 + Math.random() * 0.4).toFixed(2),
  gemini25: +(91 + Math.sin(i / 2.5) * 0.7 + Math.random() * 0.4).toFixed(2),
  deepseek: +(88 + Math.sin(i / 3.5) * 0.8 + Math.random() * 0.5).toFixed(2),
}));

export const alerts = [
  { level: "critical", title: "HR 机器人准确率降至 78%", time: "12分钟前", project: "内部 HR 机器人" },
  { level: "warning", title: "RAG 召回率持续下降（−6% / 24小时）", time: "38分钟前", project: "RAG 检索" },
  { level: "info", title: "自动切换 8% 流量至 DeepSeek V3.2（节省 $182）", time: "1小时前", project: "营销引擎" },
];

// Prompt version comparison: same model (Claude 4.5), three prompt iterations
export const promptVersions = [
  {
    version: "V1",
    label: "基线",
    author: "alice",
    updated: "2026-02-14",
    description: "原始零样本 Prompt，仅包含最少指令。",
    accuracy: 86.4,
    tokensIn: 412,
    tokensOut: 318,
    costPer1k: 0.0061,
    latency: 1180,
    helpfulRate: 78.2,
    samples: 4820,
  },
  {
    version: "V2",
    label: "少样本示例",
    author: "alice",
    updated: "2026-03-09",
    description: "添加 3 个上下文示例 + 结构化输出模式。",
    accuracy: 92.1,
    tokensIn: 684,
    tokensOut: 246,
    costPer1k: 0.0072,
    latency: 1320,
    helpfulRate: 86.5,
    samples: 5104,
  },
  {
    version: "V3",
    label: "思维链 + 压缩模式",
    author: "marc",
    updated: "2026-04-11",
    description: "思维链推理，压缩模式，缓存友好的系统 Prompt。",
    accuracy: 94.7,
    tokensIn: 358,
    tokensOut: 198,
    costPer1k: 0.0048,
    latency: 980,
    helpfulRate: 91.3,
    samples: 5388,
  },
];

// Value Assessment — Baseline (manual / pre-AI) vs Post-AI metrics
export const valueAssessment = {
  period: "最近 90 天",
  project: "所有项目 · 加权汇总",
  headline: {
    roi: 318,            // %
    monthlySavings: 84200,   // $
    paybackDays: 27,
    confidence: 0.94,
  },
  // Big delta cards — the boss-mode summary
  deltas: [
    {
      key: "time",
      label: "Time per task",
      baseline: 14.2,        // minutes
      postAi: 1.8,
      unit: "min",
      better: "low",
      narrative: "平均任务在 2 分钟内完成 — 从 15 分钟大幅下降。"
    },
    {
      key: "cost",
      label: "Cost per task",
      baseline: 6.40,        // $
      postAi: 0.72,
      unit: "$",
      better: "low",
      narrative: "混合成本（人工 + 基础设施）下降约 89%。"
    },
    {
      key: "errorRate",
      label: "Error rate",
      baseline: 7.8,         // %
      postAi: 1.4,
      unit: "%",
      better: "low",
      narrative: "所有团队 QA 重开率趋于零。"
    },
    {
      key: "throughput",
      label: "Tasks / day",
      baseline: 320,
      postAi: 1840,
      unit: "",
      better: "high",
      narrative: "相同人手，5.7 倍的吞吐量。"
    },
    {
      key: "csat",
      label: "CSAT",
      baseline: 3.6,
      postAi: 4.6,
      unit: "/5",
      better: "high",
      narrative: "客户满意度提升一整分 — NPS +28。"
    },
    {
      key: "firstResponse",
      label: "First response",
      baseline: 312,         // seconds
      postAi: 24,
      unit: "s",
      better: "low",
      narrative: "从 5 分钟降至 30 秒以下。"
    },
  ],
  // Monthly ROI bridge — value generated vs cost incurred
  roiTrend: Array.from({ length: 12 }, (_, i) => {
    const value = 22000 + i * 9500 + Math.sin(i / 2) * 4000;
    const cost = 8000 + i * 1100 + Math.cos(i / 3) * 600;
    return {
      month: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"][i],
      value: Math.round(value),
      cost: Math.round(cost),
      net: Math.round(value - cost),
    };
  }),
  // Where the value is coming from
  valueBreakdown: [
    { source: "节省人力成本", amount: 48200, share: 57 },
    { source: "加快交付周期 → 收入提升", amount: 19800, share: 24 },
    { source: "减少错误 → 减少返工", amount: 9100, share: 11 },
    { source: "提升 CSAT → 留存提升", amount: 7100, share: 8 },
  ],
  // Per-team / per-project value
  byProject: [
    { project: "客服机器人",  hoursSaved: 1840, costSaved: 28400, roi: 412, status: "扩展中" },
    { project: "营销引擎",      hoursSaved: 980,  costSaved: 19200, roi: 286, status: "扩展中" },
    { project: "RAG 检索",            hoursSaved: 720,  costSaved: 14600, roi: 198, status: "稳定"  },
    { project: "销售副驾驶",        hoursSaved: 540,  costSaved: 12800, roi: 174, status: "稳定"  },
    { project: "内部 HR 机器人",       hoursSaved: 290,  costSaved:  6400, roi:  88, status: "待审查"  },
    { project: "代码审查助手", hoursSaved: 410,  costSaved:  9200, roi: 142, status: "稳定"  },
  ],
  // Decision recommendations the AI surfaces to the C-suite
  decisions: [
    {
      level: "expand",
      title: "将客服机器人扩展至所有区域",
      detail: "ROI 412% · 若推广至亚太 + 拉丁美洲，预计每月增加 $38k。",
    },
    {
      level: "optimize",
      title: "将营销引擎迁移至 DeepSeek V3.2",
      detail: "质量持平，Token 成本降低 28% · 预计每月节省 $4.6k。",
    },
    {
      level: "review",
      title: "重新评估内部 HR 机器人",
      detail: "ROI 88%（低于 150% 阈值） · 上周准确率降至 78%。",
    },
  ],
};

// ===== Quality Metrics dashboard =====
export const qualityHeadline = {
  overallAccuracy: 93.4,     // %
  accuracyDelta: 1.8,        // pp vs prev period
  hallucinationRate: 1.6,    // %
  hallucinationDelta: -0.4,  // pp (lower = better)
  taskCompletion: 88.2,      // %
  taskCompletionDelta: 2.1,
  csat: 4.5,                 // /5
  csatDelta: 0.2,
  evaluatedSamples: 48210,
  judgeModel: "Claude 4.5 (LLM-as-judge)",
};

// Accuracy broken down by task type
export const accuracyByTask = [
  { task: "分类",        accuracy: 96.2, samples: 9820, trend: "up" },
  { task: "生成",            accuracy: 91.4, samples: 12480, trend: "up" },
  { task: "抽取",            accuracy: 94.8, samples: 8120, trend: "flat" },
  { task: "摘要",         accuracy: 89.6, samples: 6240, trend: "up" },
  { task: "翻译",           accuracy: 92.1, samples: 4180, trend: "down" },
  { task: "代码生成",       accuracy: 90.7, samples: 7370, trend: "up" },
];

// IR / RAG scoring
export const retrievalMetrics = {
  recallAtK: [
    { k: "@1", recall: 62.4 },
    { k: "@3", recall: 81.2 },
    { k: "@5", recall: 89.6 },
    { k: "@10", recall: 94.8 },
    { k: "@20", recall: 97.3 },
  ],
  precision: 87.2,
  f1: 88.4,
  mrr: 0.812,
  chunkHitRate: 91.4,
};

// LLM-as-judge sub-scores (1-5)
export const judgeScores = [
  { metric: "相关性",    score: 4.6, prev: 4.4 },
  { metric: "连贯性",    score: 4.5, prev: 4.4 },
  { metric: "流畅性",      score: 4.7, prev: 4.6 },
  { metric: "忠实度", score: 4.3, prev: 4.1 },
  { metric: "有用性",  score: 4.4, prev: 4.2 },
  { metric: "安全性",       score: 4.8, prev: 4.7 },
];

// Consistency — same question asked N times, semantic similarity
export const consistencyScores = [
  { project: "客服机器人", score: 0.94, runs: 5 },
  { project: "RAG 检索",            score: 0.89, runs: 5 },
  { project: "营销引擎",      score: 0.78, runs: 5 },
  { project: "代码审查助手", score: 0.91, runs: 5 },
  { project: "销售副驾驶",        score: 0.86, runs: 5 },
];

// Error type distribution (% of total errors)
export const errorTypes = [
  { type: "格式错误",       share: 32, count: 612, trend: -8 },
  { type: "事实错误",      share: 24, count: 458, trend: -3 },
  { type: "逻辑错误",        share: 18, count: 344, trend: +2 },
  { type: "幻觉",      share: 12, count: 229, trend: -5 },
  { type: "偏题",          share: 8,  count: 153, trend: +1 },
  { type: "安全违规",   share: 4,  count: 76,  trend: -2 },
  { type: "其他",              share: 2,  count: 38,  trend: 0  },
];

// User feedback feed
export const feedbackStats = {
  thumbsUp: 8420,
  thumbsDown: 612,
  nps: 58,
  npsDelta: 6,
  ratingsAvg: 4.5,
  ratingsTotal: 9032,
  distribution: [
    { stars: 5, count: 5240 },
    { stars: 4, count: 2680 },
    { stars: 3, count: 740 },
    { stars: 2, count: 240 },
    { stars: 1, count: 132 },
  ],
};

// 30-day quality trend — overall accuracy + hallucination rate
export const qualityTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  accuracy: +(91.5 + Math.sin(i / 4) * 1.6 + Math.random() * 0.6).toFixed(2),
  hallucination: +(2.4 + Math.cos(i / 5) * 0.6 - i * 0.02 + Math.random() * 0.2).toFixed(2),
}));
