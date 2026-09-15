import type { TreeNode } from "@/data/files";
import { cn } from "@/lib/utils";

export function FileTree({
  nodes,
  activePath,
  onSelect,
  depth = 0,
}: {
  nodes: TreeNode[];
  activePath: string;
  onSelect: (path: string) => void;
  depth?: number;
}) {
  return (
    <div className="space-y-0.5">
      {nodes.map((node) => (
        <div key={node.path}>
          {node.type === "dir" ? (
            <div
              className="flex items-center gap-1.5 py-1 font-mono text-[11px] text-muted"
              style={{ paddingLeft: depth * 12 + 4 }}
            >
              <span aria-hidden>▾</span>
              {node.name}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onSelect(node.path)}
              style={{ paddingLeft: depth * 12 + 4 }}
              className={cn(
                "flex w-full items-center gap-1.5 rounded py-1 pr-2 text-left font-mono text-[11px] transition-colors",
                node.path === activePath
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-foreground/[0.04] hover:text-foreground",
              )}
            >
              <span aria-hidden className="opacity-50">
                ·
              </span>
              {node.name}
            </button>
          )}
          {node.children ? (
            <FileTree
              nodes={node.children}
              activePath={activePath}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
