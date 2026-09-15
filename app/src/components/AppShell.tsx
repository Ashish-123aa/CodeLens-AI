import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", glyph: "◈", label: "Overview" },
  { to: "/dashboard", glyph: "◇", label: "Dashboard" },
  { to: "/explorer", glyph: "▣", label: "Explorer" },
  { to: "/ask", glyph: "❯_", label: "Ask Your Code" },
  { to: "/analysis", glyph: "☰", label: "Analysis" },
  { to: "/architecture", glyph: "⬡", label: "Architecture" },
  { to: "/import", glyph: "↥", label: "Import" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-[220px] shrink-0 flex-col gap-0.5 border-r border-border px-3 py-4 lg:flex">
        <div className="flex items-center gap-2 px-2 pt-1 pb-4">
          <div className="grid size-6 place-items-center rounded-md bg-primary font-mono text-[11px] font-semibold text-primary-foreground">
            CL
          </div>
          <span className="text-sm font-semibold tracking-tight">
            CodeLens <span className="font-mono text-[11px] text-muted">AI</span>
          </span>
        </div>
        <div className="px-2 pb-2 font-mono text-[10px] tracking-[0.18em] text-muted/60 uppercase">
          Workspace
        </div>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-muted transition-colors hover:bg-foreground/[0.04] data-[status=active]:bg-foreground/[0.06] data-[status=active]:font-medium data-[status=active]:text-foreground"
          >
            <span className="w-4 font-mono text-[11px]">{item.glyph}</span>
            {item.label}
          </Link>
        ))}
        <div className="mt-auto flex items-center gap-2.5 border-t border-border px-2 pt-4">
          <div className="grid size-7 place-items-center rounded-full bg-foreground/10 font-mono text-[10px] text-muted">
            AK
          </div>
          <div className="leading-tight">
            <div className="text-[12px] font-medium">A. Kess</div>
            <div className="font-mono text-[10px] text-muted">pro · 3 repos</div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <nav className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="shrink-0 rounded-md px-2.5 py-1.5 text-[12px] whitespace-nowrap text-muted data-[status=active]:bg-foreground/[0.06] data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
