import { createFileRoute } from "@tanstack/react-router";
import { AdminContactsPage } from "@/components/admin/AdminContactsPage";

export const Route = createFileRoute("/admin/contact")({
  component: AdminContactsPage,
});