import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Settings as SettingsIcon,
  Key,
  Bot,
  Users,
  Bell,
  Download,
  Copy,
  Trash2,
  Plus,
  Check,
  Globe,
  Clock,
  Database,
  Mail,
  MessageSquare,
  Webhook,
  Slack,
  FileSpreadsheet,
  FileJson,
  Calendar,
} from "lucide-react";

// Mock 数据
const mockApiKeys = [
  { id: 1, name: "生产环境密钥", key: "sk-...a3f9", createdAt: "2026-04-01", lastUsed: "2026-04-20 14:30", status: "active" },
  { id: 2, name: "测试环境密钥", key: "sk-...b7c2", createdAt: "2026-04-10", lastUsed: "2026-04-19 09:15", status: "active" },
  { id: 3, name: "开发环境密钥", key: "sk-...d8e1", createdAt: "2026-03-15", lastUsed: "2026-03-28 16:45", status: "inactive" },
];

const mockModels = [
  { id: 1, name: "GPT-4o", provider: "OpenAI", status: "active", inputPrice: "0.005", outputPrice: "0.015" },
  { id: 2, name: "Claude 3.5 Sonnet", provider: "Anthropic", status: "active", inputPrice: "0.003", outputPrice: "0.015" },
  { id: 3, name: "Gemini Pro", provider: "Google", status: "active", inputPrice: "0.0005", outputPrice: "0.0015" },
  { id: 4, name: "Qwen-Max", provider: "阿里云", status: "inactive", inputPrice: "0.002", outputPrice: "0.006" },
];

const mockUsers = [
  { id: 1, name: "张三", email: "zhangsan@company.com", role: "管理员", status: "active", lastLogin: "2026-04-20 09:30" },
  { id: 2, name: "李四", email: "lisi@company.com", role: "数据分析师", status: "active", lastLogin: "2026-04-19 16:45" },
  { id: 3, name: "王五", email: "wangwu@company.com", role: "业务负责人", status: "active", lastLogin: "2026-04-18 11:20" },
  { id: 4, name: "赵六", email: "zhaoliu@company.com", role: "只读", status: "inactive", lastLogin: "2026-04-10 14:00" },
];

