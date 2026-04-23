import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Bell, CheckCircle2, Info, Sparkles, ArrowRight, AlertCircle, Clock, FolderOpen } from "lucide-react";
import { alerts } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const iconMap = {
  critical: { icon: AlertTriangle, color: "text-destructive bg-destructive/10 border-destructive/20", label: "严重" },
  warning: { icon: Bell, color: "text-warning bg-warning/10 border-warning/20", label: "警告" },
  info: { icon: Info, color: "text-info bg-info/10 border-info/20", label: "信息" },
} as const;

// 告警详情扩展数据
const alertDetails: Record<number, {
  description: string;
  impact: string;
  suggestion: string;
  affectedMetrics: string[];
}> = {
  0: {
    description: "HR 机器人在过去 2 小时内准确率从 92% 下降至 78%，主要发生在请假审批流程中。",
    impact: "可能导致员工请假审批错误，影响员工体验",
    suggestion: "建议立即检查最近的 Prompt 变更，并考虑回滚到上一个稳定版本",
    affectedMetrics: ["准确率", "用户满意度", "任务完成率"],
  },
  1: {
    description: "RAG 检索系统的召回率在过去 24 小时内持续下降，从 89.6% 降至 83.2%。",
    impact: "用户可能无法找到相关文档，降低知识库使用效率",
    suggestion: "检查向量数据库索引状态，考虑重新构建索引",
    affectedMetrics: ["召回率", "用户满意度", "平均会话时长"],
  },
  2: {
    description: "系统自动将营销引擎 8% 的流量切换至 DeepSeek V3.2，在保持质量的同时降低成本。",
    impact: "正面影响：预计每月节省 $182",
    suggestion: "可以继续扩大 DeepSeek 的流量占比至 15%",
    affectedMetrics: ["成本", "延迟", "准确率"],
  },
};

export function AlertsPanel() {
  const navigate = useNavigate();
  const [selectedAlert, setSelectedAlert] = useState<{ alert: typeof alerts[number]; index: number } | null>(null);

  const handleViewAll = () => {
    navigate("/alerts");
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-tight">告警与洞察</h3>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">最近 24 小时</span>
      </div>

      <div className="space-y-2">
        {alerts.map((a, i) => {
          const meta = iconMap[a.level as keyof typeof iconMap];
          const Icon = meta.icon;
          return (
            <div
              key={i}
              onClick={() => setSelectedAlert({ alert: a, index: i })}
              className="flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3 hover:bg-surface-elevated/50 cursor-pointer transition-colors"
            >
              <div className={`h-7 w-7 rounded-md border flex items-center justify-center shrink-0 ${meta.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium leading-snug">{a.title}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <span>{a.project}</span>
                  <span className="text-border-strong">·</span>
                  <span>{a.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 查看全部按钮 */}
      <button 
        onClick={handleViewAll}
        className="w-full mt-3 py-2 text-[11px] text-primary hover:text-primary-glow hover:bg-primary/5 rounded-lg border border-border hover:border-primary/30 transition-all flex items-center justify-center gap-1"
      >
        查看全部告警
        <ArrowRight className="h-3 w-3" />
      </button>

      {/* AI suggestion */}
      <div className="mt-4 rounded-lg border border-primary/25 bg-gradient-to-br from-primary/[0.06] to-transparent p-3.5">
        <div className="flex items-start gap-2.5">
          <div className="h-6 w-6 rounded-md bg-gradient-gold flex items-center justify-center shrink-0">
            <Sparkles className="h-3 w-3 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider text-primary font-medium mb-0.5">
              优化建议
            </div>
            <p className="text-xs leading-relaxed">
              将 <span className="font-medium">Marketing Engine</span> 切换至 Claude 4.5 Sonnet 可节省{" "}
              <span className="text-primary font-semibold tabular">~$1,284 / 月</span>，且不会带来可测量的
              质量损失。
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <button className="text-[10px] font-medium rounded border border-primary/30 bg-primary/10 text-primary px-2 py-1 hover:bg-primary/15">
                运行模拟
              </button>
              <button className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> 忽略
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 告警详情弹窗 */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAlert && (
                <>
                  {(() => {
                    const meta = iconMap[selectedAlert.alert.level as keyof typeof iconMap];
                    const Icon = meta.icon;
                    return (
                      <div className={`h-8 w-8 rounded-md border flex items-center justify-center ${meta.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    );
                  })()}
                  <span className="text-base">{selectedAlert.alert.title}</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedAlert && iconMap[selectedAlert.alert.level as keyof typeof iconMap].label} 级别告警
            </DialogDescription>
          </DialogHeader>
          
          {selectedAlert && (
            <div className="space-y-4">
              {/* 基本信息 */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <FolderOpen className="h-4 w-4" />
                  {selectedAlert.alert.project}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {selectedAlert.alert.time}
                </div>
              </div>

              {/* 详细描述 */}
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  问题描述
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {alertDetails[selectedAlert.index]?.description}
                </p>
              </div>

              {/* 影响范围 */}
              <div>
                <h4 className="text-sm font-medium mb-2">影响范围</h4>
                <p className="text-sm text-muted-foreground">{alertDetails[selectedAlert.index]?.impact}</p>
              </div>

              {/* 受影响指标 */}
              <div>
                <h4 className="text-sm font-medium mb-2">受影响指标</h4>
                <div className="flex flex-wrap gap-2">
                  {alertDetails[selectedAlert.index]?.affectedMetrics.map((metric) => (
                    <span key={metric} className="px-2 py-1 rounded-md text-xs bg-destructive/10 text-destructive border border-destructive/20">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>

              {/* 建议 */}
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                <h4 className="text-sm font-medium mb-1 text-primary">处理建议</h4>
                <p className="text-sm text-muted-foreground">{alertDetails[selectedAlert.index]?.suggestion}</p>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedAlert(null)}
                >
                  忽略
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleViewAll}
                >
                  查看全部告警
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
