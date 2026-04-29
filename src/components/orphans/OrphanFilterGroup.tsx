type OrphanFilterGroupProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export function OrphanFilterGroup({ label, options, value, onChange }: OrphanFilterGroupProps) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              value === option
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground/70 hover:bg-muted/70"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
