import { AdminBento } from "@/components/dashboard/AdminBento";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DonorBento } from "@/components/dashboard/DonorBento";
import { VolunteerBento } from "@/components/dashboard/VolunteerBento";
import { useRole } from "@/hooks/use-role";

export function DashboardPage() {
  const [role] = useRole();

  return (
    <div className="space-y-6">
      <DashboardHeader role={role} />
      {role === "admin" && <AdminBento />}
      {role === "donor" && <DonorBento />}
      {role === "volunteer" && <VolunteerBento />}
    </div>
  );
}
