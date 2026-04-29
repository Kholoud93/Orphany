import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bell, CalendarClock, DollarSign, HeartHandshake } from "lucide-react";
import { notifications, myDonations, orphans } from "@/data/orphany";
import { DonationHistoryList } from "@/components/orphany/DonationHistoryList";
import { ProgressBar } from "@/components/orphany/ProgressBar";
import { StatCard } from "@/components/orphany/StatCard";
import { StatusBadge } from "@/components/orphany/StatusBadge";

export function DonorBento() {
  const sponsoredCount = 2;
  const totalGiven = myDonations
    .filter((donation) => donation.status === "Completed")
    .reduce((sum, donation) => sum + donation.amount, 0);
  const upcoming = myDonations.filter((donation) => donation.status === "Upcoming");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:auto-rows-[minmax(0,11rem)]">
      <section className="rounded-2xl border bg-gradient-to-br from-primary to-primary-soft p-6 text-primary-foreground shadow-sm md:col-span-2 xl:row-span-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider opacity-80">
          <HeartHandshake className="h-3.5 w-3.5" /> Your impact
        </div>
        <div className="mt-3 font-display text-4xl font-semibold tabular-nums sm:text-5xl">
          ${totalGiven}
        </div>
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
        <Link
          to="/orphans"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/25"
        >
          Sponsor someone new <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <StatCard
        label="This month"
        value="$160"
        delta="2 sponsorships"
        icon={DollarSign}
        tone="accent"
      />
      <StatCard
        label="Upcoming"
        value={`$${upcoming.reduce((sum, donation) => sum + donation.amount, 0)}`}
        delta={`${upcoming.length} payments`}
        icon={CalendarClock}
        tone="warning"
      />

      <section className="rounded-2xl border bg-card p-5 shadow-sm md:col-span-1 xl:col-span-2">
        <h2 className="mb-3 font-display text-lg font-semibold">Your sponsored orphans</h2>
        <ul className="space-y-2">
          {orphans.slice(0, 2).map((orphan) => (
            <li key={orphan.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
              <img
                src={orphan.image}
                alt={orphan.name}
                loading="lazy"
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium">
                    {orphan.name}, {orphan.age}
                  </span>
                  <StatusBadge tone="success">Active</StatusBadge>
                </div>
                <div className="mt-1.5">
                  <ProgressBar value={orphan.raised} max={orphan.monthlyCost} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm md:col-span-2 xl:col-span-2 xl:row-span-2">
        <h2 className="mb-3 font-display text-lg font-semibold">Donation history</h2>
        <DonationHistoryList donations={myDonations} />
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm md:col-span-2 xl:col-span-2">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
          <Bell className="h-4 w-4 text-primary" />
          Notifications
        </h2>
        <ul className="space-y-3 text-sm">
          {notifications.map((notification) => (
            <li key={notification.id} className="flex gap-3">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  notification.unread ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{notification.title}</div>
                <div className="text-xs text-muted-foreground">{notification.body}</div>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{notification.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
