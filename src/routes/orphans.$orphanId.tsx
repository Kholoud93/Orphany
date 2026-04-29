import { createFileRoute } from "@tanstack/react-router";
import { OrphanDetailsPage } from "@/pages/OrphanDetailsPage";

export const Route = createFileRoute("/orphans/$orphanId")({
  head: () => ({
    meta: [
      { title: "Orphan profile — Orphany" },
      { name: "description", content: "View an orphan profile and sponsor details." },
    ],
  }),
  component: OrphanDetailsRouteComponent,
});

function OrphanDetailsRouteComponent() {
  const { orphanId } = Route.useParams();

  return <OrphanDetailsPage orphanId={orphanId} />;
}
