import type { Orphan } from "@/data/orphany";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin } from "lucide-react";

const statusTone = {
  Sponsored: "success",
  "Partially Funded": "warning",
  "Awaiting Sponsor": "danger",
} as const;

export function OrphanCard({ orphan, onSponsor }: { orphan: Orphan; onSponsor?: (o: Orphan) => void }) {
  const isFullySponsored = orphan.status === "Sponsored" || orphan.raised >= orphan.monthlyCost;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={orphan.image}
          alt={orphan.name}
          loading="lazy"
          width={512}
          height={512}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge tone={statusTone[orphan.status]}>{orphan.status}</StatusBadge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-lg font-semibold">{orphan.name}</h3>
            <span className="text-sm text-muted-foreground">Age {orphan.age}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {orphan.location}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{orphan.story}</p>
        <div className="flex flex-wrap gap-1.5">
          {orphan.needs.map((n) => (
            <span key={n} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{n}</span>
          ))}
        </div>
        <ProgressBar value={orphan.raised} max={orphan.monthlyCost} />
        <Button
          onClick={() => onSponsor?.(orphan)}
          disabled={isFullySponsored}
          variant={isFullySponsored ? "secondary" : "default"}
          className="mt-1 w-full gap-2"
        >
          <Heart className="h-4 w-4" />
          {isFullySponsored ? "Fully sponsored" : `Sponsor — $${orphan.monthlyCost}/mo`}
        </Button>
      </div>
    </article>
  );
}
