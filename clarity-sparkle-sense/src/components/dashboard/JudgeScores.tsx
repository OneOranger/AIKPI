import { useState } from "react";
import { judgeScores } from "@/lib/mockData";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Scale, Info, CheckCircle2, AlertTriangle, FileText, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// 评分维度详情
const scoreDetails: Record<string, {
  description: string;
  criteria: string[];
  examples: { good: string; bad: string };
  weight: number;
}> = {
  "相关性": {
    description: "回答内容与用户问题的相关程度",
    criteria: [
      "直接回答用户问题",
      "不偏离主题",
      "提供相关信息",
      "避免冗余内容",
    ],
    examples: {
      good: "用户问：如何学习 Python？\n回答：Python 学习可以从基础语法开始...",
      bad: "用户问：如何学习 Python？\n回答：编程语言有很多种，Java 也是一种流行的语言...",
    },
    weight: 20,
  },
  "连贯性": {
    description: "回答的逻辑结构和流畅程度",
    criteria: [
      "逻辑清晰",
      "段落衔接自然",
      "论证完整",
      "结构合理",
    ],
    examples: {
      good: "首先...其次...最后...总结",
      bad: "跳跃式回答，前后矛盾",
    },
    weight: 15,
  },
  "流畅性": {
    description: "语言表达的自然和通顺程度",
    criteria: [
      "语法正确",
      "用词准确",
      "句式多样",
      "阅读顺畅",
    ],
    examples: {
      good: "表达自然，符合语言习惯",
      bad: "语句生硬，存在语法错误",
    },
    weight: 15,
  },
  "忠实度": {
    description: "回答与事实的一致性",
    criteria: [
      "信息准确",
      "无虚假信息",
      "引用可靠",
      "数据正确",
    ],
    examples: {
      good: "北京是中国的首都（正确）",
      bad: "上海是中国的首都（错误）",
    },
    weight: 25,
  },
  "有用性": {
    description: "回答对用户的实际帮助程度",
    criteria: [
      "解决用户问题",
      "提供可行方案",
      "包含实用信息",
      "易于理解和执行",
    ],
    examples: {
      good: "提供具体步骤和示例代码",
      bad: "仅给出概念性描述，无具体指导",
    },
    weight: 15,
  },
  "安全性": {
    description: "回答的安全性和合规性",
    criteria: [
      "无有害内容",
      "符合政策要求",
      "保护隐私",
      "避免偏见",
    ],
    examples: {
      good: "拒绝回答有害请求并提供替代方案",
      bad: "提供危险或违规信息",
    },
    weight: 10,
  },
};

export function JudgeScores() {
  const [selectedMetric, setSelectedMetric] = useState<typeof judgeScores[number] | null>(null);
  const data = judgeScores.map((s) => ({ metric: s.metric, score: s.score, prev: s.prev }));

  return (
    <>
      <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 animate-fade-up">
        <header className="flex items-end justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight">LLM 评判 · 子项分数</h2>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5">
                0-5
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              六个维度的自动质量评分。
            </p>
          </div>
        </header>

        <div className="h-[240px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="78%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <PolarRadiusAxis domain={[3.5, 5]} tick={false} axisLine={false} />
              <Radar
                name="上期"
                dataKey="prev"
                stroke="hsl(var(--muted-foreground))"
                fill="hsl(var(--muted-foreground))"
                fillOpacity={0.08}
                strokeDasharray="3 3"
              />
              <Radar
                name="当前"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-muted-foreground mt-2">
          {judgeScores.map((s) => {
            const delta = s.score - s.prev;
            return (
              <div 
                key={s.metric} 
                onClick={() => setSelectedMetric(s)}
                className="flex items-center justify-between cursor-pointer hover:bg-muted/30 p-1.5 -mx-1.5 rounded transition-colors"
              >
                <span>{s.metric}</span>
                <span className="font-mono">
                  <span className="text-foreground">{s.score.toFixed(1)}</span>
                  <span className={`ml-1.5 ${delta > 0 ? "text-emerald-400" : delta < 0 ? "text-rose-400" : ""}`}>
                    {delta > 0 ? "+" : ""}
                    {delta.toFixed(1)}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 评分维度详情弹窗 */}
      <Dialog open={!!selectedMetric} onOpenChange={() => setSelectedMetric(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              {selectedMetric?.metric} 评分详情
            </DialogTitle>
            <DialogDescription>
              {selectedMetric && scoreDetails[selectedMetric.metric]?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMetric && (
            <div className="space-y-5 mt-4">
              {/* 分数概览 */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`h-14 w-14 rounded-full flex items-center justify-center ${
                    selectedMetric.score >= 4.5 ? "bg-success/10" : 
                    selectedMetric.score >= 4.0 ? "bg-primary/10" : "bg-warning/10"
                  }`}>
                    <span className={`text-xl font-bold ${
                      selectedMetric.score >= 4.5 ? "text-success" : 
                      selectedMetric.score >= 4.0 ? "text-primary" : "text-warning"
                    }`}>
                      {selectedMetric.score.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">当前得分</div>
                    <div className="text-xs text-muted-foreground">满分 5.0</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">上期得分</div>
                  <div className="text-lg font-semibold tabular">{selectedMetric.prev.toFixed(1)}</div>
                  <div className={`text-xs ${selectedMetric.score - selectedMetric.prev > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {selectedMetric.score - selectedMetric.prev > 0 ? "+" : ""}
                    {(selectedMetric.score - selectedMetric.prev).toFixed(1)}
                  </div>
                </div>
              </div>

              {/* 权重 */}
              <div className="p-3 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">评分权重</span>
                  <span className="text-lg font-semibold">{scoreDetails[selectedMetric.metric]?.weight}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${scoreDetails[selectedMetric.metric]?.weight}%` }}
                  />
                </div>
              </div>

              {/* 评分标准 */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">评分标准</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pt-2 space-y-2">
                    {scoreDetails[selectedMetric.metric]?.criteria.map((criterion, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                        <span className="text-xs text-muted-foreground mt-0.5">{idx + 1}.</span>
                        <span className="text-sm">{criterion}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* 评分示例 */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">评分示例</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pt-2 space-y-3">
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                      <div className="text-xs text-emerald-600 font-medium mb-1">优秀示例</div>
                      <p className="text-sm text-emerald-900 whitespace-pre-line">
                        {scoreDetails[selectedMetric.metric]?.examples.good}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                      <div className="text-xs text-rose-600 font-medium mb-1">待改进示例</div>
                      <p className="text-sm text-rose-900 whitespace-pre-line">
                        {scoreDetails[selectedMetric.metric]?.examples.bad}
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* 说明 */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  该评分由 Claude 4.5 模型自动评判，基于 48,210 个样本评估得出。
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedMetric(null)}>
                  关闭
                </Button>
                <Button className="flex-1">
                  查看详细报告
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
