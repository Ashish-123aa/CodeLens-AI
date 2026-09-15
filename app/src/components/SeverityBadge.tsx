import type { Severity } from "@/data/repository";
import { cn } from "@/lib/utils";

const styles: Record<Severity, string> = {
  Critical: "bg-critical/15 text-critical ring-critical/25",
  High: "bg-high/15 text-high ring-high/25",
  Medium: "bg-medium/15 text-medium ring-medium/25",
  Low: "bg-low/15 text-low ring-low/25",
};

export function SeverityBadge({
  severity,
  className,
}: {
  severity: Severity;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ring-1",
        styles[severity],
        className,
      )}
    >
      {severity}
    </span>
  );
}
