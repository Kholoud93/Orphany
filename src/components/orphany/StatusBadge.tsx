type Props = { children: React.ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "accent" };

export function StatusBadge({ children, tone = "neutral" }: Props) {
  const styles: Record<string, string> = {
    neutral: "bg-muted text-foreground/80 border-border",
    success: "bg-accent-soft text-accent-foreground/90 border-accent/20",
    warning: "bg-warning/20 text-foreground border-warning/40",
    danger: "bg-destructive/10 text-destructive border-destructive/30",
    accent: "bg-primary-soft/30 text-primary border-primary/30",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}
