import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { orphans, type Orphan } from "@/data/orphany";
import { OrphanCard } from "@/components/orphany/OrphanCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRole } from "@/lib/role-store";

export const Route = createFileRoute("/orphans")({
  head: () => ({ meta: [{ title: "Orphans — Orphany" }, { name: "description", content: "Browse and sponsor orphans." }] }),
  component: OrphansPage,
});

const ages = ["All", "0–6", "7–10", "11+"] as const;
const statuses = ["All", "Awaiting Sponsor", "Partially Funded", "Sponsored"] as const;
const urgencies = ["All", "High", "Medium", "Low"] as const;

function OrphansPage() {
  const [role] = useRole();
  const [age, setAge] = useState<(typeof ages)[number]>("All");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [urgency, setUrgency] = useState<(typeof urgencies)[number]>("All");
  const [selected, setSelected] = useState<Orphan | null>(null);

  const filtered = useMemo(() => orphans.filter((o) => {
    const inAge = age === "All" || (age === "0–6" ? o.age <= 6 : age === "7–10" ? o.age >= 7 && o.age <= 10 : o.age >= 11);
    const inStatus = status === "All" || o.status === status;
    const inUrg = urgency === "All" || o.urgency === urgency;
    return inAge && inStatus && inUrg;
  }), [age, status, urgency]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Orphans</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} of {orphans.length} children · sponsor or contribute partially.</p>
        </div>
        {role === "admin" && (
          <Button className="gap-2"><Plus className="h-4 w-4" /> Add orphan</Button>
        )}
      </header>

      <div className="flex flex-wrap gap-4 rounded-2xl border bg-card p-4">
        <FilterGroup label="Age" options={ages as unknown as string[]} value={age} onChange={(v) => setAge(v as typeof age)} />
        <FilterGroup label="Status" options={statuses as unknown as string[]} value={status} onChange={(v) => setStatus(v as typeof status)} />
        <FilterGroup label="Urgency" options={urgencies as unknown as string[]} value={urgency} onChange={(v) => setUrgency(v as typeof urgency)} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((o) => (
          <OrphanCard key={o.id} orphan={o} onSponsor={setSelected} />
        ))}
      </div>

      {selected && <SponsorDialog orphan={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              value === o ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70 hover:bg-muted/70"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function SponsorDialog({ orphan, onClose }: { orphan: Orphan; onClose: () => void }) {
  const [mode, setMode] = useState<"full" | "partial">("full");
  const [amount, setAmount] = useState(Math.max(10, Math.round(orphan.monthlyCost / 4)));
  const value = mode === "full" ? orphan.monthlyCost : amount;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm md:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <img src={orphan.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
          <div>
            <h3 className="font-display text-xl font-semibold">Sponsor {orphan.name}</h3>
            <p className="text-sm text-muted-foreground">{orphan.location} · ${orphan.monthlyCost}/month</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
          <button onClick={() => setMode("full")} className={`rounded-lg py-2 text-sm font-medium ${mode === "full" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>Full sponsorship</button>
          <button onClick={() => setMode("partial")} className={`rounded-lg py-2 text-sm font-medium ${mode === "partial" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>Partial</button>
        </div>

        {mode === "partial" && (
          <div className="mt-4">
            <label className="text-sm text-muted-foreground">Monthly amount</label>
            <input
              type="range" min={5} max={orphan.monthlyCost} value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
            <div className="mt-1 text-right font-display text-lg font-semibold tabular-nums">${amount}/mo</div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">You'll contribute</div>
            <div className="font-display text-2xl font-semibold">${value}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Confirm</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
