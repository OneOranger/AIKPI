import { useState } from "react";
import { feedbackStats } from "@/lib/mockData";
import { ThumbsUp, ThumbsDown, Star, MessageSquare, User, Clock, Flag, Quote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 反馈详情数据
const feedbackDetails = {
  recentFeedback: [
    { id: "FB-001", user: "user_4821", rating: 5, type: "thumbsUp", comment: "回答非常准确，解决了我的问题！", project: "客服助手", time: "2分钟前" },
    { id: "FB-002", user: "user_3156", rating: 4, type: "thumbsUp", comment: "整体不错，但希望能提供更多示例。", project: "代码审查", time: "5分钟前" },
    { id: "FB-003", user: "user_7291", rating: 2, type: "thumbsDown", comment: "没有理解我的问题，答非所问。", project: "RAG 检索", time: "8分钟前" },
    { id: "FB-004", user: "user_1847", rating: 5, type: "thumbsUp", comment: "生成速度很快，内容质量高。", project: "营销引擎", time: "12分钟前" },
    { id: "FB-005", user: "user_5623", rating: 3, type: "neutral", comment: "还可以，但有些地方不够详细。", project: "客服助手", time: "15分钟前" },
  ],
  topIssues: [
    { issue: "回答不够详细", count: 142, trend: -12 },
    { issue: "理解偏差", count: 98, trend: -8 },
    { issue: "生成速度慢", count: 76, trend: -5 },
    { issue: "格式不规范", count: 54, trend: +3 },
  ],
  topPraises: [
    { praise: "回答准确", count: 1248, trend: +18 },
    { praise: "响应快速", count: 892, trend: +12 },
    { praise: "解释清晰", count: 756, trend: +15 },
    { praise: "专业度高", count: 634, trend: +9 },
  ],
};

export function UserFeedbackPanel() {
  const [showDetails, setShowDetails] = useState(false);
  const totalThumbs = feedbackStats.thumbsUp + feedbackStats.thumbsDown;
  const upPct = (feedbackStats.thumbsUp / totalThumbs) * 100;
  const maxRating = Math.max(...feedbackStats.distribution.map((d) => d.count));

  return (
    <>
      <section 
        onClick={() => setShowDetails(true)}
        className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 animate-fade-up cursor-pointer hover:bg-card/80 transition-colors"
      >
        <header className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">用户反馈</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              主观质量 · {feedbackStats.ratingsTotal.toLocaleString()} 评分 · 30天
            </p>
          </div>
          <div className="text-right leading-tight">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">NPS</div>
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-xl font-semibold tabular text-gradient-gold">{feedbackStats.nps}</span>
              <span className="text-[11px] font-semibold text-emerald-400">+{feedbackStats.npsDelta}</span>
            </div>
          </div>
        </header>

        {/* Thumbs up vs down */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-lg border border-border bg-background/40 p-3">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" />
                <span>赞</span>
              </div>
              <span className="tabular">{upPct.toFixed(1)}%</span>
            </div>
            <div className="text-xl font-semibold tabular mt-1">{feedbackStats.thumbsUp.toLocaleString()}</div>
          </div>
          <div className="rounded-lg border border-border bg-background/40 p-3">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ThumbsDown className="h-3.5 w-3.5 text-rose-400" />
                <span>踩</span>
              </div>
              <span className="tabular">{(100 - upPct).toFixed(1)}%</span>
            </div>
            <div className="text-xl font-semibold tabular mt-1">{feedbackStats.thumbsDown.toLocaleString()}</div>
          </div>
        </div>

        {/* Star rating distribution */}
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-4 w-4 text-primary fill-primary" />
          <span className="text-sm font-semibold tabular">{feedbackStats.ratingsAvg.toFixed(1)}</span>
          <span className="text-[11px] text-muted-foreground">平均 · {feedbackStats.ratingsTotal.toLocaleString()} 评分</span>
        </div>
        <ul className="space-y-1.5">
          {feedbackStats.distribution.map((d) => (
            <li key={d.stars} className="grid grid-cols-[28px_1fr_44px] items-center gap-2 text-xs">
              <span className="font-mono text-muted-foreground">{d.stars}★</span>
              <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                  style={{ width: `${(d.count / maxRating) * 100}%` }}
                />
              </div>
              <span className="font-mono text-muted-foreground text-right tabular">{d.count.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 反馈详情弹窗 */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              用户反馈详情
            </DialogTitle>
            <DialogDescription>
              最近 30 天的用户反馈统计与分析
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* 概览统计 */}
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-border bg-muted/30 text-center">
                <div className="text-2xl font-bold text-emerald-500">{feedbackStats.thumbsUp.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground mt-1">点赞</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/30 text-center">
                <div className="text-2xl font-bold text-rose-500">{feedbackStats.thumbsDown.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground mt-1">点踩</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/30 text-center">
                <div className="text-2xl font-bold tabular">{feedbackStats.ratingsTotal.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground mt-1">评分数</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/30 text-center">
                <div className="text-2xl font-bold text-gradient-gold">{feedbackStats.nps}</div>
                <div className="text-[10px] text-muted-foreground mt-1">NPS</div>
              </div>
            </div>

            {/* 好评亮点 */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-emerald-500" />
                好评亮点
              </h4>
              <div className="space-y-2">
                {feedbackDetails.topPraises.map((praise) => (
                  <div key={praise.praise} className="flex items-center justify-between p-2 rounded-lg border border-border">
                    <span className="text-sm">{praise.praise}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono tabular text-muted-foreground">{praise.count}</span>
                      <span className="text-xs text-emerald-500">+{praise.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 待改进问题 */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Flag className="h-4 w-4 text-rose-500" />
                待改进问题
              </h4>
              <div className="space-y-2">
                {feedbackDetails.topIssues.map((issue) => (
                  <div key={issue.issue} className="flex items-center justify-between p-2 rounded-lg border border-border">
                    <span className="text-sm">{issue.issue}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono tabular text-muted-foreground">{issue.count}</span>
                      <span className={`text-xs ${issue.trend > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                        {issue.trend > 0 ? "+" : ""}{issue.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 最新反馈 */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Quote className="h-4 w-4 text-muted-foreground" />
                最新反馈
              </h4>
              <div className="space-y-3">
                {feedbackDetails.recentFeedback.map((fb) => (
                  <div key={fb.id} className="p-3 rounded-lg border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{fb.user}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted">{fb.project}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < fb.rating ? "text-primary fill-primary" : "text-muted-foreground"}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {fb.time}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{fb.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowDetails(false)}>
                关闭
              </Button>
              <Button className="flex-1">
                查看全部反馈
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
