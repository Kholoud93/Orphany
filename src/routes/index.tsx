import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/pages/DashboardPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Orphany" },
      { name: "description", content: "Your Orphany dashboard at a glance." },
    ],
  }),
  component: DashboardPage,
});
