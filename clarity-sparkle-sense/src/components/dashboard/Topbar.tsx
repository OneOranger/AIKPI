import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Download,
  FileText,
  Filter,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

/* ─── 常量 ─── */
const PROJECTS = [
  { value: "all", label: "全部项目" },
  { value: "smart-cs", label: "智能客服" },
  { value: "doc-analysis", label: "文档分析" },
  { value: "content-gen", label: "内容生成" },
  { value: "code-assist", label: "代码助手" },
  { value: "data-analysis", label: "数据分析" },
] as const;

const TIME_RANGES = [
  { value: "today", label: "今天" },
  { value: "7d", label: "最近 7 天" },
  { value: "30d", label: "最近 30 天" },
  { value: "90d", label: "最近 90 天" },
  { value: "180d", label: "最近 180 天" },
] as const;

const EXPORT_OPTIONS = [
  { value: "pdf", label: "导出 PDF 报告", icon: FileText },
  { value: "excel", label: "导出 Excel 数据", icon: FileText },
  { value: "csv", label: "导出 CSV 原始数据", icon: FileText },
] as const;

const REPORT_TYPES = [
  { value: "monthly", label: "月度报告" },
  { value: "quarterly", label: "季度报告" },
  { value: "custom", label: "自定义报告" },
] as const;

/* ─── 组件 ─── */
export function Topbar({ crumb = "运营概览" }: { crumb?: string }) {
  // 状态
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("monthly");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([
    "all",
  ]);
  const [reportTimeRange, setReportTimeRange] = useState("7d");

  /* 辅助：根据 value 获取 label */
  const projectLabel =
    PROJECTS.find((p) => p.value === selectedProject)?.label ?? "所有项目";
  const timeRangeLabel =
    TIME_RANGES.find((t) => t.value === selectedTimeRange)?.label ??
    "最近 7 天";

  /* 多选项目勾选 */
  function toggleProject(value: string) {
    setSelectedProjects((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  /* 生成报告 */
  function handleCreateReport() {
    setReportDialogOpen(false);
    toast.success("报告生成任务已提交");
    // 重置表单
    setReportName("");
    setReportType("monthly");
    setSelectedProjects(["all"]);
    setReportTimeRange("7d");
  }

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="flex items-center justify-between gap-4 px-6 lg:px-8 py-3.5">
        {/* Breadcrumb + status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Acme</span>
            <span className="text-border-strong">/</span>
            <span>工作区</span>
            <span className="text-border-strong">/</span>
            <span className="text-foreground font-medium">{crumb}</span>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground border border-border bg-surface rounded-full px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
            实时 · 在线
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* ── 所有项目 ── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface-elevated transition-colors">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                {projectLabel}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>选择项目</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={selectedProject}
                onValueChange={(v) => {
                  setSelectedProject(v);
                  const label =
                    PROJECTS.find((p) => p.value === v)?.label ?? v;
                  toast.success(`已切换到 ${label} 项目`);
                }}
              >
                {PROJECTS.map((p) => (
                  <DropdownMenuRadioItem key={p.value} value={p.value}>
                    {p.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ── 最近 7 天 ── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface-elevated transition-colors">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {timeRangeLabel}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>时间范围</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={selectedTimeRange}
                onValueChange={(v) => {
                  setSelectedTimeRange(v);
                  const label =
                    TIME_RANGES.find((t) => t.value === v)?.label ?? v;
                  toast.success(`已切换到 ${label}`);
                }}
              >
                {TIME_RANGES.map((t) => (
                  <DropdownMenuRadioItem key={t.value} value={t.value}>
                    {t.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ── 导出 ── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface-elevated transition-colors">
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                导出
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>导出格式</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {EXPORT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() =>
                      toast.info(`正在生成 ${opt.label.slice(3)} 文件，请稍候…`)
                    }
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {opt.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ── 新建报告 ── */}
          <Button
            size="sm"
            className="inline-flex items-center gap-1.5 bg-gradient-gold text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-95 transition-opacity h-auto rounded-md"
            onClick={() => setReportDialogOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            新建报告
          </Button>
        </div>
      </div>

      {/* ── 新建报告 Dialog ── */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>新建报告</DialogTitle>
            <DialogDescription>
              填写报告信息，系统将自动为您生成报告。
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* 报告名称 */}
            <div className="grid gap-2">
              <Label htmlFor="report-name">报告名称</Label>
              <Input
                id="report-name"
                placeholder="请输入报告名称"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>

            {/* 报告类型 */}
            <div className="grid gap-2">
              <Label>报告类型</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="选择报告类型" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 包含项目（多选） */}
            <div className="grid gap-2">
              <Label>包含项目</Label>
              <div className="grid grid-cols-2 gap-2">
                {PROJECTS.map((p) => (
                  <label
                    key={p.value}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedProjects.includes(p.value)}
                      onCheckedChange={() => toggleProject(p.value)}
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>

            {/* 时间范围 */}
            <div className="grid gap-2">
              <Label>时间范围</Label>
              <Select
                value={reportTimeRange}
                onValueChange={setReportTimeRange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择时间范围" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_RANGES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReportDialogOpen(false)}
            >
              取消
            </Button>
            <Button size="sm" onClick={handleCreateReport}>
              生成报告
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
