import { useState } from "react";
import { DonationHistoryList } from "@/components/orphany/DonationHistoryList";
import { StatusBadge } from "@/components/orphany/StatusBadge";
import { Button } from "@/components/ui/button";
import { myDonations, orphans } from "@/data/orphany";
import { useRole } from "@/hooks/use-role";

const notificationPreferences = [
  { label: "Monthly sponsorship reminders", on: true },
  { label: "Updates from sponsored orphans", on: true },
  { label: "New campaigns and milestones", on: false },
  { label: "Tax receipts by email", on: true },
];

export function ProfilePage() {
  const [role] = useRole();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const total = myDonations
    .filter((donation) => donation.status === "Completed")
    .reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-gradient-to-br from-primary to-primary-soft p-6 text-primary-foreground shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 font-display text-2xl font-semibold backdrop-blur">
            SA
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-semibold">Sara Ahmed</h1>
            <p className="text-sm capitalize opacity-90">{role} · Member since 2024</p>
          </div>
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setIsEditOpen(true)}>
            Edit profile
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ProfileStat label="Given" value={`$${total}`} />
          <ProfileStat label="Sponsored" value="2" />
          <ProfileStat label="Campaigns" value="3" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Sponsored orphans</h2>
          <ul className="mt-3 space-y-2">
            {orphans.slice(0, 2).map((orphan) => (
              <li key={orphan.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
                <img
                  src={orphan.image}
                  alt={orphan.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">
                    {orphan.name}, {orphan.age}
                  </div>
                  <div className="text-xs text-muted-foreground">{orphan.location}</div>
                </div>
                <StatusBadge tone="success">Active</StatusBadge>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Donation history</h2>
          <DonationHistoryList donations={myDonations} className="mt-3" />
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Notification preferences</h2>
          <div className="mt-3 space-y-3">
            {notificationPreferences.map((preference) => (
              <label
                key={preference.label}
                className="flex flex-col gap-2 rounded-xl border p-3 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm">{preference.label}</span>
                <input
                  type="checkbox"
                  defaultChecked={preference.on}
                  className="h-4 w-4 accent-primary"
                />
              </label>
            ))}
          </div>
        </section>
      </div>

      {isEditOpen && <EditProfileDialog onClose={() => setIsEditOpen(false)} />}
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/15 p-3 backdrop-blur">
      <div className="text-xs opacity-80">{label}</div>
      <div className="font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}

function EditProfileDialog({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="font-display text-xl font-semibold">Edit profile</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your visible profile details and contact preferences.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm">
            First name
            <input
              type="text"
              defaultValue="Sara"
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            Last name
            <input
              type="text"
              defaultValue="Ahmed"
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="grid gap-1.5 text-sm sm:col-span-2">
            Email
            <input
              type="email"
              defaultValue="sara.ahmed@example.com"
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="grid gap-1.5 text-sm sm:col-span-2">
            Bio
            <textarea
              rows={3}
              defaultValue="Passionate about education-focused sponsorship."
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}
