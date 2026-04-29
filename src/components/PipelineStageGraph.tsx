import { cn } from "@/lib/utils";
import { Package, FlaskConical, Rocket, Check } from "lucide-react";
import type { PipelineStage } from "@/lib/mock-data";

const stageIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Build: Package,
  "Test Suite": FlaskConical,
  Test: FlaskConical,
  Deploy: Rocket,
};

const statusStyles = {
  success: {
    box: "border-success/60 bg-success/5 shadow-[0_0_24px_oklch(0.72_0.18_155_/_0.25)]",
    icon: "text-success",
    label: "text-success",
  },
  running: {
    box: "border-warning/60 bg-warning/5 shadow-[0_0_24px_oklch(0.78_0.16_75_/_0.25)] pulse-warning",
    icon: "text-warning",
    label: "text-warning",
  },
  failed: {
    box: "border-destructive/60 bg-destructive/5",
    icon: "text-destructive",
    label: "text-destructive",
  },
  pending: {
    box: "border-border bg-card/40",
    icon: "text-muted-foreground",
    label: "text-muted-foreground",
  },
  skipped: {
    box: "border-border bg-card/40 opacity-60",
    icon: "text-muted-foreground",
    label: "text-muted-foreground",
  },
};

export function PipelineStageGraph({ stages }: { stages: PipelineStage[] }) {
  return (
    <div className="flex items-center justify-between gap-2 py-4">
      {stages.map((stage, i) => {
        const Icon = stageIcons[stage.name] ?? Package;
        const s = statusStyles[stage.status];
        const isLast = i === stages.length - 1;
        return (
          <div key={stage.name} className="flex items-center flex-1">
            {/* Stage box */}
            <div className="flex flex-col items-center gap-2 min-w-[90px]">
              <div className="relative">
                <div
                  className={cn(
                    "h-16 w-16 rounded-2xl border-2 flex items-center justify-center transition-all",
                    s.box,
                  )}
                >
                  <Icon className={cn("h-6 w-6", s.icon)} />
                </div>
                {stage.status === "success" && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-success flex items-center justify-center border-2 border-background">
                    <Check className="h-3 w-3 text-success-foreground" strokeWidth={3} />
                  </div>
                )}
                {stage.status === "running" && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-warning border-2 border-background animate-pulse" />
                )}
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-foreground">{stage.name}</div>
                <div className={cn("text-[10px] font-bold tracking-wider uppercase", s.label)}>
                  {stage.status}
                </div>
                <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                  {stage.duration}
                  {stage.timestamp && ` · ${stage.timestamp}`}
                  {stage.detail && ` · ${stage.detail}`}
                </div>
              </div>
            </div>

            {/* Connector */}
            {!isLast && (
              <div className="flex-1 mx-2 h-0.5 rounded-full overflow-hidden bg-border/40 -mt-10">
                <div
                  className={cn(
                    "h-full",
                    stages[i].status === "success" && stages[i + 1].status !== "pending"
                      ? "connector-flow"
                      : stages[i + 1].status === "running"
                        ? "bg-warning/50"
                        : "bg-border",
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
