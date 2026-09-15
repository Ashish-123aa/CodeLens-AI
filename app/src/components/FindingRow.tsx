import type { Finding } from "@/data/repository";
import { SeverityBadge } from "./SeverityBadge";

export function FindingRow({ finding }: { finding: Finding }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 text-[12px] transition-colors hover:bg-foreground/[0.03]">
      <SeverityBadge severity={finding.severity} />
      <span className="truncate text-foreground">{finding.title}</span>
      <span className="ml-auto shrink-0 font-mono text-[10px] text-muted">{finding.category}</span>
    </div>
  );
}

export function FindingCard({ finding }: { finding: Finding }) {
  return (
    <article className="border-b border-border px-4 py-4 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2.5">
        <SeverityBadge severity={finding.severity} />
        <span className="font-mono text-[10px] text-muted">{finding.id}</span>
        <h3 className="text-[13px] font-semibold text-foreground">{finding.title}</h3>
        <span className="ml-auto font-mono text-[10px] text-muted">{finding.age} ago</span>
      </div>
      <p className="mt-2 max-w-3xl text-[12px] leading-[1.65] text-muted">{finding.detail}</p>
      <p className="mt-2 max-w-3xl text-[12px] leading-[1.65] text-foreground/80">
        <span className="font-mono text-[10px] tracking-[0.14em] text-primary uppercase">Fix </span>
        {finding.recommendation}
      </p>
      <div className="mt-2.5 font-mono text-[11px] text-muted">
        {finding.file}
        <span className="text-muted/50">:{finding.line}</span>
      </div>
    </article>
  );
}
