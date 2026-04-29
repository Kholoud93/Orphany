import { useEffect, useState } from "react";
import type { Role } from "@/data/orphany";

const STORAGE_KEY = "orphany.role";
const listeners = new Set<(role: Role) => void>();

export function getRole(): Role {
  if (typeof window === "undefined") {
    return "donor";
  }

  return (localStorage.getItem(STORAGE_KEY) as Role) || "donor";
}

export function setRole(role: Role) {
  localStorage.setItem(STORAGE_KEY, role);
  listeners.forEach((listener) => listener(role));
}

export function useRole(): [Role, (role: Role) => void] {
  const [role, setLocalRole] = useState<Role>("donor");

  useEffect(() => {
    setLocalRole(getRole());

    const listener = (nextRole: Role) => setLocalRole(nextRole);
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return [role, setRole];
}
