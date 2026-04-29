type Props = { value: number; max: number; tone?: "primary" | "accent" | "warning" };

export function ProgressBar({ value, max, tone = "primary" }: Props) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  const bar =
    tone === "accent" ? "bg-accent" : tone === "warning" ? "bg-warning" : "bg-primary";
  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${bar} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-muted-foreground tabular-nums">
        <span className="font-medium text-foreground">{pct}%</span>
        <span>${value.toLocaleString()} / ${max.toLocaleString()}</span>
      </div>
    </div>
  );
}
