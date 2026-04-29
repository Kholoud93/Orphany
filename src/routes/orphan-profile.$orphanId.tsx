import { createFileRoute } from "@tanstack/react-router";
import { OrphanDetailsPage } from "@/pages/OrphanDetailsPage";

export const Route = createFileRoute("/orphan-profile/$orphanId")({
  head: () => ({
    meta: [
      { title: "Orphan profile — Orphany" },
      { name: "description", content: "View an orphan profile and sponsor details." },
    ],
  }),
  component: OrphanProfileRouteComponent,
});

function OrphanProfileRouteComponent() {
  const { orphanId } = Route.useParams();

  return <OrphanDetailsPage orphanId={orphanId} />;
}
