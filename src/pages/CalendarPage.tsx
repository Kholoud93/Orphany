import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOrphanyStore } from "@/context/orphany-store";

const kindStyles = {
  donation: "bg-primary text-primary-foreground",
  reminder: "bg-warning text-warning-foreground",
  update: "bg-accent text-accent-foreground",
} as const;

export function CalendarPage() {
  const { events } = useOrphanyStore();
  const [cursor, setCursor] = useState(() => new Date(2026, 4, 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const eventsByDay = new Map<string, typeof events>();
  for (const event of events) {
    const eventDate = new Date(event.date);
    if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
      const key = String(eventDate.getDate());
      if (!eventsByDay.has(key)) {
        eventsByDay.set(key, []);
      }
      eventsByDay.get(key)!.push(event);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Calendar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sponsorship reminders, donations, and updates.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold">
              {cursor.toLocaleString("en", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setCursor(new Date(year, month - 1, 1))}
                className="rounded-lg border p-2 hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setCursor(new Date(year, month + 1, 1))}
                className="rounded-lg border p-2 hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto pb-1">
            <div className="min-w-136 sm:min-w-2xl">
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-24 rounded-lg border p-1.5 text-left text-xs ${
                      day ? "bg-background" : "border-transparent bg-muted/40"
                    }`}
                  >
                    {day && (
                      <>
                        <div className="font-medium">{day}</div>
                        <div className="mt-1 flex flex-col gap-1">
                          {(eventsByDay.get(String(day)) || []).map((event) => (
                            <span
                              key={event.id}
                              className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${kindStyles[event.kind]}`}
                            >
                              {event.title}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">All upcoming</h2>
          <ul className="mt-4 space-y-3">
            {events.map((event) => (
              <li key={event.id} className="flex gap-3">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-muted text-foreground">
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">
                    {new Date(event.date).toLocaleString("en", { month: "short" })}
                  </span>
                  <span className="font-display font-bold">{new Date(event.date).getDate()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{event.title}</div>
                  <span
                    className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${kindStyles[event.kind]}`}
                  >
                    {event.kind}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
