import { createFileRoute } from "@tanstack/react-router";
import { useRole } from "@/lib/role-store";
import { myDonations, orphans } from "@/data/orphany";
import { StatusBadge } from "@/components/orphany/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Orphany" }, { name: "description", content: "Your Orphany profile and giving history." }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [role] = useRole();
  const total = myDonations.filter((d) => d.status === "Completed").reduce((s, d) => s + d.amount, 0);
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-gradient-to-br from-primary to-primary-soft p-6 text-primary-foreground shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 font-display text-2xl font-semibold backdrop-blur">SA</div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-semibold">Sara Ahmed</h1>
            <p className="text-sm opacity-90 capitalize">{role} · Member since 2024</p>
          </div>
          <Button variant="secondary">Edit profile</Button>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat label="Given" value={`$${total}`} />
          <Stat label="Sponsored" value="2" />
          <Stat label="Campaigns" value="3" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Sponsored orphans</h2>
          <ul className="mt-3 space-y-2">
            {orphans.slice(0, 2).map((o) => (
              <li key={o.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
                <img src={o.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="font-medium">{o.name}, {o.age}</div>
                  <div className="text-xs text-muted-foreground">{o.location}</div>
                </div>
                <StatusBadge tone="success">Active</StatusBadge>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Donation history</h2>
          <ul className="mt-3 divide-y">
            {myDonations.map((d) => (
              <li key={d.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <div className="font-medium">{d.target}</div>
                  <div className="text-xs text-muted-foreground">{d.type} · {new Date(d.date).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge tone={d.status === "Completed" ? "success" : d.status === "Upcoming" ? "warning" : "neutral"}>{d.status}</StatusBadge>
                  <span className="font-display font-semibold tabular-nums">${d.amount}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Notification preferences</h2>
          <div className="mt-3 space-y-3">
            {[
              { label: "Monthly sponsorship reminders", on: true },
              { label: "Updates from sponsored orphans", on: true },
              { label: "New campaigns and milestones", on: false },
              { label: "Tax receipts by email", on: true },
            ].map((p) => (
              <label key={p.label} className="flex items-center justify-between rounded-xl border p-3 hover:bg-muted/40">
                <span className="text-sm">{p.label}</span>
                <input type="checkbox" defaultChecked={p.on} className="h-4 w-4 accent-primary" />
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/15 p-3 backdrop-blur">
      <div className="text-xs opacity-80">{label}</div>
      <div className="font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}
