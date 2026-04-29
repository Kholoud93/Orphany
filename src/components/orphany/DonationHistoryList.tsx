import { StatusBadge } from "@/components/orphany/StatusBadge";
import type { Donation } from "@/data/orphany";
import { cn } from "@/lib/utils";

type DonationHistoryListProps = {
  donations: Donation[];
  className?: string;
};

export function DonationHistoryList({ donations, className }: DonationHistoryListProps) {
  return (
    <ul className={cn("divide-y", className)}>
      {donations.map((donation) => (
        <li
          key={donation.id}
          className="flex flex-col gap-2 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <div className="truncate font-medium">{donation.target}</div>
            <div className="text-xs text-muted-foreground">
              {donation.type} · {new Date(donation.date).toLocaleDateString()}
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-normal">
            <StatusBadge
              tone={
                donation.status === "Completed"
                  ? "success"
                  : donation.status === "Upcoming"
                    ? "warning"
                    : "neutral"
              }
            >
              {donation.status}
            </StatusBadge>
            <span className="font-display text-base font-semibold tabular-nums">
              ${donation.amount}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
