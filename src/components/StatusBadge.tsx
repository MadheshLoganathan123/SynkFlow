import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Loader2, Circle } from "lucide-react";

type Variant = "success" | "running" | "failed" | "pending" | "complete" | "stable";

const styles: Record<Variant, string> = {
  success: "bg-success/10 text-success border-success/30",
  complete: "bg-success/10 text-success border-success/30",
  stable: "bg-success/10 text-success border-success/30",
  running: "bg-info/10 text-info border-info/30",
  failed: "bg-destructive/10 text-destructive border-destructive/30",
  pending: "bg-muted text-muted-foreground border-border",
};

const Icons: Record<Variant, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  complete: CheckCircle2,
  stable: CheckCircle2,
  running: Loader2,
  failed: AlertCircle,
  pending: Circle,
};

export function StatusBadge({
  variant,
  label,
  className,
  showDot = false,
}: {
  variant: Variant;
  label?: string;
  className?: string;
  showDot?: boolean;
}) {
  const Icon = Icons[variant];
  const text = label ?? variant.toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold tracking-wide uppercase",
        styles[variant],
        className,
      )}
    >
      {showDot ? (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "running" ? "bg-info animate-pulse" :
            variant === "failed" ? "bg-destructive" : "bg-success",
          )}
        />
      ) : (
        <Icon className={cn("h-3 w-3", variant === "running" && "animate-spin")} />
      )}
      {text}
    </span>
  );
}
