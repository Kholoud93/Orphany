import { Sparkles } from "lucide-react";
import type { Role } from "@/data/orphany";

type DashboardHeaderProps = {
  role: Role;
};

const roleTitle: Record<Role, string> = {
  admin: "Admin overview",
  donor: "Your impact today",
  volunteer: "Volunteer hub",
};

const roleMessage: Record<Role, string> = {
  admin: "12 actions waiting",
  donor: "2 sponsorships active",
  volunteer: "3 orphans assigned",
};

export function DashboardHeader({ role }: DashboardHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {roleTitle[role]}
        </h1>
      </div>

      <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        {roleMessage[role]}
      </div>
    </header>
  );
}
