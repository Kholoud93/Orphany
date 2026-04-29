import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Megaphone, CalendarDays, UserCircle2, Bell, Heart, Search } from "lucide-react";
import { useRole } from "@/lib/role-store";
import type { Role } from "@/data/orphany";
import { notifications } from "@/data/orphany";

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

export function AppShell() {
  const [role, setRole] = useRole();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
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
          <div className="text-xs uppercase tracking-wider text-sidebar-foreground/60">Viewing as</div>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-sidebar-accent p-1">
            {roles.map((r) => (
              <button
                key={r.value}
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

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur md:px-8">
          <div className="md:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Heart className="h-4 w-4" fill="currentColor" />
              </div>
              <span className="font-display text-lg font-semibold">Orphany</span>
            </div>
          </div>
          <div className="relative ml-auto hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search orphans, campaigns, donors…"
              className="w-full rounded-xl border bg-card py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border bg-card text-foreground hover:bg-muted">
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

        {/* Mobile role switch */}
        <div className="flex gap-2 overflow-x-auto border-b px-4 py-2 md:hidden">
          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                role === r.value ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70"
              }`}
            >
              {r.label}
            </button>
          ))}
          <div className="ml-auto flex gap-1">
            {nav.map((n) => {
              const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} className={`rounded-lg p-2 ${active ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <n.icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
