import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { PageHeader, Panel, PanelHeader } from "@/components/Panel";
import { FindingCard } from "@/components/FindingRow";
import { ScoreBar } from "@/components/ScoreBar";
import {
  categoryLabels,
  findings,
  healthScores,
  repository,
  type FindingCategory,
  type Severity,
} from "@/data/repository";
import { cn } from "@/lib/utils";

const title = "Analysis — CodeLens AI";
const description =
  "Security, performance, code quality and reliability findings for the repository, ranked by Critical, High, Medium and Low severity.";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Analysis,
});

const categories: FindingCategory[] = ["security", "performance", "quality", "reliability"];
const severities: Severity[] = ["Critical", "High", "Medium", "Low"];

function Analysis() {
  const [category, setCategory] = useState<FindingCategory | "all">("all");
  const [severity, setSeverity] = useState<Severity | "all">("all");

  const visible = findings.filter(
    (f) =>
      (category === "all" || f.category === category) &&
      (severity === "all" || f.severity === severity),
  );

  return (
    <AppShell>
      <PageHeader
        title="Analysis"
        description={`${findings.length} findings across ${repository.name} · last run ${repository.lastAnalyzed}`}
      />

      <div className="grid gap-5 px-6 py-8 sm:px-10 lg:grid-cols-[260px_1fr]">
        <div className="space-y-5">
          <Panel className="p-4">
            <div className="mb-4 text-[13px] font-semibold">Scores</div>
            <div className="space-y-3.5">
              {healthScores.map((s) => (
                <ScoreBar key={s.key} label={s.label} value={s.value} />
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Filter" aside={`${visible.length} shown`} />
            <div className="space-y-4 p-3">
              <FilterGroup
                label="Category"
                options={["all", ...categories]}
                value={category}
                onChange={(v) => setCategory(v as FindingCategory | "all")}
                render={(v) => (v === "all" ? "All" : categoryLabels[v as FindingCategory])}
              />
              <FilterGroup
                label="Severity"
                options={["all", ...severities]}
                value={severity}
                onChange={(v) => setSeverity(v as Severity | "all")}
                render={(v) => (v === "all" ? "All" : v)}
              />
            </div>
          </Panel>
        </div>

        <Panel>
          <PanelHeader
            marker="☰"
            title={category === "all" ? "All findings" : categoryLabels[category]}
            aside={severity === "all" ? "all severities" : severity.toLowerCase()}
          />
          {visible.length ? (
            visible.map((finding) => <FindingCard key={finding.id} finding={finding} />)
          ) : (
            <p className="px-4 py-10 text-center text-[12px] text-muted">
              No findings match this filter.
            </p>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
  render,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  render: (v: string) => string;
}) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] tracking-[0.16em] text-muted/70 uppercase">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-[11px] ring-1 transition-colors",
              opt === value
                ? "bg-primary/12 text-primary ring-primary/30"
                : "bg-foreground/[0.03] text-muted ring-border hover:text-foreground",
            )}
          >
            {render(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}
