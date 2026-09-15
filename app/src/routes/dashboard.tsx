import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Panel, PanelHeader, PageHeader } from "@/components/Panel";
import { ScoreBar } from "@/components/ScoreBar";
import { StatGrid } from "@/components/StatGrid";
import { FindingRow } from "@/components/FindingRow";
import {
  findings,
  healthScores,
  recentFindings,
  repoCounts,
  repository,
} from "@/data/repository";

const title = "Dashboard — CodeLens AI";
const description =
  "Repository health at a glance: file, component, endpoint and function counts alongside security, performance, quality and reliability scores.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const bySeverity = (s: string) => findings.filter((f) => f.severity === s).length;

  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description={`${repository.name} · ${repository.branch} @ ${repository.commit} · analyzed ${repository.lastAnalyzed}`}
        aside={
          <Link
            to="/analysis"
            className="rounded-md bg-foreground/[0.03] px-3.5 py-2 text-[12px] font-medium ring-1 ring-border transition-colors hover:bg-foreground/[0.07]"
          >
            View all findings
          </Link>
        }
      />

      <div className="space-y-5 px-6 py-8 sm:px-10">
        <StatGrid
          stats={[
            { label: "Files", value: repoCounts.files.toLocaleString() },
            { label: "Components", value: repoCounts.components.toLocaleString() },
            { label: "API endpoints", value: repoCounts.endpoints.toLocaleString() },
            { label: "Functions", value: repoCounts.functions.toLocaleString() },
          ]}
        />

        <div className="grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-5">
            <Panel className="p-4">
              <div className="mb-4 flex items-center gap-2">
                <span className="font-mono text-[11px] text-primary">(a)</span>
                <span className="text-[13px] font-semibold">Health scores</span>
              </div>
              <div className="space-y-3.5">
                {healthScores.map((score) => (
                  <ScoreBar key={score.key} label={score.label} value={score.value} />
                ))}
              </div>
            </Panel>

            <Panel>
              <PanelHeader marker="(b)" title="Severity breakdown" />
              <div className="grid grid-cols-4 divide-x divide-border">
                {(["Critical", "High", "Medium", "Low"] as const).map((sev) => (
                  <div key={sev} className="p-3.5">
                    <div className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                      {sev}
                    </div>
                    <div className="mt-1 font-mono text-lg text-foreground">{bySeverity(sev)}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="lg:col-span-3">
            <Panel className="h-full">
              <PanelHeader
                marker="(c)"
                title="Recent findings"
                aside={`${findings.length} shown`}
              />
              <div className="divide-y divide-border">
                {recentFindings.map((finding) => (
                  <FindingRow key={finding.id} finding={finding} />
                ))}
              </div>
              <div className="border-t border-border px-4 py-3">
                <Link to="/analysis" className="font-mono text-[11px] text-primary hover:underline">
                  Open full analysis →
                </Link>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
