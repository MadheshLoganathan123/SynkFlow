import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { failureInsights } from "@/lib/mock-data";
import { AlertTriangle, AlertCircle, XCircle, Timer, Repeat, CircleSlash, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Failure Insights — SynkFlow" },
      { name: "description", content: "Diagnostic overview of pipeline health, regression patterns, and root-cause trends." },
      { property: "og:title", content: "Failure Insights — SynkFlow" },
      { property: "og:description", content: "Diagnose pipeline regressions and health." },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const max = Math.max(...failureInsights.distribution.map((d) => d.value));

  return (
    <AppLayout searchPlaceholder="Search insights...">
      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Failure Insights</h1>
          <p className="mt-2 text-muted-foreground">Diagnostic overview of pipeline health and regression patterns.</p>
        </div>
        <div className="flex gap-3">
          <KpiTile icon={AlertCircle} label="MTTR" value={failureInsights.mttr} accent="destructive" />
          <KpiTile icon={Timer} label="Health Index" value={failureInsights.healthIndex} accent="success" />
        </div>
      </div>

      {/* Distribution + Critical Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 mb-8">
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold">Failure Distribution</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs">
              Last 7 Days
              <svg className="h-3 w-3 text-muted-foreground" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-6 h-56 px-2">
            {failureInsights.distribution.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-lg transition-all hover:opacity-90 relative group"
                    style={{
                      height: `${(d.value / max) * 100}%`,
                      background: `linear-gradient(180deg, ${d.color}, ${d.color}40)`,
                      boxShadow: `0 0 24px ${d.color}40`,
                    }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-6 px-2 mt-3">
            {failureInsights.distribution.map((d) => (
              <div key={d.label} className="flex-1 text-center">
                <div className="text-xs text-muted-foreground">{d.label}</div>
                <div className="text-lg font-bold font-display mt-0.5" style={{ color: d.color }}>{d.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Trend */}
        <div className="rounded-2xl border border-destructive/30 bg-gradient-to-br from-destructive/10 via-card to-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-destructive/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-destructive text-xs font-bold tracking-wider uppercase mb-3">
              <AlertTriangle className="h-4 w-4" /> Critical Trend
            </div>
            <h3 className="text-2xl font-bold leading-tight">
              Regression in <span className="text-destructive">Auth-Service</span>
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Security handshake failures increased by{" "}
              <span className="text-destructive font-semibold">24%</span> in the last 4 hours.
            </p>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Suggested Action</span>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                Rollback v2.1.4 <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-info rounded-full w-2/3" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Failure Logs */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Failure Logs</h2>
          <button className="text-sm text-primary hover:underline flex items-center gap-1">
            View all logs <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-4">
          {failureInsights.recentFailures.map((f) => (
            <div key={f.id} className="rounded-2xl border border-border bg-card/60 p-5 hover:border-destructive/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-destructive/15 border border-destructive/30 flex items-center justify-center shrink-0">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="text-xs font-bold tracking-wider text-primary">{f.id}</div>
                      <h3 className="text-lg font-semibold mt-0.5">{f.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{f.failedAgo}</div>
                      <div className="text-[10px] mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-destructive/10 border border-destructive/30 text-destructive font-bold tracking-wider uppercase">
                        Root Cause: {f.rootCause}
                      </div>
                    </div>
                  </div>

                  <pre className="mt-4 rounded-lg border border-border bg-background/60 p-4 font-mono text-xs text-destructive/90 overflow-x-auto scrollbar-thin">
                    {f.log.join("\n")}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FootStat icon={Timer} label="Avg Time to Recovery" value="18m 42s" />
        <FootStat icon={Repeat} label="Flaky Test Rate" value="3.2%" />
        <FootStat icon={CircleSlash} label="Failed in Last 24h" value="42 runs" />
      </div>
    </AppLayout>
  );
}

function KpiTile({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent: "destructive" | "success" }) {
  const tone = accent === "destructive" ? "text-destructive bg-destructive/10" : "text-success bg-success/10";
  return (
    <div className="rounded-xl border border-border bg-card/60 px-5 py-3 min-w-[160px]">
      <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
        <span className={`h-5 w-5 rounded-md ${tone} flex items-center justify-center`}>
          <Icon className="h-3 w-3" />
        </span>
        {label}
      </div>
      <div className="text-2xl font-bold font-display mt-1">{value}</div>
    </div>
  );
}

function FootStat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[11px] tracking-wider uppercase text-muted-foreground font-medium">{label}</div>
        <div className="text-2xl font-bold font-display mt-0.5">{value}</div>
      </div>
    </div>
  );
}
