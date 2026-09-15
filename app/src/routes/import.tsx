import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { PageHeader, Panel, PanelHeader } from "@/components/Panel";
import { cn } from "@/lib/utils";

const title = "Import a repository — CodeLens AI";
const description =
  "Connect a GitHub repository or upload a ZIP archive to queue it for indexing and analysis.";

export const Route = createFileRoute("/import")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ImportPage,
});

type Source = "github" | "zip";

const recent = [
  { name: "acme/payments-service", source: "GitHub", indexed: "12m ago" },
  { name: "acme/storefront-web", source: "GitHub", indexed: "2d ago" },
  { name: "legacy-billing.zip", source: "ZIP upload", indexed: "3w ago" },
];

function ImportPage() {
  const [source, setSource] = useState<Source>("github");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <AppShell>
      <PageHeader
        title="Import a repository"
        description="Choose a source to index. This preview collects the details only — nothing is uploaded or analyzed yet."
      />

      <div className="grid gap-5 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_300px]">
        <Panel>
          <PanelHeader marker="↥" title="Source" />

          <div className="grid grid-cols-2 gap-px bg-border">
            {(
              [
                { id: "github", label: "GitHub repository", hint: "Public or connected private repo" },
                { id: "zip", label: "ZIP upload", hint: "Archive up to 250 MB" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSource(opt.id)}
                className={cn(
                  "p-4 text-left transition-colors",
                  source === opt.id
                    ? "bg-primary/[0.07]"
                    : "bg-background hover:bg-foreground/[0.03]",
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      source === opt.id ? "bg-primary" : "bg-foreground/20",
                    )}
                  />
                  <span className="text-[13px] font-semibold">{opt.label}</span>
                </div>
                <p className="mt-1.5 text-[12px] text-muted">{opt.hint}</p>
              </button>
            ))}
          </div>

          <div className="p-5">
            {source === "github" ? (
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block font-mono text-[10px] tracking-[0.16em] text-muted/70 uppercase">
                    Repository URL
                  </span>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/acme/payments-service"
                    className="w-full rounded-md bg-foreground/[0.03] px-3 py-2.5 font-mono text-[12px] text-foreground ring-1 ring-border outline-none placeholder:text-muted/50 focus:ring-primary/50"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-mono text-[10px] tracking-[0.16em] text-muted/70 uppercase">
                      Branch
                    </span>
                    <input
                      defaultValue="main"
                      className="w-full rounded-md bg-foreground/[0.03] px-3 py-2.5 font-mono text-[12px] text-foreground ring-1 ring-border outline-none focus:ring-primary/50"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-mono text-[10px] tracking-[0.16em] text-muted/70 uppercase">
                      Depth
                    </span>
                    <select className="w-full rounded-md bg-foreground/[0.03] px-3 py-2.5 font-mono text-[12px] text-foreground ring-1 ring-border outline-none focus:ring-primary/50">
                      <option>Full history</option>
                      <option>Latest commit only</option>
                    </select>
                  </label>
                </div>
              </div>
            ) : (
              <label
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-12 text-center transition-colors hover:bg-foreground/[0.02]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) setFileName(f.name);
                }}
              >
                <span className="font-mono text-lg text-muted">↥</span>
                <span className="mt-3 text-[13px] font-medium text-foreground">
                  {fileName ?? "Drop a .zip archive here"}
                </span>
                <span className="mt-1 text-[12px] text-muted">or click to browse your files</span>
                <input
                  type="file"
                  accept=".zip"
                  className="sr-only"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                />
              </label>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled
                className="rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground opacity-60"
              >
                Start analysis
              </button>
              <span className="font-mono text-[11px] text-muted">
                Disabled in this preview — no indexing backend is connected.
              </span>
            </div>
          </div>
        </Panel>

        <Panel className="h-fit">
          <PanelHeader title="Recently indexed" />
          <div className="divide-y divide-border">
            {recent.map((r) => (
              <div key={r.name} className="px-4 py-3">
                <div className="font-mono text-[12px] text-foreground">{r.name}</div>
                <div className="mt-1 font-mono text-[10px] text-muted">
                  {r.source} · {r.indexed}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
