export function ScoreBar({ label, value }: { label: string; value: number }) {
  const tone = value >= 85 ? "bg-primary" : value >= 75 ? "bg-medium" : "bg-high";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12px] text-foreground">{label}</span>
        <span className="font-mono text-[12px] text-foreground">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-foreground/[0.08]">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
