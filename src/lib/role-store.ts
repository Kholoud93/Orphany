import { useEffect, useState } from "react";
import type { Role } from "@/data/orphany";

const KEY = "orphany.role";
const listeners = new Set<(r: Role) => void>();

export function getRole(): Role {
  if (typeof window === "undefined") return "donor";
  return (localStorage.getItem(KEY) as Role) || "donor";
}

export function setRole(r: Role) {
  localStorage.setItem(KEY, r);
  listeners.forEach((l) => l(r));
}

export function useRole(): [Role, (r: Role) => void] {
  const [role, setLocal] = useState<Role>("donor");
  useEffect(() => {
    setLocal(getRole());
    const fn = (r: Role) => setLocal(r);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return [role, setRole];
}
