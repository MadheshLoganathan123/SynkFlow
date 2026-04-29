import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Bell, Terminal, RefreshCw, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Mainframe" },
  { to: "/pipelines", label: "Clusters" },
  { to: "/insights", label: "Security" },
] as const;

interface Props {
  searchPlaceholder?: string;
}

export function TopBar({ searchPlaceholder = "Search clusters, nodes, or jobs..." }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="flex items-center gap-4 px-6 lg:px-8 py-4 border-b border-border/60 bg-background/60 backdrop-blur-xl sticky top-0 z-20">
      {/* Search */}
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full bg-card/80 border border-border rounded-full pl-11 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Tab nav */}
      <nav className="hidden lg:flex items-center gap-6 text-sm">
        {tabs.map((t) => {
          const active = pathname === t.to;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "relative py-1 transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {active && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Icon actions */}
      <div className="flex items-center gap-1">
        <button className="h-9 w-9 rounded-full hover:bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
        <button className="relative h-9 w-9 rounded-full hover:bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-primary rounded-full" />
        </button>
        <button className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Terminal className="h-4 w-4" />
        </button>
      </div>

      {/* Deploy CTA */}
      <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-info text-primary-foreground font-semibold text-sm shadow-[var(--shadow-glow)] hover:opacity-95 hover:scale-[1.02] transition-all">
        <Rocket className="h-4 w-4" />
        <span className="leading-tight text-left">Deploy<br className="hidden xl:block" /> Now</span>
      </button>
    </header>
  );
}
