import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/pages/ProfilePage";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Orphany" },
      { name: "description", content: "Your Orphany profile and giving history." },
    ],
  }),
  component: ProfilePage,
});
