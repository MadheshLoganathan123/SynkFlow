import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { pipelineHistory } from "@/lib/mock-data";
import { Calendar, Upload, GitMerge, Clock, MoreVertical, ChevronLeft, ChevronRight, TrendingUp, Timer, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Run History — SynkFlow" },
      { name: "description", content: "Browse past CI/CD pipeline runs with status, duration, and trigger filters." },
      { property: "og:title", content: "Run History — SynkFlow" },
      { property: "og:description", content: "Browse past CI/CD runs with filters." },
    ],
  }),
  component: HistoryPage,
});

const filters = ["All Runs", "Successful", "Failed", "Running"] as const;
type Filter = typeof filters[number];

const triggerIcon = { push: Upload, pr: GitMerge, cron: Clock };

function HistoryPage() {
  const [active, setActive] = useState<Filter>("All Runs");

  const filtered = pipelineHistory.filter((r) => {
    if (active === "All Runs") return true;
    if (active === "Successful") return r.status === "success";
    if (active === "Failed") return r.status === "failed";
    return r.status === "running";
  });

  return (
    <AppLayout searchPlaceholder="Search by Run ID or Commit...">
      <h1 className="text-4xl font-bold tracking-tight mb-6">History</h1>

      {/* Filter tabs + date */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
        <div className="inline-flex items-center bg-card border border-border rounded-xl p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all",
                active === f
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Last 30 Days
            <svg className="h-3 w-3 text-muted-foreground" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="text-sm text-muted-foreground">
            Total Runs: <span className="text-foreground font-bold font-mono">1,284</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card/40 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-wider text-muted-foreground uppercase border-b border-border bg-card/60">
              <th className="px-6 py-4 font-medium">Run ID</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Duration</th>
              <th className="px-6 py-4 font-medium">Trigger</th>
              <th className="px-6 py-4 font-medium">Timestamp</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((run) => {
              const TIcon = triggerIcon[run.triggerType];
              return (
                <tr key={run.id} className="border-b border-border/50 last:border-0 hover:bg-card/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary">#{run.id}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{run.branch}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge variant={run.status} showDot />
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">{run.duration}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <TIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      {run.trigger}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">{run.timestamp}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="h-8 w-8 rounded-md hover:bg-muted inline-flex items-center justify-center text-muted-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground text-sm">
                  No runs match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-card/60 border-t border-border">
          <div className="text-xs text-muted-foreground">Showing 1 to {filtered.length} of 1,284 entries</div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-md border border-border text-xs hover:border-primary/40 flex items-center gap-1">
              <ChevronLeft className="h-3 w-3" /> Previous
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={cn(
                  "h-8 w-8 rounded-md text-xs font-medium",
                  n === 1 ? "bg-primary/20 text-primary border border-primary/40" : "hover:bg-muted text-muted-foreground",
                )}
              >
                {n}
              </button>
            ))}
            <button className="px-3 py-1.5 rounded-md border border-border text-xs hover:border-primary/40 flex items-center gap-1">
              Next <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={TrendingUp} label="Success Rate" value="94.2%" delta="+1.2%" sub="Vs previous 30 days period" color="success" />
        <StatCard icon={Timer} label="Avg. Runtime" value="8m 24s" delta="+12s" sub="Increased due to new security scans" color="primary" />
        <StatCard icon={Rocket} label="Total Deployments" value="158" delta="this week" sub="Targeting 200 by end of sprint" color="info" />
      </div>
    </AppLayout>
  );
}

function StatCard({
  icon: Icon, label, value, delta, sub, color,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: string; sub: string; color: "success" | "primary" | "info" }) {
  const map = {
    success: "bg-success/15 text-success",
    primary: "bg-primary/15 text-primary",
    info: "bg-info/15 text-info",
  }[color];
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[11px] tracking-wider uppercase text-muted-foreground font-medium">{label}</span>
        <div className={`h-8 w-8 rounded-lg ${map} flex items-center justify-center`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold font-display">{value}</span>
        <span className="text-xs text-success font-semibold">{delta}</span>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
