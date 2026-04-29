import { useState } from "react";
import { DonationHistoryList } from "@/components/orphany/DonationHistoryList";
import { StatusBadge } from "@/components/orphany/StatusBadge";
import { Button } from "@/components/ui/button";
import { useOrphanyStore } from "@/context/orphany-store";
import { useRole } from "@/hooks/use-role";

export function ProfilePage() {
  const [role] = useRole();
  const {
    profile,
    campaigns,
    donations,
    orphans,
    notificationPreferences,
    setNotificationPreference,
    updateProfile,
  } = useOrphanyStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const total = donations
    .filter((donation) => donation.status === "Completed")
    .reduce((sum, donation) => sum + donation.amount, 0);
  const sponsoredOrphans = orphans.filter((orphan) => orphan.status === "Sponsored" || orphan.raised > 0);
  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-linear-to-br from-primary to-primary-soft p-6 text-primary-foreground shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 font-display text-2xl font-semibold backdrop-blur">
            {initials || "U"}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-semibold">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-sm capitalize opacity-90">
              {role} · Member since {profile.memberSince}
            </p>
          </div>
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => setIsEditOpen(true)}
          >
            Edit profile
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ProfileStat label="Given" value={`$${total}`} />
          <ProfileStat label="Sponsored" value={String(sponsoredOrphans.length)} />
          <ProfileStat label="Campaigns" value={String(campaigns.length)} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Sponsored orphans</h2>
          <ul className="mt-3 space-y-2">
            {sponsoredOrphans.slice(0, 2).map((orphan) => (
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
          <DonationHistoryList donations={donations} className="mt-3" />
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Notification preferences</h2>
          <div className="mt-3 space-y-3">
            {notificationPreferences.map((preference) => (
              <label
                key={preference.id}
                className="flex flex-col gap-2 rounded-xl border p-3 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm">{preference.label}</span>
                <input
                  type="checkbox"
                  checked={preference.on}
                  onChange={(event) => setNotificationPreference(preference.id, event.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
              </label>
            ))}
          </div>
        </section>
      </div>

      {isEditOpen && (
        <EditProfileDialog
          profile={profile}
          onClose={() => setIsEditOpen(false)}
          onSave={(nextProfile) => {
            updateProfile(nextProfile);
            setIsEditOpen(false);
          }}
        />
      )}
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

function EditProfileDialog({
  profile,
  onClose,
  onSave,
}: {
  profile: { firstName: string; lastName: string; email: string; bio: string };
  onClose: () => void;
  onSave: (payload: { firstName: string; lastName: string; email: string; bio: string }) => void;
}) {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);

  const canSave = firstName.trim().length > 1 && lastName.trim().length > 1 && email.includes("@");

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
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            Last name
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="grid gap-1.5 text-sm sm:col-span-2">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
          <label className="grid gap-1.5 text-sm sm:col-span-2">
            Bio
            <textarea
              rows={3}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!canSave}
            onClick={() =>
              onSave({
                firstName,
                lastName,
                email,
                bio,
              })
            }
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
