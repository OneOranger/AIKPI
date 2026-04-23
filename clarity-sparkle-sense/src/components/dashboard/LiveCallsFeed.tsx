import { useState } from "react";
import { liveCalls } from "@/lib/mockData";
import { Terminal, Clock, Cpu, DollarSign, Hash, FileJson, MessageSquare, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// 调用详情扩展数据
const callDetails: Record<string, {
  request: string;
  response: string;
  promptTokens: number;
  completionTokens: number;
  userAgent: string;
  ip: string;
}> = {
  "req_8af2": {
    request: "请帮我查询订单 #12345 的物流状态",
    response: "好的，我来为您查询订单 #12345 的物流状态。根据系统显示，您的订单已于 2026-04-18 发货，当前状态为\"运输中\"，预计送达时间为 2026-04-22。您可以点击以下链接查看详细物流信息...",
    promptTokens: 1242,
    completionTokens: 600,
    userAgent: "Mozilla/5.0 (CustomerService/2.1)",
    ip: "10.0.12.45",
  },
  "req_8af1": {
    request: "搜索关于\"机器学习\"的相关文档",
    response: "我为您找到了以下相关文档：\n1. 《机器学习入门指南》- 评分: 4.8/5\n2. 《深度学习实践》- 评分: 4.6/5\n3. 《AI 算法详解》- 评分: 4.5/5\n\n请问您需要查看哪一篇的详细内容？",
    promptTokens: 3120,
    completionTokens: 1000,
    userAgent: "RAG-Service/1.8",
    ip: "10.0.15.22",
  },
  "req_8af0": {
    request: "生成一篇关于春季促销的营销文案",
    response: "【春季焕新季】\n\n春风十里，不如你！\n\n这个春天，让我们一起焕新出发。全场商品低至 5 折起，更有满减优惠等你来拿！\n\n活动时间：4月20日 - 5月5日\n\n立即抢购 →",
    promptTokens: 542,
    completionTokens: 350,
    userAgent: "Marketing-Engine/3.2",
    ip: "10.0.18.91",
  },
  "req_8aef": {
    request: "审查以下代码是否存在安全问题：function authenticate(user, pwd) { return db.query(\"SELECT * FROM users WHERE name='\" + user + \"'\"); }",
    response: "⚠️ 发现严重安全漏洞：SQL 注入\n\n问题分析：\n代码直接拼接用户输入到 SQL 查询中，存在 SQL 注入风险。\n\n修复建议：\n使用参数化查询：\n```\ndb.query(\"SELECT * FROM users WHERE name = ?\", [user]);\n```\n\n同时建议：\n1. 对密码进行哈希处理\n2. 实施速率限制\n3. 添加输入验证",
    promptTokens: 4210,
    completionTokens: 2000,
    userAgent: "CodeReview-Bot/2.0",
    ip: "10.0.22.17",
  },
  "req_8aee": {
    request: "帮我申请明天的年假",
    response: "",
    promptTokens: 312,
    completionTokens: 0,
    userAgent: "HR-Assistant/1.5",
    ip: "10.0.25.33",
  },
  "req_8aed": {
    request: "生成销售话术：客户对价格有异议",
    response: "理解您对价格的关注。让我为您分析一下：\n\n1. 我们的价格包含了 3 年免费技术支持\n2. 相比竞品，我们的功能覆盖率高 40%\n3. 现在签约可享受早鸟优惠，节省 20%\n\n您觉得哪个方面最符合您的需求？",
    promptTokens: 684,
    completionTokens: 600,
    userAgent: "Sales-AI/2.3",
    ip: "10.0.28.56",
  },
  "req_8aec": {
    request: "退款流程是什么？",
    response: "我们的退款流程如下：\n\n1. 登录账户，进入\"我的订单\"\n2. 选择需要退款的订单\n3. 点击\"申请退款\"按钮\n4. 填写退款原因\n5. 提交后 1-3 个工作日内处理\n\n退款将原路返回至您的支付账户。如有疑问，请联系客服。",
    promptTokens: 482,
    completionTokens: 500,
    userAgent: "Mozilla/5.0 (CustomerService/2.1)",
    ip: "10.0.12.46",
  },
  "req_8aeb": {
    request: "公司年假政策是什么？",
    response: "",
    promptTokens: 2210,
    completionTokens: 0,
    userAgent: "RAG-Service/1.8",
    ip: "10.0.15.23",
  },
};

export function LiveCallsFeed() {
  const [selectedCall, setSelectedCall] = useState<typeof liveCalls[number] | null>(null);

  return (
    <>
      <div className="rounded-xl border border-border bg-surface overflow-hidden animate-fade-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight">实时调用</h3>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
                流式传输
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">所有项目的最新请求</p>
          </div>
          <button className="text-[11px] text-primary hover:text-primary-glow transition-colors">打开日志 →</button>
        </div>

        <div className="divide-y divide-border">
          {liveCalls.map((c) => {
            const ok = c.status >= 200 && c.status < 300;
            return (
              <div 
                key={c.id} 
                onClick={() => setSelectedCall(c)}
                className="grid grid-cols-12 gap-2 items-center px-5 py-2.5 text-[11px] hover:bg-surface-elevated/50 cursor-pointer transition-colors"
              >
                <div className="col-span-2 font-mono text-muted-foreground truncate">{c.id}</div>
                <div className="col-span-3 truncate font-medium">{c.project}</div>
                <div className="col-span-2 text-muted-foreground truncate">{c.model}</div>
                <div className="col-span-1 tabular text-muted-foreground">{c.tokens}</div>
                <div className="col-span-1 tabular text-muted-foreground">{c.latency}ms</div>
                <div className="col-span-1 tabular font-medium">${c.cost.toFixed(4)}</div>
                <div className="col-span-1">
                  <span
                    className={`inline-flex items-center font-mono text-[10px] rounded px-1.5 py-0.5 border ${
                      ok
                        ? "text-success bg-success/5 border-success/20"
                        : c.status === 429
                        ? "text-warning bg-warning/5 border-warning/20"
                        : "text-destructive bg-destructive/5 border-destructive/20"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="col-span-1 text-right text-muted-foreground tabular">{c.time}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 调用详情侧面板 */}
      <Sheet open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              调用详情
            </SheetTitle>
            <SheetDescription>
              {selectedCall?.id} · {selectedCall?.project}
            </SheetDescription>
          </SheetHeader>
          
          {selectedCall && (
            <div className="mt-6 space-y-5">
              {/* 状态概览 */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border border-border bg-muted/30 text-center">
                  <div className={`text-lg font-bold ${selectedCall.status >= 200 && selectedCall.status < 300 ? "text-success" : selectedCall.status === 429 ? "text-warning" : "text-destructive"}`}>
                    {selectedCall.status}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">状态码</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/30 text-center">
                  <div className="text-lg font-bold tabular">{selectedCall.latency}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">ms</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/30 text-center">
                  <div className="text-lg font-bold tabular">{selectedCall.tokens}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Tokens</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/30 text-center">
                  <div className="text-lg font-bold tabular">${selectedCall.cost.toFixed(4)}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">成本</div>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    请求 ID
                  </div>
                  <span className="font-mono text-sm">{selectedCall.id}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    时间
                  </div>
                  <span className="text-sm">{selectedCall.time}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Cpu className="h-4 w-4" />
                    模型
                  </div>
                  <span className="text-sm">{selectedCall.model}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    项目
                  </div>
                  <span className="text-sm">{selectedCall.project}</span>
                </div>
              </div>

              {/* Token 详情 */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <FileJson className="h-4 w-4 text-muted-foreground" />
                  Token 详情
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground mb-1">Prompt Tokens</div>
                    <div className="text-lg font-semibold tabular">{callDetails[selectedCall.id]?.promptTokens || "-"}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground mb-1">Completion Tokens</div>
                    <div className="text-lg font-semibold tabular">{callDetails[selectedCall.id]?.completionTokens || "-"}</div>
                  </div>
                </div>
              </div>

              {/* 请求内容 */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  请求内容
                </h4>
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {callDetails[selectedCall.id]?.request || "暂无数据"}
                  </p>
                </div>
              </div>

              {/* 响应内容 */}
              {selectedCall.status === 200 && (
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    响应内容
                  </h4>
                  <div className="p-3 rounded-lg border border-border bg-muted/30">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {callDetails[selectedCall.id]?.response || "暂无数据"}
                    </p>
                  </div>
                </div>
              )}

              {/* 技术信息 */}
              <div>
                <h4 className="text-sm font-medium mb-3">技术信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User-Agent</span>
                    <span className="font-mono text-xs">{callDetails[selectedCall.id]?.userAgent || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP 地址</span>
                    <span className="font-mono text-xs">{callDetails[selectedCall.id]?.ip || "-"}</span>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedCall(null)}>
                  关闭
                </Button>
                <Button className="flex-1">
                  查看完整日志
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
