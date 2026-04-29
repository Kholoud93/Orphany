import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Campaign } from "@/data/orphany";

type DonateDialogProps = {
  campaign: Campaign;
  onDonate: (amount: number) => void | Promise<void>;
  onClose: () => void;
};

const quickAmounts = [25, 50, 100, 250] as const;

export function DonateDialog({ campaign, onDonate, onClose }: DonateDialogProps) {
  const [amount, setAmount] = useState<number>(quickAmounts[1]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const selectedLabel = useMemo(() => `$${amount.toLocaleString()}`, [amount]);
  const isGoalReached = campaign.raised >= campaign.goal;

  const handleDonate = async () => {
    if (isGoalReached || amount <= 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await Promise.resolve(onDonate(amount));
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 350);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="font-display text-xl font-semibold">Donate to {campaign.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{campaign.description}</p>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {quickAmounts.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmount(value)}
              disabled={isSubmitting || isGoalReached}
              className={`rounded-xl border py-2 font-display font-semibold transition ${
                amount === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              ${value}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl border px-3">
          <span className="text-muted-foreground">$</span>
          <input
            type="number"
            placeholder="Other amount"
            value={amount}
            onChange={(event) => setAmount(Math.max(0, Number(event.target.value) || 0))}
            disabled={isSubmitting || isGoalReached}
            className="flex-1 bg-transparent py-2.5 outline-none"
          />
        </div>

        {isGoalReached && (
          <p className="mt-2 text-xs font-medium text-warning">
            This campaign already reached its goal.
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleDonate}
            disabled={amount <= 0 || isSubmitting || isSuccess || isGoalReached}
          >
            {isSubmitting ? "Saving..." : isSuccess ? "Saved" : `Donate ${selectedLabel}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
