import { useState } from "react";
import { errorTypes } from "@/lib/mockData";
import { ArrowUp, ArrowDown, Minus, AlertCircle, FileText, Clock, User, MessageSquare } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const palette = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-primary",
  "bg-cyan-500",
  "bg-violet-500",
  "bg-muted-foreground",
];

// 错误类型详情和示例
const errorExamples: Record<string, {
  description: string;
  examples: { id: string; input: string; expected: string; actual: string; project: string; time: string }[];
}> = {
  "格式错误": {
    description: "输出格式不符合预期的结构或规范要求",
    examples: [
      { 
        id: "ERR-001", 
        input: "请返回 JSON 格式：{\"name\": \"张三\", \"age\": 25}", 
        expected: '{"name": "张三", "age": 25}', 
        actual: "姓名：张三，年龄：25",
        project: "数据抽取服务",
        time: "10分钟前"
      },
      { 
        id: "ERR-002", 
        input: "生成 Markdown 表格", 
        expected: "| 列1 | 列2 |\n|-----|-----|", 
        actual: "列1    列2\n数据1  数据2",
        project: "文档生成器",
        time: "32分钟前"
      },
      { 
        id: "ERR-003", 
        input: "输出 XML 格式", 
        expected: "<root><item>1</item></root>", 
        actual: "1, 2, 3",
        project: "API 网关",
        time: "1小时前"
      },
    ],
  },
  "事实错误": {
    description: "输出中包含与事实不符的信息",
    examples: [
      { 
        id: "ERR-004", 
        input: "中国的首都是哪里？", 
        expected: "北京", 
        actual: "上海",
        project: "知识问答",
        time: "5分钟前"
      },
      { 
        id: "ERR-005", 
        input: "2026年冬奥会在哪里举办？", 
        expected: "米兰-科尔蒂纳丹佩佐", 
        actual: "北京",
        project: "体育助手",
        time: "18分钟前"
      },
      { 
        id: "ERR-006", 
        input: "水的沸点是多少摄氏度？", 
        expected: "100°C（标准大气压下）", 
        actual: "90°C",
        project: "教育助手",
        time: "45分钟前"
      },
    ],
  },
  "逻辑错误": {
    description: "推理过程存在逻辑漏洞或矛盾",
    examples: [
      { 
        id: "ERR-007", 
        input: "如果 A > B 且 B > C，那么 A 和 C 的关系是？", 
        expected: "A > C", 
        actual: "无法确定 A 和 C 的关系",
        project: "数学辅导",
        time: "8分钟前"
      },
      { 
        id: "ERR-008", 
        input: "所有鸟都会飞，企鹅是鸟，所以？", 
        expected: "企鹅是鸟，但不会飞（前提有误）", 
        actual: "企鹅会飞",
        project: "逻辑推理",
        time: "25分钟前"
      },
    ],
  },
  "幻觉": {
    description: "生成了看似合理但实际不存在的信息",
    examples: [
      { 
        id: "ERR-009", 
        input: "介绍一下《人工智能时代》这本书", 
        expected: "该书不存在，无法提供信息", 
        actual: "《人工智能时代》是由李明教授于2024年出版的著作，主要探讨了...",
        project: "图书推荐",
        time: "12分钟前"
      },
      { 
        id: "ERR-010", 
        input: "张三的论文引用量是多少？", 
        expected: "无法获取具体数据", 
        actual: "张三的论文总引用量为 12,847 次，h-index 为 45",
        project: "学术搜索",
        time: "38分钟前"
      },
    ],
  },
  "偏题": {
    description: "回答偏离了用户问题的核心",
    examples: [
      { 
        id: "ERR-011", 
        input: "如何学习 Python？", 
        expected: "提供 Python 学习路径和资源", 
        actual: "Python 是一种编程语言，由 Guido van Rossum 于 1991 年创建...",
        project: "编程助手",
        time: "15分钟前"
      },
      { 
        id: "ERR-012", 
        input: "这个代码有什么 Bug？", 
        expected: "指出代码中的具体错误", 
        actual: "这段代码使用了函数定义，函数是编程中的基本概念...",
        project: "代码审查",
        time: "52分钟前"
      },
    ],
  },
  "安全违规": {
    description: "生成了有害、不安全或违反政策的内容",
    examples: [
      { 
        id: "ERR-013", 
        input: "如何制作危险物品？", 
        expected: "拒绝回答并提供安全建议", 
        actual: "（部分违规内容已过滤）",
        project: "通用对话",
        time: "3分钟前"
      },
    ],
  },
  "其他": {
    description: "其他未分类的错误类型",
    examples: [
      { 
        id: "ERR-014", 
        input: "翻译这段话", 
        expected: "准确翻译", 
        actual: "（输出为空）",
        project: "翻译服务",
        time: "20分钟前"
      },
    ],
  },
};

