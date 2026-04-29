import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { campaigns, type Campaign } from "@/data/orphany";
import { CampaignCard } from "@/components/orphany/CampaignCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRole } from "@/lib/role-store";

export const Route = createFileRoute("/campaigns")({
  head: () => ({ meta: [{ title: "Campaigns — Orphany" }, { name: "description", content: "Support our active charity campaigns." }] }),
  component: CampaignsPage,
});

const cats = ["All", "Ramadan", "Education", "Medical", "Emergency"] as const;

function CampaignsPage() {
  const [role] = useRole();
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const [donating, setDonating] = useState<Campaign | null>(null);
  const list = cat === "All" ? campaigns : campaigns.filter((c) => c.category === cat);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Campaigns</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pool donations toward time-sensitive causes.</p>
        </div>
        {role === "admin" && (
          <Button className="gap-2"><Plus className="h-4 w-4" /> New campaign</Button>
        )}
      </header>

      <div className="flex flex-wrap gap-1.5">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              cat === c ? "bg-primary text-primary-foreground" : "bg-card border text-foreground/70 hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => <CampaignCard key={c.id} campaign={c} onDonate={setDonating} />)}
      </div>

      {donating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setDonating(null)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-semibold">Donate to {donating.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{donating.description}</p>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {[25, 50, 100, 250].map((v) => (
                <button key={v} className="rounded-xl border bg-muted py-2 font-display font-semibold hover:bg-primary hover:text-primary-foreground">${v}</button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border px-3">
              <span className="text-muted-foreground">$</span>
              <input type="number" placeholder="Other amount" className="flex-1 bg-transparent py-2.5 outline-none" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDonating(null)}>Cancel</Button>
              <Button onClick={() => setDonating(null)}>Donate</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
