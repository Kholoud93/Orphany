import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { OrphanCard } from "@/components/orphany/OrphanCard";
import { OrphanFilterGroup } from "@/components/orphans/OrphanFilterGroup";
import { SponsorDialog } from "@/components/orphans/SponsorDialog";
import { Button } from "@/components/ui/button";
import { orphans, type Orphan } from "@/data/orphany";
import { useRole } from "@/hooks/use-role";

const ages = ["All", "0–6", "7–10", "11+"] as const;
const statuses = ["All", "Awaiting Sponsor", "Partially Funded", "Sponsored"] as const;
const urgencies = ["All", "High", "Medium", "Low"] as const;

export function OrphansPage() {
  const [role] = useRole();
  const [age, setAge] = useState<(typeof ages)[number]>("All");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [urgency, setUrgency] = useState<(typeof urgencies)[number]>("All");
  const [selected, setSelected] = useState<Orphan | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filtered = useMemo(
    () =>
      orphans.filter((orphan) => {
        const inAge =
          age === "All" ||
          (age === "0–6"
            ? orphan.age <= 6
            : age === "7–10"
              ? orphan.age >= 7 && orphan.age <= 10
              : orphan.age >= 11);
        const inStatus = status === "All" || orphan.status === status;
        const inUrgency = urgency === "All" || orphan.urgency === urgency;
        return inAge && inStatus && inUrgency;
      }),
    [age, status, urgency],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Orphans
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} of {orphans.length} children · sponsor or contribute partially.
          </p>
        </div>

        {role === "admin" && (
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" /> Add orphan
          </Button>
        )}
      </header>

      <div className="flex flex-wrap gap-3 rounded-2xl border bg-card p-4 sm:gap-4">
        <OrphanFilterGroup
          label="Age"
          options={ages as unknown as string[]}
          value={age}
          onChange={(value) => setAge(value as typeof age)}
        />
        <OrphanFilterGroup
          label="Status"
          options={statuses as unknown as string[]}
          value={status}
          onChange={(value) => setStatus(value as typeof status)}
        />
        <OrphanFilterGroup
          label="Urgency"
          options={urgencies as unknown as string[]}
          value={urgency}
          onChange={(value) => setUrgency(value as typeof urgency)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((orphan) => (
          <OrphanCard key={orphan.id} orphan={orphan} onSponsor={setSelected} />
        ))}
      </div>

      {selected && <SponsorDialog orphan={selected} onClose={() => setSelected(null)} />}
      {isCreateOpen && <CreateOrphanDialog onClose={() => setIsCreateOpen(false)} />}
    </div>
  );
}

function CreateOrphanDialog({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="font-display text-xl font-semibold">Add orphan profile</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a profile so sponsors can discover this child.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm">
            Full name
            <input
              type="text"
              placeholder="Amina K."
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            Age
            <input
              type="number"
              placeholder="8"
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="grid gap-1.5 text-sm sm:col-span-2">
            Location
            <input
              type="text"
              placeholder="Amman, Jordan"
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="grid gap-1.5 text-sm sm:col-span-2">
            Story
            <textarea
              rows={3}
              placeholder="Short background and current needs..."
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save profile</Button>
        </div>
      </div>
    </div>
  );
}
