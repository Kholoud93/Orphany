import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { events } from "@/data/orphany";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Orphany" }, { name: "description", content: "Donation dates and sponsorship reminders." }] }),
  component: CalendarPage,
});

const kindStyles = {
  donation: "bg-primary text-primary-foreground",
  reminder: "bg-warning text-warning-foreground",
  update: "bg-accent text-accent-foreground",
} as const;

function CalendarPage() {
  const [cursor, setCursor] = useState(() => new Date(2026, 4, 1)); // May 2026
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventsByDay = new Map<string, typeof events>();
  for (const e of events) {
    const d = new Date(e.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const k = String(d.getDate());
      if (!eventsByDay.has(k)) eventsByDay.set(k, []);
      eventsByDay.get(k)!.push(e);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Calendar</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sponsorship reminders, donations, and updates.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              {cursor.toLocaleString("en", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex gap-1">
              <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="rounded-lg border p-2 hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="rounded-lg border p-2 hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="py-2">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => (
              <div key={i} className={`min-h-20 rounded-lg border p-1.5 text-left text-xs ${d ? "bg-background" : "bg-muted/40 border-transparent"}`}>
                {d && (
                  <>
                    <div className="font-medium">{d}</div>
                    <div className="mt-1 flex flex-col gap-1">
                      {(eventsByDay.get(String(d)) || []).map((e) => (
                        <span key={e.id} className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${kindStyles[e.kind]}`}>
                          {e.title}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">All upcoming</h2>
          <ul className="mt-4 space-y-3">
            {events.map((e) => (
              <li key={e.id} className="flex gap-3">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-muted text-foreground">
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">{new Date(e.date).toLocaleString("en", { month: "short" })}</span>
                  <span className="font-display font-bold">{new Date(e.date).getDate()}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{e.title}</div>
                  <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${kindStyles[e.kind]}`}>{e.kind}</span>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
