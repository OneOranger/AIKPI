import { Activity, BarChart3, Bell, Boxes, ChevronsUpDown, Cog, FlaskConical, Gauge, LayoutDashboard, LifeBuoy, LineChart, Search, Sparkles, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const navMain = [
  { icon: LayoutDashboard, label: "运营概览", href: "/" },
  { icon: Activity, label: "实时调用", href: "/live-calls" },
  { icon: LineChart, label: "趋势分析", href: "/trends" },
  { icon: Gauge, label: "质量评估", href: "/quality" },
  { icon: Wallet, label: "价值评估", href: "/value" },
  { icon: BarChart3, label: "模型对比", href: "/models" },
  { icon: Boxes, label: "项目管理", href: "/projects" },
  { icon: FlaskConical, label: "实验管理", href: "/experiments" },
];

const navSecondary = [
  { icon: Bell, label: "告警管理", badge: "6", href: "/alerts" },
  { icon: Cog, label: "系统设置", href: "/settings" },
  { icon: LifeBuoy, label: "文档中心", href: "/docs" },
];

export function Sidebar({ activeKey = "运营概览" }: { activeKey?: string }) {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-background sticky top-0 h-screen">
      {/* Brand */}
      <div className="px-5 pt-5 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="h-8 w-8 rounded-lg bg-gradient-gold flex items-center justify-center shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight">AI Pulse</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">KPI 仪表盘</div>
          </div>
        </div>
      </div>

      {/* Workspace switcher */}
      <button className="mx-3 mb-4 flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-left hover:bg-surface-elevated transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-md bg-surface-elevated border border-border flex items-center justify-center text-[10px] font-semibold text-primary">AC</div>
          <div className="min-w-0">
            <div className="text-xs font-medium truncate">Acme · 生产环境</div>
            <div className="text-[10px] text-muted-foreground">12 个项目</div>
          </div>
        </div>
        <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      </button>

      {/* Search */}
      <div className="mx-3 mb-4 relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          placeholder="搜索…"
          className="w-full rounded-md border border-border bg-surface pl-8 pr-12 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground border border-border rounded px-1 py-px">⌘K</kbd>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <div className="px-2 pt-2 pb-1.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">工作区</div>
        {navMain.map((item) => (
          <NavItem key={item.label} {...item} active={item.label === activeKey} />
        ))}

        <div className="px-2 pt-5 pb-1.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">系统</div>
        {navSecondary.map((item) => (
          <NavItem key={item.label} {...item} active={item.label === activeKey} />
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-gradient-gold flex items-center justify-center text-[11px] font-semibold text-primary-foreground">YL</div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium truncate">Yu Liang</div>
            <div className="text-[10px] text-muted-foreground truncate">管理员 · Acme</div>
          </div>
          <div className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
        </div>
      </div>
    </aside>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NavItem({ icon: Icon, label, active, badge, href }: { icon: any; label: string; active?: boolean; badge?: string; href?: string }) {
  const className = `w-full flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
    active
      ? "bg-surface-elevated text-foreground border border-border-strong/60"
      : "text-muted-foreground hover:text-foreground hover:bg-surface"
  }`;
  const inner = (
    <>
      <span className="flex items-center gap-2.5">
        <Icon className={`h-3.5 w-3.5 ${active ? "text-primary" : ""}`} strokeWidth={2} />
        {label}
      </span>
      {badge && (
        <span className="text-[9px] font-mono px-1.5 py-px rounded bg-primary/15 text-primary border border-primary/20">{badge}</span>
      )}
    </>
  );
  if (href && href !== "#") {
    return <Link to={href} className={className}>{inner}</Link>;
  }
  return <button className={className}>{inner}</button>;
}
