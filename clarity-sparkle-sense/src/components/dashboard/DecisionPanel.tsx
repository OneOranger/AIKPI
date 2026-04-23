import { useState } from "react";
import { valueAssessment } from "@/lib/mockData";
import { TrendingUp, Wrench, AlertTriangle, ArrowRight, FileText, CheckCircle2, AlertCircle, Lightbulb, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const levelStyles: Record<string, { icon: any; ring: string; chip: string; label: string; color: string }> = {
  expand: {
    icon: TrendingUp,
    ring: "border-emerald-500/40 bg-emerald-500/[0.04]",
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    label: "扩展",
    color: "emerald",
  },
  optimize: {
    icon: Wrench,
    ring: "border-primary/40 bg-primary/[0.04]",
    chip: "bg-primary/15 text-primary border-primary/30",
    label: "优化",
    color: "primary",
  },
  review: {
    icon: AlertTriangle,
    ring: "border-amber-500/40 bg-amber-500/[0.04]",
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    label: "审查",
    color: "amber",
  },
};

interface DecisionItem {
  level: string;
  title: string;
  detail: string;
}

export function DecisionPanel() {
  const [selectedDecision, setSelectedDecision] = useState<DecisionItem | null>(null);

  return (
    <>
      <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 animate-fade-up">
        <header className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight">推荐决策</h2>
              <span className="text-[10px] uppercase tracking-wider text-primary border border-primary/30 rounded px-1.5 py-0.5">
                AI 生成
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              点击决策查看详细分析 · 你的团队下季度应采取的具体行动
            </p>
          </div>
        </header>

        <ul className="space-y-3">
          {valueAssessment.decisions.map((d) => {
            const style = levelStyles[d.level] || levelStyles.optimize;
            const Icon = style.icon;
            return (
              <li
                key={d.title}
                onClick={() => setSelectedDecision(d)}
                className={`flex items-start gap-3 rounded-xl border p-4 ${style.ring} hover:bg-surface-elevated/40 cursor-pointer transition-colors group`}
              >
                <div className={`p-2 rounded-lg border ${style.chip}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center text-[10px] uppercase tracking-wider font-medium border rounded px-1.5 py-0.5 ${style.chip}`}
                    >
                      {style.label}
                    </span>
                    <h3 className="text-sm font-medium text-foreground">{d.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{d.detail}</p>
                </div>
                <button className="opacity-60 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <DecisionDetailDialog decision={selectedDecision} onClose={() => setSelectedDecision(null)} />
    </>
  );
}

function DecisionDetailDialog({ decision, onClose }: { decision: DecisionItem | null; onClose: () => void }) {
  if (!decision) return null;

  const style = levelStyles[decision.level] || levelStyles.optimize;
  const Icon = style.icon;

  // 根据决策类型生成详细分析
  const getDetailedAnalysis = () => {
    if (decision.level === "expand") {
      return {
        summary: "该决策基于项目的高 ROI 表现和稳定运行数据，建议将成功经验复制到更大范围。",
        factors: [
          { label: "ROI 表现", value: "超过 300%", positive: true },
          { label: "用户满意度", value: "4.5/5", positive: true },
          { label: "系统稳定性", value: "99.9%", positive: true },
          { label: "成本效益", value: "显著", positive: true },
        ],
        risks: [
          "扩展过程中可能需要增加基础设施投入",
          "新用户培训需要额外时间和资源",
          "需要确保支持团队能够处理增加的咨询量",
        ],
        steps: [
          "制定详细的扩展计划和时间表",
          "评估目标区域/团队的需求和准备度",
          "准备必要的培训和文档资源",
          "分阶段 rollout，先试点后全面推广",
          "建立监控机制，跟踪扩展效果",
        ],
        expectedOutcome: "预计 3 个月内覆盖新增区域，月度价值提升 $30k-50k。",
      };
    }
    
    if (decision.level === "optimize") {
      return {
        summary: "通过模型切换和配置优化，可以在保持质量的同时显著降低成本。",
        factors: [
          { label: "当前成本", value: "偏高", positive: false },
          { label: "替代方案可行性", value: "高", positive: true },
          { label: "质量影响评估", value: "轻微", positive: true },
          { label: "实施难度", value: "低", positive: true },
        ],
        risks: [
          "模型切换可能需要调整提示词",
          "需要监控切换后的质量指标",
          "部分复杂场景可能需要回退到原模型",
        ],
        steps: [
          "在测试环境验证新模型表现",
          "准备 A/B 测试方案",
          "制定逐步切换计划（建议 10% → 50% → 100%）",
          "建立回退机制",
          "监控关键指标：准确率、延迟、用户反馈",
        ],
        expectedOutcome: "预计月度成本降低 25-30%，质量指标保持在 95% 以上。",
      };
    }
    
    return {
      summary: "该项目 ROI 低于预期，需要深入分析原因并制定改进或下线计划。",
      factors: [
        { label: "ROI 表现", value: "低于 100%", positive: false },
        { label: "准确率趋势", value: "下降", positive: false },
        { label: "用户采用率", value: "低", positive: false },
        { label: "问题复杂度", value: "高", positive: false },
      ],
      risks: [
        "继续投入可能导致更大损失",
        "用户体验不佳影响整体 AI 项目声誉",
        "资源占用影响其他更有价值的项目",
      ],
      steps: [
        "成立专项小组进行深度复盘",
        "分析准确率下降的根本原因",
        "评估改进可行性（技术、成本、时间）",
        "制定改进计划或有序下线方案",
        "将资源重新分配到高 ROI 项目",
      ],
      expectedOutcome: "4 周内完成评估并确定最终方案，避免进一步资源浪费。",
    };
  };

  const analysis = getDetailedAnalysis();

  return (
    <Dialog open={!!decision} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${style.chip}`}>
              <Icon className="h-3.5 w-3.5" />
              {style.label}
            </span>
          </div>
          <DialogTitle className="text-xl mt-2">{decision.title}</DialogTitle>
          <DialogDescription>{decision.detail}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* 分析摘要 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              分析摘要
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{analysis.summary}</p>
          </div>

          {/* 关键因素 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              关键因素
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {analysis.factors.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-surface">
                  <span className="text-xs text-muted-foreground">{f.label}</span>
                  <span className={`text-xs font-medium ${f.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 风险提示 */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-amber-400">
              <AlertCircle className="h-4 w-4" />
              风险提示
            </h4>
            <ul className="space-y-2">
              {analysis.risks.map((risk, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>

          {/* 执行步骤 */}
          <div className="rounded-lg border border-border bg-surface-elevated/40 p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              建议执行步骤
            </h4>
            <div className="space-y-2">
              {analysis.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-medium shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 预期成果 */}
          <div className={`rounded-lg border p-4 ${style.ring}`}>
            <h4 className="text-sm font-medium mb-2">预期成果</h4>
            <p className="text-xs text-muted-foreground">{analysis.expectedOutcome}</p>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 rounded-md border border-border bg-surface-elevated px-4 py-2 text-xs font-medium hover:bg-surface transition-colors"
            >
              关闭
            </button>
            <button 
              className="flex-1 rounded-md bg-gradient-gold text-primary-foreground px-4 py-2 text-xs font-medium hover:opacity-95 transition-opacity"
            >
              创建任务
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