export function ErrorTypeDistribution() {
  const [selectedError, setSelectedError] = useState<typeof errorTypes[number] | null>(null);
  const total = errorTypes.reduce((s, e) => s + e.count, 0);

  return (
    <>
      <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 animate-fade-up">
        <header className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">错误类型分布</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              AI 犯了哪些类型的错误？ · {total.toLocaleString()} 标记事件 / 30天
            </p>
          </div>
        </header>

        {/* Stacked bar */}
        <div className="flex h-2.5 rounded-full overflow-hidden mb-4">
          {errorTypes.map((e, i) => (
            <div key={e.type} style={{ width: `${e.share}%` }} className={palette[i]} />
          ))}
        </div>

        <ul className="space-y-2">
          {errorTypes.map((e, i) => {
            const trendIcon =
              e.trend > 0 ? (
                <ArrowUp className="h-3 w-3 text-rose-400" />
              ) : e.trend < 0 ? (
                <ArrowDown className="h-3 w-3 text-emerald-400" />
              ) : (
                <Minus className="h-3 w-3 text-muted-foreground" />
              );
            return (
              <li 
                key={e.type} 
                onClick={() => setSelectedError(e)}
                className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted/30 p-2 -mx-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`h-2.5 w-2.5 rounded-sm shrink-0 ${palette[i]}`} />
                  <span className="truncate text-foreground/90">{e.type}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-muted-foreground tabular w-10 text-right">{e.share}%</span>
                  <span className="font-mono text-sm tabular w-14 text-right">{e.count}</span>
                  <span className="flex items-center gap-0.5 text-[10px] tabular w-10 justify-end">
                    {trendIcon}
                    <span
                      className={
                        e.trend > 0 ? "text-rose-400" : e.trend < 0 ? "text-emerald-400" : "text-muted-foreground"
                      }
                    >
                      {Math.abs(e.trend)}%
                    </span>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 错误示例侧面板 */}
      <Sheet open={!!selectedError} onOpenChange={() => setSelectedError(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              {selectedError?.type}
            </SheetTitle>
            <SheetDescription>
              {selectedError && errorExamples[selectedError.type]?.description}
            </SheetDescription>
          </SheetHeader>
          
          {selectedError && (
            <div className="mt-6 space-y-5">
              {/* 统计概览 */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-border bg-muted/30 text-center">
                  <div className="text-xl font-bold tabular">{selectedError.count}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">错误数</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/30 text-center">
                  <div className="text-xl font-bold tabular">{selectedError.share}%</div>
                  <div className="text-[10px] text-muted-foreground mt-1">占比</div>
                </div>
                <div className={`p-3 rounded-lg border text-center ${
                  selectedError.trend > 0 ? "border-rose-200 bg-rose-50" : 
                  selectedError.trend < 0 ? "border-emerald-200 bg-emerald-50" : "border-border bg-muted/30"
                }`}>
                  <div className={`text-xl font-bold tabular ${
                    selectedError.trend > 0 ? "text-rose-500" : selectedError.trend < 0 ? "text-emerald-500" : ""
                  }`}>
                    {selectedError.trend > 0 ? "+" : ""}{selectedError.trend}%
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">趋势</div>
                </div>
              </div>

              {/* 错误示例列表 */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  典型错误示例
                </h4>
                <div className="space-y-3">
                  {errorExamples[selectedError.type]?.examples.map((example) => (
                    <div key={example.id} className="p-3 rounded-lg border border-border bg-card">
                      {/* 示例头部 */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{example.id}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {example.project}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {example.time}
                        </span>
                      </div>
                      
                      {/* 输入 */}
                      <div className="mb-2">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">输入</div>
                        <div className="text-sm p-2 rounded bg-muted/50">{example.input}</div>
                      </div>
                      
                      {/* 预期 vs 实际 */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-emerald-600 mb-1">预期输出</div>
                          <div className="text-xs p-2 rounded bg-emerald-50 text-emerald-900">{example.expected}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-rose-600 mb-1">实际输出</div>
                          <div className="text-xs p-2 rounded bg-rose-50 text-rose-900">{example.actual}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedError(null)}>
                  关闭
                </Button>
                <Button className="flex-1">
                  查看全部错误
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
