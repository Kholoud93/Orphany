import { useState } from "react";
import { Plus } from "lucide-react";
import { DonateDialog } from "@/components/campaigns/DonateDialog";
import { CampaignCard } from "@/components/orphany/CampaignCard";
import { Button } from "@/components/ui/button";
import { campaigns, type Campaign } from "@/data/orphany";
import { useRole } from "@/hooks/use-role";

const categories = ["All", "Ramadan", "Education", "Medical", "Emergency"] as const;

export function CampaignsPage() {
  const [role] = useRole();
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [donating, setDonating] = useState<Campaign | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const campaignList =
    category === "All" ? campaigns : campaigns.filter((campaign) => campaign.category === category);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Campaigns
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pool donations toward time-sensitive causes.
          </p>
        </div>

        {role === "admin" && (
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" /> New campaign
          </Button>
        )}
      </header>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setCategory(value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              category === value
                ? "bg-primary text-primary-foreground"
                : "border bg-card text-foreground/70 hover:bg-muted"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {campaignList.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} onDonate={setDonating} />
        ))}
      </div>

      {donating && <DonateDialog campaign={donating} onClose={() => setDonating(null)} />}
      {isCreateOpen && <CreateCampaignDialog onClose={() => setIsCreateOpen(false)} />}
    </div>
  );
}

function CreateCampaignDialog({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="font-display text-xl font-semibold">Create campaign</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Draft a campaign with its goal and closing date.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm sm:col-span-2">
            Campaign title
            <input
              type="text"
              placeholder="Ramadan family support"
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            Goal ($)
            <input
              type="number"
              placeholder="50000"
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            End date
            <input
              type="date"
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="grid gap-1.5 text-sm sm:col-span-2">
            Description
            <textarea
              rows={3}
              placeholder="Describe campaign impact..."
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save draft</Button>
        </div>
      </div>
    </div>
  );
}
