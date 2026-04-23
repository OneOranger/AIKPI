import { useState } from "react";
import { taskMatrix, modelCompare } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Trophy, Target, TrendingUp, AlertCircle } from "lucide-react";

const modelKeys = ["gpt5", "claude45", "gemini25", "deepseek"] as const;
const modelNames: Record<string, string> = {
  gpt5: "GPT-5",
  claude45: "Claude 4.5",
  gemini25: "Gemini 2.5 Pro",
  deepseek: "DeepSeek V3.2",
};

function colorFor(value: number, min: number, max: number) {
  const t = (value - min) / (max - min || 1);
  // gold heat: low → muted, high → primary
  const opacity = 0.08 + t * 0.55;
  return `hsl(var(--primary) / ${opacity})`;
}

interface CellData {
  task: string;
  model: string;
  score: number;
}

export function TaskMatrix() {
  const [selectedCell, setSelectedCell] = useState<CellData | null>(null);

  return (
    <>
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold tracking-tight">按任务匹配最佳模型</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            点击单元格查看详情 · 金色 = 更强适配 · ★ 标记推荐模型
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-elevated/40">
                <th className="text-left font-medium text-muted-foreground px-4 py-2.5 min-w-[180px]">场景</th>
                {modelKeys.map((k) => {
                  const m = modelCompare.find((x) => x.id === k)!;
                  return (
                    <th key={k} className="text-center font-medium px-3 py-2.5">
                      {m.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {taskMatrix.map((row) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const values = modelKeys.map((k) => (row as any)[k] as number);
                const max = Math.max(...values);
                const min = Math.min(...values);
                return (
                  <tr key={row.task} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-2.5 text-muted-foreground">{row.task}</td>
                    {modelKeys.map((k) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const v = (row as any)[k] as number;
                      const isBest = v === max;
                      return (
                        <td key={k} className="px-2 py-1.5 text-center">
                          <button
                            onClick={() => setSelectedCell({ task: row.task, model: k, score: v })}
                            className={`mx-auto rounded-md px-2 py-1.5 tabular text-xs font-medium hover:scale-105 transition-transform cursor-pointer ${isBest ? "text-primary border border-primary/40" : "text-foreground border border-transparent"}`}
                            style={{ background: colorFor(v, min, max) }}
                          >
                            {isBest && <span className="mr-1">★</span>}
                            {v}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CellDetailDialog cell={selectedCell} onClose={() => setSelectedCell(null)} />
    </>
  );
}

function CellDetailDialog({ cell, onClose }: { cell: CellData | null; onClose: () => void }) {
  if (!cell) return null;

  const getTaskDescription = (task: string) => {
    const descriptions: Record<string, string> = {
      "客服支持": "处理客户咨询、投诉和常见问题解答的场景",
      "代码生成": "根据需求生成代码、代码补全和重构建议",
      "RAG / 检索": "基于检索增强生成的知识问答系统",
      "长上下文摘要": "处理长文档的摘要生成和信息提取",
      "多语言": "跨语言翻译、多语言内容生成和理解",
      "结构化抽取": "从非结构化文本中提取结构化数据",
      "创意写作": "营销文案、故事创作等创意内容生成",
    };
    return descriptions[task] || "";
  };

  const getScoreInsight = (score: number) => {
    if (score >= 95) return { level: "excellent", text: "卓越表现", color: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (score >= 90) return { level: "good", text: "优秀表现", color: "text-primary", bg: "bg-primary/10" };
    if (score >= 85) return { level: "average", text: "良好表现", color: "text-amber-400", bg: "bg-amber-500/10" };
    return { level: "poor", text: "有待提升", color: "text-rose-400", bg: "bg-rose-500/10" };
  };

  const getRecommendations = (task: string, model: string, score: number) => {
    const recs: string[] = [];
    
    if (score >= 95) {
      recs.push("该组合表现卓越，建议作为首选方案");
      recs.push("可放心用于生产环境的关键任务");
    } else if (score >= 90) {
      recs.push("该组合表现优秀，适合大多数场景");
      recs.push("建议配合适当的提示词优化");
    } else if (score >= 85) {
      recs.push("该组合表现良好，但需关注边界情况");
      recs.push("建议增加人工审核环节");
    } else {
      recs.push("该组合表现一般，建议评估其他模型选项");
      recs.push("如需使用，建议缩小应用场景范围");
    }
    
    // 特定场景建议
    if (task === "代码生成" && model === "claude45") {
      recs.push("Claude 4.5 在代码生成上具有优势，推荐用于复杂逻辑实现");
    }
    if (task === "多语言" && model === "gemini25") {
      recs.push("Gemini 2.5 Pro 的多语言支持最为全面");
    }
    if (task === "长上下文摘要" && model === "gemini25") {
      recs.push("利用 Gemini 2.5 Pro 的 2M 上下文窗口处理超长文档");
    }
    
    return recs;
  };

  const insight = getScoreInsight(cell.score);
  const recommendations = getRecommendations(cell.task, cell.model, cell.score);

  // 获取该任务下所有模型的分数进行对比
  const row = taskMatrix.find(r => r.task === cell.task);
  const allScores = row ? modelKeys.map(k => ({ model: k, score: (row as Record<string, number>)[k] })) : [];
  const rank = allScores.sort((a, b) => b.score - a.score).findIndex(s => s.model === cell.model) + 1;

  return (
    <Dialog open={!!cell} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <DialogTitle>{cell.task}</DialogTitle>
          </div>
          <DialogDescription>{getTaskDescription(cell.task)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* 模型和分数 */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface-elevated/40">
            <div>
              <div className="text-sm text-muted-foreground">评估模型</div>
              <div className="text-lg font-semibold">{modelNames[cell.model]}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">质量分数</div>
              <div className={`text-3xl font-bold tabular ${insight.color}`}>{cell.score}</div>
            </div>
          </div>

          {/* 评级标签 */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${insight.bg} ${insight.color}`}>
              {cell.score >= 90 ? <Trophy className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
              {insight.text}
            </span>
            <span className="text-xs text-muted-foreground">
              在该场景下排名第 {rank} / 4
            </span>
          </div>

          {/* 所有模型对比 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-3">该场景下所有模型表现</h4>
            <div className="space-y-2">
              {allScores.sort((a, b) => b.score - a.score).map((s, idx) => (
                <div key={s.model} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-6">#{idx + 1}</span>
                  <div className="flex-1 text-xs">{modelNames[s.model]}</div>
                  <div className="w-24 h-1.5 rounded-full bg-surface overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${s.model === cell.model ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono w-8 text-right ${s.model === cell.model ? 'text-primary font-semibold' : ''}`}>
                    {s.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 建议 */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              使用建议
            </h4>
            <ul className="space-y-2">
              {recommendations.map((rec, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
