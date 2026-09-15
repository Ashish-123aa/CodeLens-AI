export interface Stat {
  label: string;
  value: string;
}

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-background p-3.5">
          <div className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
            {stat.label}
          </div>
          <div className="mt-1 font-mono text-xl text-foreground">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
