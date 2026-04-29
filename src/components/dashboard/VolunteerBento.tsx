import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ClipboardList, NotebookPen, Users } from "lucide-react";
import { orphans } from "@/data/orphany";
import { StatCard } from "@/components/orphany/StatCard";
import { StatusBadge } from "@/components/orphany/StatusBadge";
import { Button } from "@/components/ui/button";

export function VolunteerBento() {
  const assigned = orphans.slice(0, 3);
  const [noteTargetId, setNoteTargetId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const noteTarget = assigned.find((orphan) => orphan.id === noteTargetId) ?? null;
  const closeNoteDialog = () => {
    setNoteTargetId(null);
    setNote("");
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:auto-rows-[minmax(0,11rem)]">
      <StatCard
        label="Assigned orphans"
        value={String(assigned.length)}
        delta="2 visits this week"
        icon={Users}
      />
      <StatCard
        label="Notes added"
        value="14"
        delta="+3 this week"
        icon={NotebookPen}
        tone="accent"
      />
      <StatCard
        label="Open tasks"
        value="5"
        delta="2 due today"
        icon={ClipboardList}
        tone="warning"
      />

      <section className="rounded-2xl border bg-card p-5 shadow-sm md:col-span-2 xl:row-span-2">
        <h2 className="mb-3 font-display text-lg font-semibold">My assigned orphans</h2>
        <ul className="space-y-3">
          {assigned.map((orphan) => (
            <li key={orphan.id} className="flex items-start gap-3 rounded-xl border p-3">
              <img
                src={orphan.image}
                alt={orphan.name}
                loading="lazy"
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate font-medium">
                    {orphan.name}, {orphan.age}
                  </div>
                  <StatusBadge
                    tone={
                      orphan.urgency === "High"
                        ? "danger"
                        : orphan.urgency === "Medium"
                          ? "warning"
                          : "success"
                    }
                  >
                    {orphan.urgency}
                  </StatusBadge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{orphan.story}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 rounded-lg px-3 text-xs"
                    onClick={() => setNoteTargetId(orphan.id)}
                  >
                    Add note
                  </Button>
                  <Button asChild type="button" size="sm" variant="outline" className="h-7 rounded-lg px-3 text-xs">
                    <Link to="/orphans/$orphanId" params={{ orphanId: orphan.id }}>
                      View profile
                    </Link>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border bg-sidebar p-5 text-sidebar-foreground shadow-sm md:col-span-2 xl:col-span-1 xl:row-span-2">
        <h2 className="font-display text-lg font-semibold">Today's tasks</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {[
            "Visit Yusuf — bring books",
            "Submit weekly report",
            "Photo update for Hana",
            "Coordinate medical check",
          ].map((task, index) => (
            <li
              key={index}
              className="flex items-start gap-2 border-b border-sidebar-border pb-3 last:border-0"
            >
              <input type="checkbox" className="mt-1 h-4 w-4 accent-sidebar-primary" />
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </section>

      {noteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm md:items-center"
          onClick={closeNoteDialog}
        >
          <div
            className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="font-display text-xl font-semibold">Add visit note</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Record your update for {noteTarget.name}.
            </p>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Write a short update about today's visit..."
              className="mt-4 min-h-28 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={closeNoteDialog}>
                Cancel
              </Button>
              <Button type="button" onClick={closeNoteDialog} disabled={!note.trim()}>
                Save note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
