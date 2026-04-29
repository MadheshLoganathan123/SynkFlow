import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { pipelineDetails } from "@/lib/mock-data";
import { ArrowLeft, Download, RotateCcw, Terminal, Copy, Maximize2, Clock, User, GitCommit, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pipelines")({
  head: () => ({
    meta: [
      { title: "Pipeline Detail — SynkFlow" },
      { name: "description", content: "Inspect pipeline steps, live logs, and failure diagnostics for any run." },
      { property: "og:title", content: "Pipeline Detail — SynkFlow" },
      { property: "og:description", content: "Inspect pipeline steps and live logs." },
    ],
  }),
  component: PipelinesPage,
});

const stepIcon = {
  success: { Icon: CheckCircle2, color: "text-success", ring: "border-success/60 bg-success/5", glow: "shadow-[0_0_20px_oklch(0.72_0.18_155_/_0.15)]" },
  failed: { Icon: XCircle, color: "text-destructive", ring: "border-destructive/70 bg-destructive/10", glow: "shadow-[0_0_20px_oklch(0.65_0.22_25_/_0.25)]" },
  skipped: { Icon: MinusCircle, color: "text-muted-foreground", ring: "border-border bg-card/40", glow: "" },
  running: { Icon: CheckCircle2, color: "text-warning", ring: "border-warning/60 bg-warning/5", glow: "" },
  pending: { Icon: MinusCircle, color: "text-muted-foreground", ring: "border-border bg-card/40", glow: "" },
} as const;

const logColors = {
  info: "text-foreground/80",
  warn: "text-warning",
  error: "text-destructive font-semibold",
  fail: "text-destructive font-semibold bg-destructive/10",
  muted: "text-muted-foreground",
} as const;

function PipelinesPage() {
  const pipeline = pipelineDetails["production-deploy-v42"];

  return (
    <AppLayout searchPlaceholder="Search logs or stages...">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <Link to="/" className="mt-2 h-9 w-9 rounded-lg border border-border hover:border-primary/40 flex items-center justify-center transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{pipeline.name}</h1>
              <StatusBadge variant="failed" label="FAILED" />
            </div>
            <div className="mt-2 flex items-center gap-5 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {pipeline.startedAt}</span>
              <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {pipeline.triggeredBy}</span>
              <span className="flex items-center gap-1.5"><GitCommit className="h-3 w-3" /> {pipeline.commit}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-sm hover:border-primary/40 transition-colors">
            <Download className="h-4 w-4" /> Download Artifacts
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/15 border border-primary/40 text-primary text-sm font-semibold hover:bg-primary/25 transition-colors">
            <RotateCcw className="h-4 w-4" /> Retry Pipeline
          </button>
        </div>
      </div>

      {/* Two columns: Steps + Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Steps */}
        <div className="space-y-3">
          {pipeline.steps.map((step, idx) => {
            const meta = stepIcon[step.status];
            const failed = step.status === "failed";
            const skipped = step.status === "skipped";
            return (
              <div
                key={idx}
                className={cn(
                  "relative rounded-xl border p-4 flex items-center gap-3 transition-all overflow-hidden",
                  meta.ring, meta.glow,
                  skipped && "opacity-60",
                )}
              >
                {failed && <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive" />}
                {step.status === "success" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-success" />}
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                  failed ? "bg-destructive/20" : step.status === "success" ? "bg-success/20" : "bg-muted",
                )}>
                  <meta.Icon className={cn("h-5 w-5", meta.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{step.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">{step.detail}</div>
                </div>
                <div className="text-xs font-mono text-muted-foreground">{step.duration}</div>
              </div>
            );
          })}
        </div>

        {/* Logs */}
        <div className="rounded-2xl border border-border bg-card/60 overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-2 text-sm">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">logs://production-deploy/run-tests.log</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-destructive px-2 py-1 rounded-md bg-destructive/10 border border-destructive/30">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" /> Live Sync
              </span>
              <button className="h-7 w-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"><Copy className="h-3.5 w-3.5" /></button>
              <button className="h-7 w-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"><Maximize2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          <div className="flex-1 p-4 font-mono text-xs overflow-auto scrollbar-thin">
            {pipeline.logs.map((log) => (
              <div key={log.line} className={cn("flex gap-4 px-2 py-0.5 rounded", logColors[log.level])}>
                <span className="text-muted-foreground/60 select-none w-6 text-right shrink-0">{log.line}</span>
                <span className="whitespace-pre-wrap">{log.text}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border px-5 py-3 flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Search log:</span>
            <input
              type="text"
              placeholder="Filter by keyword (e.g. error, warn)..."
              className="flex-1 bg-input border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary/60"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
