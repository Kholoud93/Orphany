import { Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, MapPin } from "lucide-react";
import { useState } from "react";
import { ProgressBar } from "@/components/orphany/ProgressBar";
import { StatusBadge } from "@/components/orphany/StatusBadge";
import { SponsorDialog } from "@/components/orphans/SponsorDialog";
import { Button } from "@/components/ui/button";
import { orphans } from "@/data/orphany";

const statusTone = {
  Sponsored: "success",
  "Partially Funded": "warning",
  "Awaiting Sponsor": "danger",
} as const;

export function OrphanDetailsPage({ orphanId }: { orphanId: string }) {
  const orphan = orphans.find((entry) => entry.id === orphanId) ?? null;
  const [isSponsorOpen, setIsSponsorOpen] = useState(false);

  if (!orphan) {
    return (
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="font-display text-2xl font-semibold">Orphan not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested profile does not exist or may have been removed.
        </p>
        <Button asChild className="mt-4">
          <Link to="/orphans">
            <ArrowLeft className="h-4 w-4" /> Back to orphans
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/orphans">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-6 rounded-2xl border bg-card p-5 shadow-sm md:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-xl bg-muted">
          <img
            src={orphan.image}
            alt={orphan.name}
            width={640}
            height={640}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight">{orphan.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">Age {orphan.age}</p>
            </div>
            <StatusBadge tone={statusTone[orphan.status]}>{orphan.status}</StatusBadge>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {orphan.location}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{orphan.story}</p>

          <div className="space-y-2 rounded-xl border p-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Monthly support</span>
              <span className="font-display text-lg font-semibold">${orphan.monthlyCost}</span>
            </div>
            <ProgressBar value={orphan.raised} max={orphan.monthlyCost} />
            <div className="text-xs text-muted-foreground">
              ${orphan.raised} raised of ${orphan.monthlyCost}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {orphan.needs.map((need) => (
              <span key={need} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                {need}
              </span>
            ))}
          </div>

          <Button onClick={() => setIsSponsorOpen(true)} className="w-full sm:w-auto">
            <Heart className="h-4 w-4" /> Sponsor this child
          </Button>
        </div>
      </section>

      {isSponsorOpen && <SponsorDialog orphan={orphan} onClose={() => setIsSponsorOpen(false)} />}
    </div>
  );
}
