import { Navigate, createFileRoute } from "@tanstack/react-router";

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

  return <Navigate to="/orphan-profile/$orphanId" params={{ orphanId }} replace />;
}
