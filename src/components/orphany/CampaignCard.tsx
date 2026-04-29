import type { Campaign } from "@/data/orphany";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

export function CampaignCard({ campaign, onDonate }: { campaign: Campaign; onDonate?: (c: Campaign) => void }) {
  const daysLeft = Math.max(0, Math.round((new Date(campaign.endsAt).getTime() - Date.now()) / 86400000));
  const isGoalReached = campaign.raised >= campaign.goal;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <StatusBadge tone="accent">{campaign.category}</StatusBadge>
          <h3 className="mt-2 font-display text-xl font-semibold">{campaign.name}</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          {daysLeft}d left
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{campaign.description}</p>
      <ProgressBar value={campaign.raised} max={campaign.goal} tone="accent" />
      <Button
        onClick={() => onDonate?.(campaign)}
        disabled={isGoalReached}
        variant={isGoalReached ? "secondary" : "default"}
        className="w-full"
      >
        {isGoalReached ? "Goal reached" : "Donate now"}
      </Button>
    </article>
  );
}
