import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { Book, Code, FileText, Zap, ChevronRight, Terminal, Layers, BarChart3, AlertTriangle, CheckCircle2, Copy, ChevronDown } from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  icon?: React.ElementType;
  children?: NavItem[];
};

const docNavItems: NavItem[] = [
  { id: "quickstart", label: "快速开始", icon: Zap },
  {
    id: "sdk",
    label: "SDK 接入指南",
    icon: Code,
    children: [
      { id: "sdk-python", label: "Python SDK" },
      { id: "sdk-javascript", label: "JavaScript SDK" },
      { id: "sdk-java", label: "Java SDK" },
    ],
  },
  {
    id: "api",
    label: "API 文档",
    icon: FileText,
    children: [
      { id: "api-auth", label: "认证方式" },
      { id: "api-events", label: "事件上报" },
      { id: "api-metrics", label: "指标查询" },
      { id: "api-alerts", label: "告警管理" },
    ],
  },
  {
    id: "metrics",
    label: "指标说明",
    icon: BarChart3,
    children: [
      { id: "metrics-ops", label: "运营指标" },
      { id: "metrics-quality", label: "质量指标" },
      { id: "metrics-cost", label: "成本指标" },
      { id: "metrics-value", label: "商业价值指标" },
    ],
  },
];

