import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("overflow-hidden rounded-lg bg-background ring-1 ring-border", className)}>
      {children}
    </div>
  );
}

export function PanelHeader({
  marker,
  title,
  aside,
}: {
  marker?: string;
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
      {marker ? <span className="font-mono text-[11px] text-primary">{marker}</span> : null}
      <span className="text-[13px] font-semibold">{title}</span>
      {aside ? <span className="ml-auto font-mono text-[11px] text-muted">{aside}</span> : null}
    </div>
  );
}

export function SectionHeader({
  marker,
  title,
  aside,
}: {
  marker: string;
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-4">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] text-primary">{marker}</span>
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      </div>
      {aside ? <span className="font-mono text-[11px] text-muted">{aside}</span> : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  aside,
}: {
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-6 py-6 sm:px-10">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-[13px] text-muted">{description}</p>
      </div>
      {aside}
    </div>
  );
}
