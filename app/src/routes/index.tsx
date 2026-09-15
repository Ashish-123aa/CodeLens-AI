import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { Panel, PanelHeader, SectionHeader } from "@/components/Panel";
import { ScoreBar } from "@/components/ScoreBar";
import { StatGrid } from "@/components/StatGrid";
import { FindingRow } from "@/components/FindingRow";
import { CodeViewer } from "@/components/CodeViewer";
import {
  healthScores,
  heroStats,
  recentFindings,
  repoCounts,
  repository,
} from "@/data/repository";
import { defaultFilePath, sourceFiles } from "@/data/files";

const title = "CodeLens AI — Understand your codebase";
const description =
  "Point CodeLens at a repository and get a structural read of every file, endpoint and dependency, with explanations grounded in your actual code.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Landing,
});

function Landing() {
  const file = sourceFiles[defaultFilePath]!;

  return (
    <AppShell>
      <section className="relative overflow-hidden border-b border-border px-6 pt-10 pb-8 sm:px-10">
        <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-[0.35]" />
        <div
          className="pointer-events-none absolute -top-32 right-0 hidden h-64 w-64 md:block"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 12%, transparent), transparent)",
          }}
        />

        <div className="relative max-w-3xl">
          <div className="rise mb-5 flex items-center gap-2 font-mono text-[11px] text-muted">
            <span className="text-primary">●</span> CodeLens AI
            <span className="text-muted/40">/</span>
            <span>v1.4.2 · engine-ready</span>
          </div>
          <h1
            className="rise text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl"
            style={{ animationDelay: "60ms" }}
          >
            Understand your codebase. <span className="text-primary">Find problems.</span> Learn how
            it works.
          </h1>
          <p
            className="rise mt-4 max-w-[46ch] text-[14px] text-pretty text-muted"
            style={{ animationDelay: "120ms" }}
          >
            {description}
          </p>
          <div className="rise mt-6 flex flex-wrap items-center gap-3" style={{ animationDelay: "180ms" }}>
            <Link
              to="/import"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground ring-1 ring-primary/40 transition-colors hover:bg-primary/90"
            >
              Analyze Repository <span className="font-mono text-[12px]">↵</span>
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-foreground/[0.03] px-4 py-2.5 text-[13px] font-medium text-foreground ring-1 ring-border transition-colors hover:bg-foreground/[0.07]"
            >
              Explore Demo
            </Link>
          </div>
          <div
            className="rise mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] text-muted"
            style={{ animationDelay: "240ms" }}
          >
            {heroStats.map((stat) => (
              <span key={stat.label}>
                <span className="font-semibold text-foreground">{stat.value}</span> {stat.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-8 sm:px-10">
        <SectionHeader
          marker="(a)"
          title="Dashboard"
          aside={`${repository.name} · ${repository.branch}`}
        />

        <StatGrid
          stats={[
            { label: "Files", value: repoCounts.files.toLocaleString() },
            { label: "Components", value: repoCounts.components.toLocaleString() },
            { label: "Endpoints", value: repoCounts.endpoints.toLocaleString() },
            { label: "Functions", value: repoCounts.functions.toLocaleString() },
          ]}
        />

        <div className="mt-5 grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Panel className="p-4">
              <div className="mb-4 flex items-center gap-2">
                <span className="font-mono text-[11px] text-primary">(b)</span>
                <span className="text-[13px] font-semibold">Health scores</span>
              </div>
              <div className="space-y-3.5">
                {healthScores.map((score) => (
                  <ScoreBar key={score.key} label={score.label} value={score.value} />
                ))}
              </div>
            </Panel>
          </div>

          <div className="lg:col-span-3">
            <Panel className="h-full">
              <PanelHeader marker="(c)" title="Recent findings" aside="312 total" />
              <div className="divide-y divide-border">
                {recentFindings.map((finding) => (
                  <FindingRow key={finding.id} finding={finding} />
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </section>

      <section className="px-6 pb-10 sm:px-10">
        <SectionHeader marker="(d)" title="Repository Explorer" aside="3 panels" />

        <div className="grid grid-cols-1 overflow-hidden rounded-lg ring-1 ring-border md:grid-cols-[180px_1fr_1fr]">
          <div className="border-b border-border bg-background p-3 md:border-r md:border-b-0">
            <div className="mb-2 font-mono text-[10px] tracking-[0.16em] text-muted/70 uppercase">
              Files
            </div>
            <div className="space-y-1 font-mono text-[11px] text-muted">
              {["src", "auth", "api", "db", "utils", "workers"].map((name, i) => (
                <div key={name} className={i === 0 ? "pl-1" : "pl-4"}>
                  ▾ {name}
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden border-b border-border bg-background md:border-r md:border-b-0">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2 font-mono text-[11px] text-muted">
              <span className="text-foreground">auth/session.ts</span>
              <span className="ml-auto text-muted/50">L 14–23</span>
            </div>
            <CodeViewer code={file.code} startLine={file.startLine} />
          </div>

          <div className="bg-background p-3">
            <div className="mb-3 flex items-center gap-2">
              <span className="font-mono text-[10px] text-primary">◈</span>
              <span className="text-[12px] font-semibold">AI explanation</span>
              <span className="ml-auto font-mono text-[10px] text-muted">
                confidence {file.explanation.confidence}
              </span>
            </div>
            <p className="text-[12px] leading-[1.6] text-pretty text-foreground/90">
              {file.explanation.summary}
            </p>
            <div className="mt-3 space-y-1.5 font-mono text-[11px] text-muted">
              <div className="flex gap-2">
                <span className="w-20 shrink-0 text-primary">calls</span>
                <span className="text-foreground/80">{file.explanation.calls}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 shrink-0 text-primary">called by</span>
                <span className="text-foreground/80">{file.explanation.calledBy}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 shrink-0 text-primary">risk</span>
                <span className="text-medium">{file.explanation.risk}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 font-mono text-[11px] text-muted">
          <span>◇</span> Open any file to ask CodeLens <span className="text-muted/50">—</span> try{" "}
          <Link to="/ask" className="text-foreground/80 underline-offset-4 hover:underline">
            "How does the checkout flow work?"
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
