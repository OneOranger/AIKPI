import { useState } from "react";
import { accuracyByTask } from "@/lib/mockData";
import { ArrowUp, ArrowDown, Minus, Target, BarChart3, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const trendIcon = {
  up: <ArrowUp className="h-3 w-3 text-emerald-400" />,
  down: <ArrowDown className="h-3 w-3 text-rose-400" />,
  flat: <Minus className="h-3 w-3 text-muted-foreground" />,
};

// 任务详情扩展数据
const taskDetails: Record<string, {
  description: string;
  successCount: number;
  failCount: number;
  topErrors: { type: string; count: number }[];
  avgLatency: number;
  models: { name: string; accuracy: number }[];
}> = {
  "分类": {
    description: "将用户输入分类到预定义的意图类别中",
    successCount: 9446,
    failCount: 374,
    topErrors: [
      { type: "意图模糊", count: 142 },
      { type: "多意图混淆", count: 98 },
      { type: "边界情况", count: 76 },
      { type: "未知意图", count: 58 },
    ],
    avgLatency: 120,
    models: [
      { name: "GPT-5", accuracy: 97.2 },
      { name: "Claude 4.5", accuracy: 96.8 },
      { name: "Gemini 2.5", accuracy: 95.4 },
    ],
  },
  "生成": {
    description: "根据提示生成文本内容，包括文案、邮件、报告等",
    successCount: 11406,
    failCount: 1074,
    topErrors: [
      { type: "内容不符合要求", count: 312 },
      { type: "格式错误", count: 268 },
      { type: "风格不一致", count: 198 },
      { type: "信息不完整", count: 156 },
    ],
    avgLatency: 680,
    models: [
      { name: "GPT-5", accuracy: 93.4 },
      { name: "Claude 4.5", accuracy: 92.8 },
      { name: "Gemini 2.5", accuracy: 90.2 },
    ],
  },
  "抽取": {
    description: "从非结构化文本中提取结构化信息",
    successCount: 7695,
    failCount: 425,
    topErrors: [
      { type: "字段缺失", count: 142 },
      { type: "格式错误", count: 118 },
      { type: "值不准确", count: 98 },
      { type: "实体识别错误", count: 67 },
    ],
    avgLatency: 240,
    models: [
      { name: "GPT-5", accuracy: 96.2 },
      { name: "Claude 4.5", accuracy: 95.8 },
      { name: "Gemini 2.5", accuracy: 94.2 },
    ],
  },
  "摘要": {
    description: "将长文本压缩为简洁的摘要",
    successCount: 5594,
    failCount: 646,
    topErrors: [
      { type: "遗漏关键信息", count: 218 },
      { type: "摘要过长", count: 168 },
      { type: "理解偏差", count: 142 },
      { type: "语言不一致", count: 78 },
    ],
    avgLatency: 520,
    models: [
      { name: "Claude 4.5", accuracy: 91.8 },
      { name: "GPT-5", accuracy: 90.4 },
      { name: "Gemini 2.5", accuracy: 89.6 },
    ],
  },
  "翻译": {
    description: "将文本从一种语言翻译为另一种语言",
    successCount: 3849,
    failCount: 331,
    topErrors: [
      { type: "语义偏差", count: 98 },
      { type: "专业术语错误", count: 82 },
      { type: "文化适配问题", count: 68 },
      { type: "语法错误", count: 52 },
    ],
    avgLatency: 380,
    models: [
      { name: "Gemini 2.5", accuracy: 94.2 },
      { name: "GPT-5", accuracy: 92.8 },
      { name: "Claude 4.5", accuracy: 91.6 },
    ],
  },
  "代码生成": {
    description: "根据需求生成代码片段或完整程序",
    successCount: 6684,
    failCount: 686,
    topErrors: [
      { type: "语法错误", count: 218 },
      { type: "逻辑错误", count: 198 },
      { type: "安全漏洞", count: 128 },
      { type: "不符合规范", count: 98 },
    ],
    avgLatency: 720,
    models: [
      { name: "Claude 4.5", accuracy: 92.4 },
      { name: "GPT-5", accuracy: 91.2 },
      { name: "Gemini 2.5", accuracy: 89.8 },
    ],
  },
};

export function AccuracyByTask() {
  const [selectedTask, setSelectedTask] = useState<typeof accuracyByTask[number] | null>(null);
  const max = Math.max(...accuracyByTask.map((t) => t.accuracy));

  return (
    <>
      <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 animate-fade-up">
        <header className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">准确率 · 按任务类型</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              按任务分类 · 找出哪些工作流仍需 Prompt 调优。
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">7 天趋势</span>
        </header>

        <ul className="space-y-3">
          {accuracyByTask.map((t) => (
            <li 
              key={t.task} 
              onClick={() => setSelectedTask(t)}
              className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 items-center cursor-pointer hover:bg-muted/30 p-2 -mx-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm text-foreground/90 truncate">{t.task}</span>
                {trendIcon[t.trend as keyof typeof trendIcon]}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-muted-foreground tabular">{t.samples.toLocaleString()}</span>
                <span
                  className={`text-sm font-semibold tabular w-14 text-right ${
                    t.accuracy >= 95 ? "text-primary" : "text-foreground/90"
                  }`}
                >
                  {t.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="col-span-2 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    t.accuracy >= 95
                      ? "bg-gradient-to-r from-primary to-primary/60"
                      : "bg-foreground/40"
                  }`}
                  style={{ width: `${(t.accuracy / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 任务详情弹窗 */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {selectedTask?.task} 任务分析
            </DialogTitle>
            <DialogDescription>
              {selectedTask && taskDetails[selectedTask.task]?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-5">
              {/* 准确率概览 */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    selectedTask.accuracy >= 95 ? "bg-success/10" : selectedTask.accuracy >= 90 ? "bg-warning/10" : "bg-destructive/10"
                  }`}>
                    <BarChart3 className={`h-6 w-6 ${
                      selectedTask.accuracy >= 95 ? "text-success" : selectedTask.accuracy >= 90 ? "text-warning" : "text-destructive"
                    }`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold tabular">{selectedTask.accuracy.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">准确率</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{selectedTask.samples.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">评估样本</div>
                </div>
              </div>

              {/* 成功/失败统计 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    成功数
                  </div>
                  <div className="text-xl font-semibold tabular text-success">
                    {taskDetails[selectedTask.task]?.successCount.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    失败数
                  </div>
                  <div className="text-xl font-semibold tabular text-destructive">
                    {taskDetails[selectedTask.task]?.failCount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* 主要错误类型 */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  主要错误类型
                </h4>
                <div className="space-y-2">
                  {taskDetails[selectedTask.task]?.topErrors.map((error, idx) => (
                    <div key={error.type} className="flex items-center justify-between p-2 rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-5">{idx + 1}.</span>
                        <span className="text-sm">{error.type}</span>
                      </div>
                      <span className="text-sm font-mono tabular text-muted-foreground">{error.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 模型表现对比 */}
              <div>
                <h4 className="text-sm font-medium mb-3">模型表现对比</h4>
                <div className="space-y-2">
                  {taskDetails[selectedTask.task]?.models.map((model) => (
                    <div key={model.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <span className="text-sm">{model.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${model.accuracy}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono tabular w-12 text-right">{model.accuracy.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 平均延迟 */}
              <div className="p-3 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">平均响应延迟</span>
                  <span className="text-lg font-semibold tabular">{taskDetails[selectedTask.task]?.avgLatency}ms</span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedTask(null)}>
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
