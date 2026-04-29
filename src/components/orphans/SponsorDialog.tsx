import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Orphan } from "@/data/orphany";

type SponsorDialogProps = {
  orphan: Orphan;
  onConfirm?: (amount: number) => void;
  onClose: () => void;
};

export function SponsorDialog({ orphan, onConfirm, onClose }: SponsorDialogProps) {
  const [mode, setMode] = useState<"full" | "partial">("full");
  const [amount, setAmount] = useState(Math.max(10, Math.round(orphan.monthlyCost / 4)));
  const value = mode === "full" ? orphan.monthlyCost : amount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <img src={orphan.image} alt={orphan.name} className="h-14 w-14 rounded-xl object-cover" />
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold">Sponsor {orphan.name}</h3>
            <p className="text-sm text-muted-foreground">
              {orphan.location} · ${orphan.monthlyCost}/month
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => setMode("full")}
            className={`rounded-lg py-2 text-sm font-medium ${mode === "full" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
          >
            Full sponsorship
          </button>
          <button
            type="button"
            onClick={() => setMode("partial")}
            className={`rounded-lg py-2 text-sm font-medium ${
              mode === "partial" ? "bg-card shadow-sm" : "text-muted-foreground"
            }`}
          >
            Partial
          </button>
        </div>

        {mode === "partial" && (
          <div className="mt-4">
            <label className="text-sm text-muted-foreground">Monthly amount</label>
            <input
              type="range"
              min={5}
              max={orphan.monthlyCost}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="mt-2 w-full accent-primary"
            />
            <div className="mt-1 text-right font-display text-lg font-semibold tabular-nums">
              ${amount}/mo
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs text-muted-foreground">You'll contribute</div>
            <div className="font-display text-2xl font-semibold">
              ${value}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </div>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                onConfirm?.(value);
                onClose();
              }}
              className="flex-1 sm:flex-none"
            >
              Confirm ${value}/mo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