export function Docs() {
  const [activeSection, setActiveSection] = useState("quickstart");

  const renderContent = () => {
    switch (activeSection) {
      case "quickstart":
        return <QuickStartContent />;
      case "sdk-python":
        return <PythonSdkContent />;
      case "sdk-javascript":
        return <JavaScriptSdkContent />;
      case "sdk-java":
        return <JavaSdkContent />;
      case "api-auth":
      case "api-events":
      case "api-metrics":
      case "api-alerts":
        return <ApiDocContent section={activeSection} />;
      case "metrics-ops":
      case "metrics-quality":
      case "metrics-cost":
      case "metrics-value":
        return <MetricsContent section={activeSection} />;
      default:
        return <QuickStartContent />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar activeKey="文档中心" />
      <main className="flex-1 relative overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-5" />
        <Topbar crumb="文档中心" />
        <div className="px-6 lg:px-8 py-6 space-y-6">
          <div className="flex gap-6 animate-fade-up">
            {/* 左侧文档导航 */}
            <aside className="w-64 shrink-0">
              <Card className="bg-surface border-border sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Book className="h-4 w-4 text-primary" />
                    文档导航
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    <nav className="space-y-1">
                      {docNavItems.map((item) => (
                        <NavTreeItem
                          key={item.id}
                          item={item}
                          activeSection={activeSection}
                          onSelect={setActiveSection}
                        />
                      ))}
                    </nav>
                  </ScrollArea>
                </CardContent>
              </Card>
            </aside>

            {/* 右侧内容区域 */}
            <div className="flex-1 min-w-0">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavTreeItem({
  item,
  activeSection,
  onSelect,
  depth = 0,
}: {
  item: NavItem;
  activeSection: string;
  onSelect: (id: string) => void;
  depth?: number;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeSection === item.id;
  const isChildActive = item.children?.some((child) => child.id === activeSection);
  const [expanded, setExpanded] = useState(isChildActive || isActive);

  const Icon = item.icon;

  // 如果是叶子节点（没有子项）
  if (!hasChildren) {
    return (
      <button
        onClick={() => onSelect(item.id)}
        className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
          isActive
            ? "bg-primary/10 text-primary border border-primary/20"
            : "text-muted-foreground hover:text-foreground hover:bg-surface"
        }`}
        style={{ paddingLeft: `${12 + depth * 12}px` }}
      >
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
        <span className="flex-1 text-left">{item.label}</span>
      </button>
    );
  }

  // 如果有子项，使用 Collapsible
  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <CollapsibleTrigger asChild>
        <button
          className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
            isActive
              ? "bg-primary/10 text-primary border border-primary/20"
              : isChildActive
              ? "text-foreground bg-surface-elevated"
              : "text-muted-foreground hover:text-foreground hover:bg-surface"
          }`}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
        >
          {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            className={`h-3 w-3 shrink-0 transition-transform ${
              expanded ? "" : "-rotate-90"
            }`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 space-y-0.5">
          {item.children!.map((child) => (
            <NavTreeItem
              key={child.id}
              item={child}
              activeSection={activeSection}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function QuickStartContent() {
  const steps = [
    {
      number: 1,
      title: "安装 SDK",
      description: "选择适合您技术栈的 SDK 进行安装",
      code: "# Python\npip install aikpi\n\n# JavaScript\nnpm install @aikpi/sdk",
    },
    {
      number: 2,
      title: "配置密钥",
      description: "在 AI Pulse 控制台获取 API Key 并配置到项目中",
      code: '# 环境变量配置\nexport AIKPI_API_KEY="your-api-key-here"\n\n# 或在代码中初始化\nclient = AiKPIClient(api_key="your-api-key", endpoint="http://localhost:8000")',
    },
    {
      number: 3,
      title: "开始上报",
      description: "使用 SDK 上报 AI 调用事件，开始追踪指标",
      code: '# 上报 AI 调用事件\nclient.track(\n    model="gpt-4o",\n    project="客服助手",\n    input_tokens=150,\n    output_tokens=320,\n    latency_ms=1200,\n    status=200\n)',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-gold flex items-center justify-center">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">快速开始</h1>
          <p className="text-sm text-muted-foreground">
            只需 3 步，即可开始追踪您的 AI 应用性能指标
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {steps.map((step) => (
          <Card key={step.number} className="bg-surface border-border">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                  {step.number}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-base font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                  <CodeBlock code={step.code} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-surface border-border border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">完成！</p>
              <p className="text-sm text-muted-foreground mt-1">
                现在您可以在 AI Pulse 控制台查看实时指标、趋势分析和告警信息。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PythonSdkContent() {
  const code = `from app.sdk.client import AiKPIClient

# 初始化客户端
client = AiKPIClient(api_key="your-api-key", endpoint="http://localhost:8000")

# 上报 AI 调用事件
client.track(
    model="gpt-4o",
    project="客服助手",
    input_tokens=150,
    output_tokens=320,
    latency_ms=1200,
    status=200
)

# 批量上报（推荐用于高并发场景）
events = [
    {"model": "gpt-4o", "project": "客服助手", "input_tokens": 100, "output_tokens": 200, "latency_ms": 800, "status": 200},
    {"model": "claude-3", "project": "RAG检索", "input_tokens": 150, "output_tokens": 300, "latency_ms": 1200, "status": 200},
]
client.track_batch(events)`;

  return (
    <SdkContent
      title="Python SDK"
      description="适用于 Python 后端服务和数据科学工作流"
      installCommand="# 将 SDK 文件引入项目\nfrom app.sdk.client import AiKPIClient"
      code={code}
      features={["同步/异步 API 支持", "自动批量上报", "内置重试机制", "类型提示支持"]}
    />
  );
}

function JavaScriptSdkContent() {
  const code = `import { AiKPI } from '@aikpi/sdk';

// 初始化客户端
const client = new AiKPI({ apiKey: 'your-api-key' });

// 上报 AI 调用事件
await client.trackCall({
    model: 'gpt-4o',
    inputTokens: 150,
    outputTokens: 320,
    latencyMs: 1200,
    success: true
});

// 使用中间件（Express 示例）
import { aiKPIMiddleware } from '@aikpi/sdk/express';

app.use(aiKPIMiddleware({
    apiKey: 'your-api-key',
    extractModel: (req) => req.body.model
}));`;

  return (
    <SdkContent
      title="JavaScript SDK"
      description="适用于 Node.js 后端和前端应用"
      installCommand="npm install @aikpi/sdk"
      code={code}
      features={["Promise/Async-Await 支持", "浏览器和 Node.js 兼容", "框架中间件", "自动错误追踪"]}
    />
  );
}

function JavaSdkContent() {
  const code = `import com.aikpi.Client;

// 初始化客户端
Client client = new Client.Builder()
    .apiKey("your-api-key")
    .build();

// 上报 AI 调用事件
CallEvent event = CallEvent.builder()
    .model("gpt-4o")
    .inputTokens(150)
    .outputTokens(320)
    .latencyMs(1200)
    .success(true)
    .build();

client.trackCall(event);

// Spring Boot 集成
@Configuration
public class AiKPIConfig {
    @Bean
    public AiKPIClient aiKPIClient() {
        return new AiKPIClient("your-api-key");
    }
}`;

  return (
    <SdkContent
      title="Java SDK"
      description="适用于 Java 后端服务和 Spring Boot 应用"
      installCommand="// Maven\n<dependency>\n  <groupId>com.aikpi</groupId>\n  <artifactId>aikpi-sdk</artifactId>\n  <version>1.0.0</version>\n</dependency>"
      code={code}
      features={["Builder 模式", "Spring Boot 自动配置", "异步上报", "线程安全"]}
    />
  );
}

function SdkContent({
  title,
  description,
  installCommand,
  code,
  features,
}: {
  title: string;
  description: string;
  installCommand: string;
  code: string;
  features: string[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Code className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <Badge key={feature} variant="secondary" className="bg-surface-elevated">
            {feature}
          </Badge>
        ))}
      </div>

      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            安装
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={installCommand} />
        </CardContent>
      </Card>

      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4" />
            使用示例
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={code} />
        </CardContent>
      </Card>
    </div>
  );
}

function ApiDocContent({ section }: { section: string }) {
  const apiSections: Record<string, { title: string; description: string; endpoints: { method: string; path: string; desc: string }[] }> = {
    "api-auth": {
      title: "认证方式",
      description: "所有 API 请求都需要在 Header 中携带 API Key 进行认证",
      endpoints: [
        { method: "Header", path: "X-API-Key", desc: "在请求头中携带 API Key" },
        { method: "GET", path: "/api/v1/verify", desc: "验证 API Key 是否有效" },
      ],
    },
    "api-events": {
      title: "事件上报",
      description: "上报 AI 调用事件以追踪性能和成本指标",
      endpoints: [
        { method: "POST", path: "/api/v1/events/track", desc: "上报单个 AI 调用事件" },
        { method: "POST", path: "/api/v1/events/batch", desc: "批量上报多个事件" },
        { method: "GET", path: "/api/v1/events/:id", desc: "查询特定事件的详情" },
      ],
    },
    "api-metrics": {
      title: "指标查询",
      description: "查询各类性能指标和统计数据",
      endpoints: [
        { method: "GET", path: "/api/v1/metrics/overview", desc: "获取指标概览数据" },
        { method: "GET", path: "/api/v1/metrics/trends", desc: "获取指标趋势数据" },
        { method: "GET", path: "/api/v1/metrics/models", desc: "获取模型维度统计" },
        { method: "GET", path: "/api/v1/metrics/projects", desc: "获取项目维度统计" },
      ],
    },
    "api-alerts": {
      title: "告警管理",
      description: "管理告警规则和查询告警历史",
      endpoints: [
        { method: "GET", path: "/api/v1/alerts/rules", desc: "获取告警规则列表" },
        { method: "POST", path: "/api/v1/alerts/rules", desc: "创建新的告警规则" },
        { method: "PUT", path: "/api/v1/alerts/rules/:id", desc: "更新告警规则" },
        { method: "GET", path: "/api/v1/alerts/history", desc: "查询告警历史记录" },
      ],
    },
  };

  const content = apiSections[section] || apiSections["api-auth"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{content.title}</h1>
          <p className="text-sm text-muted-foreground">{content.description}</p>
        </div>
      </div>

      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">API 端点</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">方法</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">路径</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">描述</th>
                </tr>
              </thead>
              <tbody>
                {content.endpoints.map((endpoint, index) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">
                      <Badge
                        variant="secondary"
                        className={`${
                          endpoint.method === "GET"
                            ? "bg-blue-500/10 text-blue-500"
                            : endpoint.method === "POST"
                            ? "bg-green-500/10 text-green-500"
                            : endpoint.method === "PUT"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-surface-elevated"
                        }`}
                      >
                        {endpoint.method}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">{endpoint.path}</td>
                    <td className="py-3 px-4 text-muted-foreground">{endpoint.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {section === "api-auth" && (
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">请求示例</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock code={`curl -X GET \\
  https://api.aikpi.io/v1/metrics/overview \\
  -H 'X-API-Key: your-api-key'`} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricsContent({ section }: { section: string }) {
  const metricsSections: Record<string, { title: string; description: string; metrics: { name: string; formula: string; desc: string }[] }> = {
    "metrics-ops": {
      title: "运营指标",
      description: "反映 AI 服务运营状况的核心指标",
      metrics: [
        { name: "调用次数", formula: "count(events)", desc: "指定时间范围内的 AI 调用总次数" },
        { name: "成功率", formula: "success_count / total_count × 100%", desc: "成功调用占总调用的百分比" },
        { name: "平均延迟", formula: "avg(latency_ms)", desc: "所有调用的平均响应时间（毫秒）" },
        { name: "P95 延迟", formula: "percentile(latency_ms, 95)", desc: "95% 的请求延迟低于此值" },
      ],
    },
    "metrics-quality": {
      title: "质量指标",
      description: "评估 AI 输出质量的指标",
      metrics: [
        { name: "用户满意度", formula: "positive_feedback / total_feedback", desc: "基于用户反馈的满意度评分" },
        { name: "幻觉率", formula: "hallucination_count / total_calls", desc: "检测到幻觉的调用占比" },
        { name: "输出完整性", formula: "complete_outputs / total_outputs", desc: "输出内容完整的比例" },
        { name: "相关性评分", formula: "avg(relevance_score)", desc: "输出与输入相关性的平均评分" },
      ],
    },
    "metrics-cost": {
      title: "成本指标",
      description: "追踪 AI 使用成本的指标",
      metrics: [
        { name: "Token 消耗", formula: "sum(input_tokens + output_tokens)", desc: "总 Token 消耗量" },
        { name: "输入 Token", formula: "sum(input_tokens)", desc: "输入提示的 Token 总量" },
        { name: "输出 Token", formula: "sum(output_tokens)", desc: "AI 输出的 Token 总量" },
        { name: "预估成本", formula: "sum(tokens × model_price_per_1k / 1000)", desc: "基于 Token 消耗估算的成本" },
      ],
    },
    "metrics-value": {
      title: "商业价值指标",
      description: "衡量 AI 投入商业价值的指标",
      metrics: [
        { name: "ROI", formula: "(value_generated - cost) / cost × 100%", desc: "投资回报率" },
        { name: "成本效率", formula: "business_value / cost", desc: "每单位成本产生的业务价值" },
        { name: "转化率", formula: "conversions / total_interactions", desc: "AI 交互促成转化的比例" },
        { name: "用户留存", formula: "returning_users / total_users", desc: "使用 AI 功能后的用户留存率" },
      ],
    },
  };

  const content = metricsSections[section] || metricsSections["metrics-ops"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{content.title}</h1>
          <p className="text-sm text-muted-foreground">{content.description}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {content.metrics.map((metric) => (
          <Card key={metric.name} className="bg-surface border-border">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">{metric.name}</h3>
                  <p className="text-sm text-muted-foreground">{metric.desc}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-black/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">计算公式</div>
                <code className="text-sm font-mono text-green-400">{metric.formula}</code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-surface border-border border-l-4 border-l-yellow-500/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">注意</p>
              <p className="text-sm text-muted-foreground mt-1">
                指标计算基于上报的事件数据，确保 SDK 正确集成以获取准确的指标。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("代码已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-black/50 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-surface/80 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground cursor-pointer"
        title="复制代码"
      >
        {copied ? (
          <CheckCircle2 className="h-4 w-4 text-success" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
