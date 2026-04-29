import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { OrphansPage } from "@/pages/OrphansPage";

export const Route = createFileRoute("/orphans")({
  head: () => ({
    meta: [
      { title: "Orphans — Orphany" },
      { name: "description", content: "Browse and sponsor orphans." },
    ],
  }),
  component: OrphansRouteComponent,
});

function OrphansRouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isListingPage = /^\/orphans\/?$/.test(pathname);

  if (isListingPage) {
    return <OrphansPage />;
  }

  return <Outlet />;
}
