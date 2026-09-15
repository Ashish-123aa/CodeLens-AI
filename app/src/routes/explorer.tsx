import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/Panel";
import { CodeViewer } from "@/components/CodeViewer";
import { FileTree } from "@/components/FileTree";
import { defaultFilePath, fileTree, sourceFiles } from "@/data/files";
import { repository } from "@/data/repository";

const title = "Repository Explorer — CodeLens AI";
const description =
  "Browse the file tree, read the source and get a per-file explanation of what the code does and who calls it.";

export const Route = createFileRoute("/explorer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Explorer,
});

const riskTone = {
  none: "text-primary",
  low: "text-medium",
  high: "text-high",
} as const;

function Explorer() {
  const [activePath, setActivePath] = useState(defaultFilePath);
  const file = sourceFiles[activePath] ?? sourceFiles[defaultFilePath]!;
  const lineCount = file.code.split("\n").length;

  return (
    <AppShell>
      <PageHeader
        title="Repository Explorer"
        description={`${repository.name} · ${repository.branch} @ ${repository.commit}`}
      />

      <div className="grid grid-cols-1 lg:h-[calc(100vh-8.5rem)] lg:grid-cols-[240px_1.15fr_1fr]">
        <div className="overflow-y-auto border-b border-border p-3 lg:border-r lg:border-b-0">
          <div className="mb-2 px-1 font-mono text-[10px] tracking-[0.16em] text-muted/70 uppercase">
            Files
          </div>
          <FileTree nodes={fileTree} activePath={activePath} onSelect={setActivePath} />
        </div>

        <div className="flex min-w-0 flex-col overflow-hidden border-b border-border lg:border-r lg:border-b-0">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2 font-mono text-[11px] text-muted">
            <span className="truncate text-foreground">{file.path}</span>
            <span className="ml-auto shrink-0 text-muted/50">
              {file.language} · L {file.startLine}–{file.startLine + lineCount - 1}
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            <CodeViewer code={file.code} startLine={file.startLine} />
          </div>
        </div>

        <div className="overflow-y-auto p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="font-mono text-[10px] text-primary">◈</span>
            <span className="text-[12px] font-semibold">AI explanation</span>
            <span className="ml-auto font-mono text-[10px] text-muted">
              confidence {file.explanation.confidence}
            </span>
          </div>

          <p className="text-[12px] leading-[1.65] text-pretty text-foreground/90">
            {file.explanation.summary}
          </p>

          <div className="mt-4 space-y-1.5 font-mono text-[11px] text-muted">
            <div className="flex gap-2">
              <span className="w-16 shrink-0 text-primary">calls</span>
              <span className="text-foreground/80">{file.explanation.calls}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-16 shrink-0 text-primary">called by</span>
              <span className="text-foreground/80">{file.explanation.calledBy}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-16 shrink-0 text-primary">risk</span>
              <span className={riskTone[file.explanation.riskLevel]}>{file.explanation.risk}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {file.explanation.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-foreground/[0.05] px-2 py-1 font-mono text-[11px] text-muted ring-1 ring-border"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-6 border-t border-border pt-4 font-mono text-[10px] leading-relaxed text-muted/70">
            Explanations in this preview are pre-indexed sample output. No analysis request is sent
            anywhere.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
