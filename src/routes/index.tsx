import { createFileRoute, Link } from "@tanstack/react-router";
import { useRole } from "@/lib/role-store";
import { orphans, campaigns, myDonations, notifications, events } from "@/data/orphany";
import { StatCard } from "@/components/orphany/StatCard";
import { ProgressBar } from "@/components/orphany/ProgressBar";
import { StatusBadge } from "@/components/orphany/StatusBadge";
import { Users, HeartHandshake, DollarSign, Megaphone, CalendarClock, Bell, ArrowUpRight, Sparkles, ClipboardList, NotebookPen } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — Orphany" }, { name: "description", content: "Your Orphany dashboard at a glance." }] }),
  component: Dashboard,
});

function Dashboard() {
  const [role] = useRole();
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {role === "admin" ? "Admin overview" : role === "volunteer" ? "Volunteer hub" : "Your impact today"}
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {role === "admin" ? "12 actions waiting" : role === "volunteer" ? "3 orphans assigned" : "2 sponsorships active"}
        </div>
      </header>

      {role === "admin" && <AdminBento />}
      {role === "donor" && <DonorBento />}
      {role === "volunteer" && <VolunteerBento />}
    </div>
  );
}

function AdminBento() {
  const totalDonations = myDonations.reduce((s, d) => s + d.amount, 0) + 84120;
  const sponsored = orphans.filter((o) => o.status === "Sponsored").length;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[minmax(0,11rem)]">
      <StatCard label="Total orphans" value={String(orphans.length)} delta="+2 this month" icon={Users} />
      <StatCard label="Total donations" value={`$${totalDonations.toLocaleString()}`} delta="+18% MoM" icon={DollarSign} tone="accent" />
      <StatCard label="Active sponsorships" value={String(sponsored)} delta="92% retention" icon={HeartHandshake} />
      <StatCard label="Live campaigns" value={String(campaigns.length)} delta="2 ending soon" icon={Megaphone} tone="warning" />

      <section className="md:col-span-3 md:row-span-2 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Campaign progress</h2>
          <Link to="/campaigns" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="space-y-4">
          {campaigns.map((c) => (
            <div key={c.id}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StatusBadge tone="accent">{c.category}</StatusBadge>
                  <span className="font-medium">{c.name}</span>
                </div>
              </div>
              <ProgressBar value={c.raised} max={c.goal} tone="accent" />
            </div>
          ))}
        </div>
      </section>

      <section className="md:row-span-2 rounded-2xl border bg-sidebar p-5 text-sidebar-foreground shadow-sm">
        <h2 className="font-display text-lg font-semibold">Recent activity</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {notifications.map((n) => (
            <li key={n.id} className="flex gap-3 border-b border-sidebar-border pb-3 last:border-0">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sidebar-primary" />
              <div>
                <div className="font-medium">{n.title}</div>
                <div className="text-sidebar-foreground/70 text-xs">{n.body}</div>
                <div className="mt-1 text-xs text-sidebar-foreground/50">{n.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="md:col-span-2 rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="mb-3 font-display text-lg font-semibold">Orphans needing sponsors</h2>
        <ul className="space-y-2">
          {orphans.filter((o) => o.status !== "Sponsored").slice(0, 4).map((o) => (
            <li key={o.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
              <img src={o.image} alt={o.name} loading="lazy" className="h-10 w-10 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{o.name}</span>
                  <span className="text-xs text-muted-foreground">${o.raised}/${o.monthlyCost}</span>
                </div>
                <div className="mt-1"><ProgressBar value={o.raised} max={o.monthlyCost} /></div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="md:col-span-2 rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="mb-3 font-display text-lg font-semibold">Upcoming dates</h2>
        <ul className="space-y-3 text-sm">
          {events.slice(0, 4).map((e) => (
            <li key={e.id} className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-primary-soft/30 text-primary">
                <span className="text-[10px] font-medium uppercase">{new Date(e.date).toLocaleString("en", { month: "short" })}</span>
                <span className="font-display text-sm font-bold">{new Date(e.date).getDate()}</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">{e.title}</div>
                <div className="text-xs text-muted-foreground capitalize">{e.kind}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function DonorBento() {
  const sponsoredCount = 2;
  const totalGiven = myDonations.filter((d) => d.status === "Completed").reduce((s, d) => s + d.amount, 0);
  const upcoming = myDonations.filter((d) => d.status === "Upcoming");
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[minmax(0,11rem)]">
      <section className="md:col-span-2 md:row-span-2 rounded-2xl border bg-gradient-to-br from-primary to-primary-soft p-6 text-primary-foreground shadow-sm">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider opacity-80">
          <HeartHandshake className="h-3.5 w-3.5" /> Your impact
        </div>
        <div className="mt-3 font-display text-5xl font-semibold tabular-nums">${totalGiven}</div>
        <div className="mt-1 text-sm opacity-90">given across {myDonations.length} donations</div>
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/15 p-3 backdrop-blur">
            <div className="text-xs opacity-80">Sponsored</div>
            <div className="font-display text-2xl font-semibold">{sponsoredCount}</div>
          </div>
          <div className="rounded-xl bg-white/15 p-3 backdrop-blur">
            <div className="text-xs opacity-80">Campaigns</div>
            <div className="font-display text-2xl font-semibold">3</div>
          </div>
        </div>
        <Link to="/orphans" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/25">
          Sponsor someone new <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <StatCard label="This month" value="$160" delta="2 sponsorships" icon={DollarSign} tone="accent" />
      <StatCard label="Upcoming" value={`$${upcoming.reduce((s, d) => s + d.amount, 0)}`} delta={`${upcoming.length} payments`} icon={CalendarClock} tone="warning" />

      <section className="md:col-span-2 rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="mb-3 font-display text-lg font-semibold">Your sponsored orphans</h2>
        <ul className="space-y-2">
          {orphans.slice(0, 2).map((o) => (
            <li key={o.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
              <img src={o.image} alt={o.name} loading="lazy" className="h-12 w-12 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{o.name}, {o.age}</span>
                  <StatusBadge tone="success">Active</StatusBadge>
                </div>
                <div className="mt-1.5"><ProgressBar value={o.raised} max={o.monthlyCost} /></div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="md:col-span-2 md:row-span-2 rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="mb-3 font-display text-lg font-semibold">Donation history</h2>
        <ul className="divide-y">
          {myDonations.map((d) => (
            <li key={d.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <div className="font-medium">{d.target}</div>
                <div className="text-xs text-muted-foreground">{d.type} · {new Date(d.date).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge tone={d.status === "Completed" ? "success" : d.status === "Upcoming" ? "warning" : "neutral"}>{d.status}</StatusBadge>
                <span className="font-display text-base font-semibold tabular-nums">${d.amount}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="md:col-span-2 rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold"><Bell className="h-4 w-4 text-primary" />Notifications</h2>
        <ul className="space-y-3 text-sm">
          {notifications.map((n) => (
            <li key={n.id} className="flex gap-3">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-primary" : "bg-muted-foreground/30"}`} />
              <div className="flex-1">
                <div className="font-medium">{n.title}</div>
                <div className="text-xs text-muted-foreground">{n.body}</div>
              </div>
              <span className="text-xs text-muted-foreground">{n.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function VolunteerBento() {
  const assigned = orphans.slice(0, 3);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(0,11rem)]">
      <StatCard label="Assigned orphans" value={String(assigned.length)} delta="2 visits this week" icon={Users} />
      <StatCard label="Notes added" value="14" delta="+3 this week" icon={NotebookPen} tone="accent" />
      <StatCard label="Open tasks" value="5" delta="2 due today" icon={ClipboardList} tone="warning" />

      <section className="md:col-span-2 md:row-span-2 rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="mb-3 font-display text-lg font-semibold">My assigned orphans</h2>
        <ul className="space-y-3">
          {assigned.map((o) => (
            <li key={o.id} className="flex items-start gap-3 rounded-xl border p-3">
              <img src={o.image} alt={o.name} loading="lazy" className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{o.name}, {o.age}</div>
                  <StatusBadge tone={o.urgency === "High" ? "danger" : o.urgency === "Medium" ? "warning" : "success"}>{o.urgency}</StatusBadge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{o.story}</p>
                <div className="mt-2 flex gap-2">
                  <button className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90">Add note</button>
                  <button className="rounded-lg border px-3 py-1 text-xs font-medium hover:bg-muted">View profile</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="md:row-span-2 rounded-2xl border bg-sidebar p-5 text-sidebar-foreground shadow-sm">
        <h2 className="font-display text-lg font-semibold">Today's tasks</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {["Visit Yusuf — bring books", "Submit weekly report", "Photo update for Hana", "Coordinate medical check"].map((t, i) => (
            <li key={i} className="flex items-start gap-2 border-b border-sidebar-border pb-3 last:border-0">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-sidebar-primary" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
