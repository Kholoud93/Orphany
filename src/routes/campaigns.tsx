import { createFileRoute } from "@tanstack/react-router";
import { CampaignsPage } from "@/pages/CampaignsPage";

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaigns — Orphany" },
      { name: "description", content: "Support our active charity campaigns." },
    ],
  }),
  component: CampaignsPage,
});
