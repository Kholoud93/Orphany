import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  Heart,
  LayoutDashboard,
  Megaphone,
  Menu,
  Search,
  UserCircle2,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Role } from "@/data/orphany";
import { useOrphanyStore } from "@/context/orphany-store";
import { useRole } from "@/hooks/use-role";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/orphans", label: "Orphans", icon: Users },
  { to: "/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

const roles: { value: Role; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "donor", label: "Donor" },
  { value: "volunteer", label: "Volunteer" },
];

type SearchResult = {
  id: string;
  type: "orphan" | "campaign" | "event" | "donation" | "notification";
  title: string;
  subtitle: string;
};

const includesQuery = (value: string, query: string) => value.toLowerCase().includes(query);

export function AppShell() {
  const [role, setRole] = useRole();
  const navigate = useNavigate();
  const { notifications, orphans, campaigns, events, donations } = useOrphanyStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const unread = notifications.filter((n) => n.unread).length;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchResults = useMemo<SearchResult[]>(() => {
    if (normalizedQuery.length < 2) {
      return [];
    }

    const orphanResults = orphans
      .filter((orphan) =>
        [
          orphan.name,
          orphan.location,
          orphan.story,
          orphan.status,
          orphan.needs.join(" "),
        ].some((value) => includesQuery(value, normalizedQuery)),
      )
      .slice(0, 4)
      .map((orphan) => ({
        id: orphan.id,
        type: "orphan" as const,
        title: orphan.name,
        subtitle: `${orphan.location} · Age ${orphan.age}`,
      }));

    const campaignResults = campaigns
      .filter((campaign) =>
        [campaign.name, campaign.description, campaign.category].some((value) =>
          includesQuery(value, normalizedQuery),
        ),
      )
      .slice(0, 3)
      .map((campaign) => ({
        id: campaign.id,
        type: "campaign" as const,
        title: campaign.name,
        subtitle: `${campaign.category} · $${campaign.raised}/$${campaign.goal}`,
      }));

    const eventResults = events
      .filter((event) => [event.title, event.kind].some((value) => includesQuery(value, normalizedQuery)))
      .slice(0, 2)
      .map((event) => ({
        id: event.id,
        type: "event" as const,
        title: event.title,
        subtitle: `${event.kind} · ${new Date(event.date).toLocaleDateString()}`,
      }));

    const donationResults = donations
      .filter((donation) =>
        [donation.target, donation.type, donation.status].some((value) =>
          includesQuery(value, normalizedQuery),
        ),
      )
      .slice(0, 2)
      .map((donation) => ({
        id: donation.id,
        type: "donation" as const,
        title: `${donation.target} · $${donation.amount}`,
        subtitle: `${donation.type} · ${donation.status}`,
      }));

    const notificationResults = notifications
      .filter((notification) =>
        [notification.title, notification.body].some((value) =>
          includesQuery(value, normalizedQuery),
        ),
      )
      .slice(0, 2)
      .map((notification) => ({
        id: notification.id,
        type: "notification" as const,
        title: notification.title,
        subtitle: notification.body,
      }));

    return [
      ...orphanResults,
      ...campaignResults,
      ...eventResults,
      ...donationResults,
      ...notificationResults,
    ].slice(0, 10);
  }, [campaigns, donations, events, normalizedQuery, notifications, orphans]);

  const openSearchResult = async (result: SearchResult) => {
    setSearchOpen(false);
    setSearchQuery("");

    if (result.type === "orphan") {
      await navigate({ to: "/orphan-profile/$orphanId", params: { orphanId: result.id } });
      return;
    }
    if (result.type === "campaign") {
      await navigate({ to: "/campaigns" });
      return;
    }
    if (result.type === "event") {
      await navigate({ to: "/calendar" });
      return;
    }
    if (result.type === "donation") {
      await navigate({ to: "/profile" });
      return;
    }
    await navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Heart className="h-5 w-5" fill="currentColor" />
          </div>
          <div className="font-display text-xl font-semibold tracking-tight">Orphany</div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {nav.map((n) => {
            const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <div className="text-xs uppercase tracking-wider text-sidebar-foreground/60">
            Viewing as
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-sidebar-accent p-1">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`rounded-lg px-2 py-1.5 text-xs font-medium transition ${
                  role === r.value
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur sm:px-6 md:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border bg-card md:hidden"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="h-4 w-4" fill="currentColor" />
            </div>
            <span className="font-display text-lg font-semibold">Orphany</span>
          </div>

          <div className="relative ml-auto hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => {
                setTimeout(() => setSearchOpen(false), 120);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setSearchOpen(false);
                  return;
                }
                if (event.key === "Enter" && searchResults[0]) {
                  event.preventDefault();
                  void openSearchResult(searchResults[0]);
                }
              }}
              placeholder="Search orphans, campaigns, donors…"
              className="w-full rounded-xl border bg-card py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
            {searchOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 max-h-80 overflow-y-auto rounded-xl border bg-card p-2 shadow-lg">
                {searchResults.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground">
                    {normalizedQuery.length < 2
                      ? "Type at least 2 letters to search."
                      : "No results found."}
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {searchResults.map((result) => (
                      <li key={`${result.type}-${result.id}`}>
                        <button
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            void openSearchResult(result);
                          }}
                          className="w-full rounded-lg px-2 py-2 text-left hover:bg-muted"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-medium">{result.title}</span>
                            <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground">
                              {result.type}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {result.subtitle}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setNotificationsOpen(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border bg-card text-foreground hover:bg-muted"
            aria-label="Open notifications"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {unread}
              </span>
            )}
          </button>
          <div className="flex h-9 items-center gap-2 rounded-xl border bg-card pl-1 pr-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground text-xs font-semibold">
              {role[0].toUpperCase()}
            </div>
            <span className="text-sm font-medium capitalize">{role}</span>
          </div>
        </header>

        <div
          className={`overflow-hidden border-b transition-[max-height] duration-300 md:hidden ${mobileOpen ? "max-h-56" : "max-h-0"}`}
        >
          <div className="flex gap-2 overflow-x-auto px-4 py-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  role === r.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground/70"
                }`}
              >
                {r.label}
              </button>
            ))}
            <div className="ml-auto flex gap-1">
              {nav.map((n) => {
                const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg p-2 ${active ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    <n.icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      {notificationsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end bg-foreground/30 p-4 backdrop-blur-sm"
          onClick={() => setNotificationsOpen(false)}
        >
          <div
            className="mt-14 w-full max-w-sm rounded-2xl border bg-card p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-semibold">Notifications</h2>
              <button
                type="button"
                className="rounded-lg border p-1.5 hover:bg-muted"
                onClick={() => setNotificationsOpen(false)}
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-3">
              {notifications.map((notification) => (
                <li key={notification.id} className="rounded-xl border p-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-medium">{notification.title}</div>
                    {notification.unread && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{notification.body}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground">{notification.time}</p>
                </li>
              ))}
            </ul>
            <Link
              to="/calendar"
              onClick={() => setNotificationsOpen(false)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Open calendar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
