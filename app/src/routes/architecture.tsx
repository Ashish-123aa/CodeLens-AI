import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { PageHeader, Panel, PanelHeader } from "@/components/Panel";
import {
  architectureNotes,
  graphEdges,
  graphNodes,
  layerLabels,
  moduleStats,
  type GraphNode,
} from "@/data/architecture";
import { cn } from "@/lib/utils";

const title = "Architecture — CodeLens AI";
const description =
  "A dependency graph of the repository's modules, entry points, data stores and third-party calls, with coupling statistics.";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Architecture,
});

const W = 1000;
const H = 620;
const pos = (n: GraphNode) => ({ x: (n.x / 100) * W, y: (n.y / 100) * H });

const kindFill: Record<GraphNode["kind"], string> = {
  edge: "fill-primary/12 stroke-primary/50",
  service: "fill-foreground/[0.05] stroke-border",
  data: "fill-low/10 stroke-low/40",
  external: "fill-high/10 stroke-high/40",
};

function Architecture() {
  const [active, setActive] = useState<string | null>(null);
  const nodeById = Object.fromEntries(graphNodes.map((n) => [n.id, n]));
  const selected = active ? nodeById[active] : null;

  return (
    <AppShell>
      <PageHeader
        title="Architecture"
        description="Module dependency graph derived from the import and call structure of the indexed repository."
      />

      <div className="grid gap-5 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_300px]">
        <Panel>
          <PanelHeader
            marker="⬡"
            title="Dependency graph"
            aside={`${graphNodes.length} modules · ${graphEdges.length} edges`}
          />
          <div className="overflow-x-auto p-4">
            <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[640px] w-full" role="img" aria-label="Module dependency graph">
              {graphEdges.map((edge) => {
                const a = pos(nodeById[edge.from]!);
                const b = pos(nodeById[edge.to]!);
                const isActive = active === edge.from || active === edge.to;
                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    <line
                      x1={a.x}
                      y1={a.y + 20}
                      x2={b.x}
                      y2={b.y - 20}
                      className={cn(
                        "transition-opacity",
                        edge.warning ? "stroke-high/60" : "stroke-border",
                        active && !isActive ? "opacity-25" : "opacity-100",
                      )}
                      strokeWidth={edge.warning ? 1.6 : 1.2}
                      strokeDasharray={edge.warning ? "5 4" : undefined}
                    />
                    <text
                      x={a.x + (b.x - a.x) * 0.38}
                      y={a.y + 20 + (b.y - a.y - 40) * 0.38 - 4}
                      className="fill-muted font-mono"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {edge.calls}
                    </text>
                  </g>
                );
              })}

              {graphNodes.map((node) => {
                const p = pos(node);
                const isActive = active === node.id;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${p.x - 74} ${p.y - 20})`}
                    onClick={() => setActive(isActive ? null : node.id)}
                    className="cursor-pointer"
                  >
                    <rect
                      width={148}
                      height={40}
                      rx={8}
                      className={cn(kindFill[node.kind], isActive && "stroke-primary")}
                      strokeWidth={isActive ? 1.8 : 1}
                    />
                    <text
                      x={74}
                      y={18}
                      textAnchor="middle"
                      className="fill-foreground font-mono"
                      fontSize="12"
                    >
                      {node.label}
                    </text>
                    <text
                      x={74}
                      y={31}
                      textAnchor="middle"
                      className="fill-muted font-mono"
                      fontSize="9"
                    >
                      {layerLabels[node.kind]}
                      {node.files ? ` · ${node.files} files` : ""}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex flex-wrap gap-4 border-t border-border px-4 py-3 font-mono text-[10px] text-muted">
            <span>
              <span className="text-primary">━</span> entry
            </span>
            <span>
              <span className="text-low">━</span> data store
            </span>
            <span>
              <span className="text-high">╌</span> flagged dependency
            </span>
            <span className="ml-auto">click a module to focus</span>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <PanelHeader title={selected ? selected.label : "Coupling"} />
            {selected ? (
              <div className="space-y-2 p-4 font-mono text-[11px] text-muted">
                <div className="flex gap-2">
                  <span className="w-20 text-primary">kind</span>
                  <span className="text-foreground/80">{layerLabels[selected.kind]}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 text-primary">files</span>
                  <span className="text-foreground/80">{selected.files || "n/a"}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 text-primary">outbound</span>
                  <span className="text-foreground/80">
                    {graphEdges.filter((e) => e.from === selected.id).length}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 text-primary">inbound</span>
                  <span className="text-foreground/80">
                    {graphEdges.filter((e) => e.to === selected.id).length}
                  </span>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {moduleStats.map((m) => (
                  <div key={m.module} className="flex items-center gap-3 px-4 py-2.5 text-[12px]">
                    <span className="font-mono text-foreground">{m.module}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted">
                      {m.dependents} in / {m.dependencies} out
                    </span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 font-mono text-[10px] ring-1",
                        m.coupling === "high"
                          ? "bg-high/15 text-high ring-high/25"
                          : m.coupling === "medium"
                            ? "bg-medium/15 text-medium ring-medium/25"
                            : "bg-foreground/[0.05] text-muted ring-border",
                      )}
                    >
                      {m.coupling}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel>
            <PanelHeader title="Structural notes" />
            <ul className="space-y-3 p-4">
              {architectureNotes.map((note) => (
                <li key={note} className="flex gap-2.5 text-[12px] leading-[1.6] text-muted">
                  <span className="font-mono text-primary">·</span>
                  {note}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
