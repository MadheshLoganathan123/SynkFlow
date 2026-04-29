import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PipelineStageGraph } from "@/components/PipelineStageGraph";
import { StatusBadge } from "@/components/StatusBadge";
import { activePipelines, auditLog } from "@/lib/mock-data";
import { Cpu, MemoryStick, Network, TrendingDown, TrendingUp, Terminal, Zap, Workflow } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operations Dashboard — SynkFlow" },
      { name: "description", content: "Live overview of active CI/CD pipelines, runtime metrics, and audit events." },
      { property: "og:title", content: "Operations Dashboard — SynkFlow" },
      { property: "og:description", content: "Live CI/CD pipeline orchestration." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const pipeline = activePipelines[0];

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Operations Dashboard</h1>
          <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm hover:border-primary/40 transition-colors">
            <Workflow className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">synkflow-core</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">production-cluster-v2</span>
            <svg className="h-3 w-3 text-muted-foreground ml-1" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div className="flex gap-3">
          <KpiTile label="Total Uptime" value="99.98%" />
          <KpiTile label="Avg. Deployment" value="4m 12s" />
        </div>
      </div>

      {/* Active Pipelines */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Active Pipeline Runs</h2>
          </div>
          <span className="text-[11px] font-bold tracking-wider text-primary px-3 py-1 rounded-md bg-primary/10 border border-primary/30">
            3 RUNNING
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6 relative overflow-hidden">
          {/* Left gradient bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-warning to-info" />
          <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

          <div className="relative flex items-start justify-between gap-4 mb-2">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center">
                <Terminal className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">
                  #{pipeline.number} - {pipeline.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Triggered by <span className="text-foreground/80">{pipeline.triggeredBy}</span> · {pipeline.triggeredAgo}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-card border border-border text-sm hover:border-primary/40 transition-colors">
                View Logs
              </button>
              <button className="px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/40 text-destructive text-sm hover:bg-destructive/20 transition-colors">
                Abort Job
              </button>
            </div>
          </div>

          <div className="relative">
            <PipelineStageGraph stages={pipeline.stages} />
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <MetricCard icon={Cpu} label="CPU Utilization" value="42.8%" delta="-2.4%" trend="down" color="primary" pct={42.8} />
        <MetricCard icon={MemoryStick} label="Memory (RAM)" value="12.2 GB" delta="+0.8%" trend="up" color="warning" pct={61} />
        <MetricCard icon={Network} label="Network Throughput" value="842 Mb/s" delta="Stable" trend="stable" color="info" pct={75} />
      </section>

      {/* Audit log */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pipeline Audit Log</h2>
        <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-card/60">
                <th className="px-6 py-3 font-medium">Timestamp</th>
                <th className="px-6 py-3 font-medium">Event</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((row, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-card/60 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{row.timestamp}</td>
                  <td className="px-6 py-4 font-medium">{row.event}</td>
                  <td className="px-6 py-4">
                    <StatusBadge variant={row.status} showDot label={row.status === "complete" ? "Complete" : row.status === "failed" ? "Failed" : "Running"} />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{row.user}</td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  );
}

function KpiTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 px-5 py-3 min-w-[150px]">
      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
        {label}
      </div>
      <div className="text-2xl font-bold font-display mt-1">{value}</div>
    </div>
  );
}

function MetricCard({
  icon: Icon, label, value, delta, trend, color, pct,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; delta: string;
  trend: "up" | "down" | "stable";
  color: "primary" | "warning" | "info";
  pct: number;
}) {
  const colorMap = {
    primary: { bar: "bg-primary", icon: "bg-primary/15 text-primary" },
    warning: { bar: "bg-warning", icon: "bg-warning/15 text-warning" },
    info: { bar: "bg-info", icon: "bg-info/15 text-info" },
  }[color];
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;
  const trendColor = trend === "up" ? "text-warning" : trend === "down" ? "text-success" : "text-success";

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className={`h-10 w-10 rounded-xl ${colorMap.icon} flex items-center justify-center`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          {TrendIcon && <TrendIcon className="h-3 w-3" />}
          {delta}
        </div>
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-3xl font-bold font-display mt-1">{value}</div>
      <div className="mt-3 h-1 rounded-full bg-border overflow-hidden">
        <div className={`h-full ${colorMap.bar} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
