import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import AdminProductsPage from "@/components/admin/AdminProductsPage";

export const Route = createFileRoute("/admin")({
  component: AdminShell,
});

function AdminShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const normalized = pathname.replace(/\/$/, "") || "/";

  if (normalized === "/admin") {
    return <AdminProductsPage />;
  }

  return <Outlet />;
}
