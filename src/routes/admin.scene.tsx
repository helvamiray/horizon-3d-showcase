import { createFileRoute } from "@tanstack/react-router";
import SceneAdminPage from "@/admin/SceneAdminPage";

export const Route = createFileRoute("/admin/scene")({
  component: SceneAdminPage,
});