const mockNotifications = [
  { id: "email", name: "邮件通知", icon: Mail, enabled: true, config: { smtp: "smtp.company.com", port: "587" } },
  { id: "dingtalk", name: "钉钉 Webhook", icon: MessageSquare, enabled: false, config: { webhook: "" } },
  { id: "wechat", name: "企业微信", icon: Webhook, enabled: true, config: { webhook: "https://qyapi.weixin.qq.com/..." } },
  { id: "slack", name: "Slack", icon: Slack, enabled: false, config: { webhook: "" } },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [notificationSettings, setNotificationSettings] = useState(mockNotifications);

  const handleCopyKey = (id: number) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleNotification = (id: string) => {
    setNotificationSettings(prev =>
      prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
    );
  };

  const tabs = [
    { id: "general", label: "通用设置", icon: SettingsIcon },
    { id: "api", label: "API 密钥", icon: Key },
    { id: "models", label: "模型配置", icon: Bot },
    { id: "users", label: "用户管理", icon: Users },
    { id: "notifications", label: "通知设置", icon: Bell },
    { id: "export", label: "数据导出", icon: Download },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar activeKey="系统设置" />
      <main className="flex-1 relative overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-5" />
        <Topbar crumb="系统设置" />
        <div className="px-6 lg:px-8 py-6 space-y-6">
          {/* 页面标题 */}
          <header className="animate-fade-up">
            <h1 className="text-[26px] font-semibold tracking-tight leading-tight">
              系统 <span className="text-gradient-gold">设置</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              管理平台配置、API 密钥、用户权限和通知设置
            </p>
          </header>

          {/* 设置 Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 animate-fade-up">
            <TabsList className="bg-surface border border-border p-1 h-auto flex flex-wrap gap-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2"
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab 1: 通用设置 */}
            <TabsContent value="general" className="space-y-6">
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    通用设置
                  </CardTitle>
                  <CardDescription>配置平台基本信息和全局选项</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="platform-name">平台名称</Label>
                      <Input
                        id="platform-name"
                        defaultValue="AI Pulse"
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">默认时区</Label>
                      <Select defaultValue="asia-shanghai">
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asia-shanghai">Asia/Shanghai (UTC+8)</SelectItem>
                          <SelectItem value="asia-tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                          <SelectItem value="america-new_york">America/New_York (UTC-5)</SelectItem>
                          <SelectItem value="europe-london">Europe/London (UTC+0)</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">界面语言</Label>
                      <Select defaultValue="zh">
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zh">中文</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retention">数据保留期限（天）</Label>
                      <Input
                        id="retention"
                        type="number"
                        defaultValue="90"
                        className="bg-background border-border"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-gradient-gold text-primary-foreground">
                      <Check className="h-4 w-4 mr-2" />
                      保存设置
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: API 密钥管理 */}
            <TabsContent value="api" className="space-y-6">
              <Card className="bg-surface border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Key className="h-5 w-5 text-primary" />
                      API 密钥管理
                    </CardTitle>
                    <CardDescription>管理用于访问 API 的密钥</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-gold text-primary-foreground">
                        <Plus className="h-4 w-4 mr-2" />
                        生成新密钥
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-surface border-border">
                      <DialogHeader>
                        <DialogTitle>生成新 API 密钥</DialogTitle>
                        <DialogDescription>为新密钥设置一个描述性名称</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="key-name">密钥名称</Label>
                          <Input id="key-name" placeholder="例如：生产环境密钥" className="bg-background border-border" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" className="border-border">取消</Button>
                        <Button className="bg-gradient-gold text-primary-foreground">生成</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead>名称</TableHead>
                        <TableHead>密钥</TableHead>
                        <TableHead>创建时间</TableHead>
                        <TableHead>最后使用</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockApiKeys.map((apiKey) => (
                        <TableRow key={apiKey.id} className="border-border">
                          <TableCell className="font-medium">{apiKey.name}</TableCell>
                          <TableCell className="font-mono text-xs">{apiKey.key}</TableCell>
                          <TableCell className="text-muted-foreground">{apiKey.createdAt}</TableCell>
                          <TableCell className="text-muted-foreground">{apiKey.lastUsed}</TableCell>
                          <TableCell>
                            <Badge
                              variant={apiKey.status === "active" ? "default" : "secondary"}
                              className={apiKey.status === "active" ? "bg-success/20 text-success border-success/30" : ""}
                            >
                              {apiKey.status === "active" ? "活跃" : "已禁用"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleCopyKey(apiKey.id)}
                              >
                                {copiedId === apiKey.id ? (
                                  <Check className="h-4 w-4 text-success" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: 模型配置 */}
            <TabsContent value="models" className="space-y-6">
              <Card className="bg-surface border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      模型配置
                    </CardTitle>
                    <CardDescription>管理已接入的 AI 模型及其费率</CardDescription>
                  </div>
                  <Button className="bg-gradient-gold text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    添加模型
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead>模型名称</TableHead>
                        <TableHead>提供商</TableHead>
                        <TableHead>输入 Token 单价</TableHead>
                        <TableHead>输出 Token 单价</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockModels.map((model) => (
                        <TableRow key={model.id} className="border-border">
                          <TableCell className="font-medium">{model.name}</TableCell>
                          <TableCell className="text-muted-foreground">{model.provider}</TableCell>
                          <TableCell>
                            <Input
                              defaultValue={model.inputPrice}
                              className="w-24 h-8 bg-background border-border text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              defaultValue={model.outputPrice}
                              className="w-24 h-8 bg-background border-border text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={model.status === "active" ? "default" : "secondary"}
                              className={model.status === "active" ? "bg-success/20 text-success border-success/30" : ""}
                            >
                              {model.status === "active" ? "已启用" : "已禁用"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8">
                              编辑
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: 用户管理 */}
            <TabsContent value="users" className="space-y-6">
              <Card className="bg-surface border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      用户管理
                    </CardTitle>
                    <CardDescription>管理平台用户及其权限</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-gold text-primary-foreground">
                        <Plus className="h-4 w-4 mr-2" />
                        邀请用户
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-surface border-border">
                      <DialogHeader>
                        <DialogTitle>邀请新用户</DialogTitle>
                        <DialogDescription>发送邀请邮件给新用户</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="invite-email">邮箱地址</Label>
                          <Input id="invite-email" type="email" placeholder="user@company.com" className="bg-background border-border" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="invite-role">角色</Label>
                          <Select defaultValue="analyst">
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">管理员</SelectItem>
                              <SelectItem value="analyst">数据分析师</SelectItem>
                              <SelectItem value="business">业务负责人</SelectItem>
                              <SelectItem value="readonly">只读</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" className="border-border">取消</Button>
                        <Button className="bg-gradient-gold text-primary-foreground">发送邀请</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead>姓名</TableHead>
                        <TableHead>邮箱</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>最后登录</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map((user) => (
                        <TableRow key={user.id} className="border-border">
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-border">
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={user.status === "active" ? "default" : "secondary"}
                              className={user.status === "active" ? "bg-success/20 text-success border-success/30" : ""}
                            >
                              {user.status === "active" ? "活跃" : "已禁用"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8">
                              编辑
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 5: 通知设置 */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    通知设置
                  </CardTitle>
                  <CardDescription>配置通知渠道和接收方式</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 通知渠道 */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">通知渠道</h4>
                    {notificationSettings.map((channel) => (
                      <div key={channel.id} className="flex items-start justify-between p-4 rounded-lg border border-border bg-background">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center">
                            <channel.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium">{channel.name}</div>
                            {channel.enabled && (
                              <Input
                                placeholder="配置信息..."
                                defaultValue={Object.values(channel.config)[0] as string}
                                className="w-80 h-8 bg-surface border-border text-xs"
                              />
                            )}
                          </div>
                        </div>
                        <Switch
                          checked={channel.enabled}
                          onCheckedChange={() => toggleNotification(channel.id)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* 通知频率 */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-muted-foreground">通知频率</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">实时通知</div>
                          <div className="text-xs text-muted-foreground">事件发生时立即发送</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">每小时汇总</div>
                          <div className="text-xs text-muted-foreground">每小时发送一次汇总</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg border border-primary bg-primary/5 cursor-pointer">
                        <Database className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">每日汇总</div>
                          <div className="text-xs text-muted-foreground">每天发送一次日报</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-gradient-gold text-primary-foreground">
                      <Check className="h-4 w-4 mr-2" />
                      保存设置
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 6: 数据导出 */}
            <TabsContent value="export" className="space-y-6">
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    数据导出
                  </CardTitle>
                  <CardDescription>导出平台数据用于分析和备份</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 导出格式 */}
                  <div className="space-y-3">
                    <Label>导出格式</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg border border-primary bg-primary/5 cursor-pointer">
                        <FileSpreadsheet className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Excel</div>
                          <div className="text-xs text-muted-foreground">.xlsx 格式</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50">
                        <Database className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">CSV</div>
                          <div className="text-xs text-muted-foreground">逗号分隔值</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50">
                        <FileJson className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">JSON</div>
                          <div className="text-xs text-muted-foreground">结构化数据</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 导出范围 */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <Label>导出范围</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">时间范围</Label>
                        <Select defaultValue="7d">
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="24h">最近 24 小时</SelectItem>
                            <SelectItem value="7d">最近 7 天</SelectItem>
                            <SelectItem value="30d">最近 30 天</SelectItem>
                            <SelectItem value="90d">最近 90 天</SelectItem>
                            <SelectItem value="custom">自定义</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">项目</Label>
                        <Select defaultValue="all">
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">全部项目</SelectItem>
                            <SelectItem value="project-a">项目 A</SelectItem>
                            <SelectItem value="project-b">项目 B</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">指标类型</Label>
                        <Select defaultValue="all">
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">全部指标</SelectItem>
                            <SelectItem value="cost">成本指标</SelectItem>
                            <SelectItem value="quality">质量指标</SelectItem>
                            <SelectItem value="performance">性能指标</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                    <Button className="bg-gradient-gold text-primary-foreground">
                      <Download className="h-4 w-4 mr-2" />
                      立即导出
                    </Button>
                    <Button variant="outline" className="border-border">
                      <Clock className="h-4 w-4 mr-2" />
                      定时导出
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* 页脚 */}
          <footer className="pt-2 pb-8 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>AI Pulse · KPI Dashboard · v0.1 demo</span>
            <span className="font-mono">build · 2026.04.18</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
