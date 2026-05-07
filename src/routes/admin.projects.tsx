import { createFileRoute } from "@tanstack/react-router";
import AdminProjectsPage from "@/components/admin/AdminProjectsPage";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjectsPage,
});
