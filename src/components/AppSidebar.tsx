import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  GitBranch,
  History,
  TrendingUp,
  Settings,
  LifeBuoy,
  Plus,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pipelines", label: "Pipelines", icon: GitBranch },
  { to: "/history", label: "History", icon: History },
  { to: "/insights", label: "Insights", icon: TrendingUp },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 pt-6 pb-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-[var(--shadow-glow)] group-hover:scale-105 transition-transform">
            <Workflow className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display text-xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              SynkFlow
            </div>
            <div className="text-[10px] tracking-[0.2em] text-muted-foreground font-mono">
              V1.0.4-STABLE
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-[var(--transition-base)]",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border border-primary/30 shadow-[inset_0_0_20px_oklch(0.65_0.22_285_/_0.08)]"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/40",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* CTA */}
      <div className="px-4 py-4">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-info text-primary-foreground font-semibold text-sm shadow-[var(--shadow-glow)] hover:opacity-95 hover:scale-[1.02] transition-all">
          <Plus className="h-4 w-4" />
          New Pipeline
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/40 transition-colors">
          <Settings className="h-4 w-4" /> Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/40 transition-colors">
          <LifeBuoy className="h-4 w-4" /> Support
        </button>
      </div>
    </aside>
  );
}
