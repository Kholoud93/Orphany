import { Link } from "@tanstack/react-router";
import { ArrowUpRight, DollarSign, HeartHandshake, Megaphone, Users } from "lucide-react";
import { useOrphanyStore } from "@/context/orphany-store";
import { ProgressBar } from "@/components/orphany/ProgressBar";
import { StatCard } from "@/components/orphany/StatCard";
import { StatusBadge } from "@/components/orphany/StatusBadge";

export function AdminBento() {
  const { campaigns, events, donations, notifications, orphans } = useOrphanyStore();
  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0) + 84120;
  const sponsored = orphans.filter((orphan) => orphan.status === "Sponsored").length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:auto-rows-[minmax(11rem,auto)]">
      <StatCard
        label="Total orphans"
        value={String(orphans.length)}
        delta="+2 this month"
        icon={Users}
      />
      <StatCard
        label="Total donations"
        value={`$${totalDonations.toLocaleString()}`}
        delta="+18% MoM"
        icon={DollarSign}
        tone="accent"
      />
      <StatCard
        label="Active sponsorships"
        value={String(sponsored)}
        delta="92% retention"
        icon={HeartHandshake}
      />
      <StatCard
        label="Live campaigns"
        value={String(campaigns.length)}
        delta="2 ending soon"
        icon={Megaphone}
        tone="warning"
      />

      <section className="min-w-0 rounded-2xl border bg-card p-5 shadow-sm md:col-span-2 xl:col-span-3 xl:row-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Campaign progress</h2>
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id}>
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <StatusBadge tone="accent">{campaign.category}</StatusBadge>
                  <span className="truncate font-medium">{campaign.name}</span>
                </div>
              </div>
              <ProgressBar value={campaign.raised} max={campaign.goal} tone="accent" />
            </div>
          ))}
        </div>
      </section>

      <section className="min-w-0 rounded-2xl border bg-sidebar p-5 text-sidebar-foreground shadow-sm md:col-span-2 xl:col-span-1 xl:row-span-2">
        <h2 className="font-display text-lg font-semibold">Recent activity</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="flex gap-3 border-b border-sidebar-border pb-3 last:border-0"
            >
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sidebar-primary" />
              <div className="min-w-0">
                <div className="font-medium">{notification.title}</div>
                <div className="text-xs text-sidebar-foreground/70">{notification.body}</div>
                <div className="mt-1 text-xs text-sidebar-foreground/50">{notification.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="min-w-0 rounded-2xl border bg-card p-5 shadow-sm md:col-span-1 xl:col-span-2">
        <h2 className="mb-3 font-display text-lg font-semibold">Orphans needing sponsors</h2>
        <ul className="space-y-2">
          {orphans
            .filter((orphan) => orphan.status !== "Sponsored")
            .slice(0, 4)
            .map((orphan) => (
              <li key={orphan.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
                <img
                  src={orphan.image}
                  alt={orphan.name}
                  loading="lazy"
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{orphan.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      ${orphan.raised}/${orphan.monthlyCost}
                    </span>
                  </div>
                  <div className="mt-1">
                    <ProgressBar value={orphan.raised} max={orphan.monthlyCost} />
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </section>

      <section className="min-w-0 rounded-2xl border bg-card p-5 shadow-sm md:col-span-1 xl:col-span-2">
        <h2 className="mb-3 font-display text-lg font-semibold">Upcoming dates</h2>
        <ul className="space-y-3 text-sm">
          {events.slice(0, 4).map((event) => (
            <li key={event.id} className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-primary-soft/30 text-primary">
                <span className="text-[10px] font-medium uppercase">
                  {new Date(event.date).toLocaleString("en", { month: "short" })}
                </span>
                <span className="font-display text-sm font-bold">
                  {new Date(event.date).getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{event.title}</div>
                <div className="text-xs capitalize text-muted-foreground">{event.kind}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
