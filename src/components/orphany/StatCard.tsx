import { type LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  tone?: "primary" | "accent" | "warning";
  className?: string;
};

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
  className = "",
}: Props) {
  const ring =
    tone === "accent"
      ? "bg-accent/10 text-accent"
      : tone === "warning"
        ? "bg-warning/20 text-foreground"
        : "bg-primary/10 text-primary";
  return (
    <div
      className={`min-w-0 flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${ring}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <div className="mt-3">
        <div className="wrap-break-word font-display text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
          {value}
        </div>
        {delta && <div className="mt-1 text-xs text-accent">{delta}</div>}
      </div>
    </div>
  );
}
