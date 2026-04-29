import { createFileRoute } from "@tanstack/react-router";
import { OrphansPage } from "@/pages/OrphansPage";

export const Route = createFileRoute("/orphans")({
  head: () => ({
    meta: [
      { title: "Orphans — Orphany" },
      { name: "description", content: "Browse and sponsor orphans." },
    ],
  }),
  component: OrphansPage,
});
