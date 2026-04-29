import { createFileRoute } from "@tanstack/react-router";
import { CalendarPage } from "@/pages/CalendarPage";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Orphany" },
      { name: "description", content: "Donation dates and sponsorship reminders." },
    ],
  }),
  component: CalendarPage,
});
