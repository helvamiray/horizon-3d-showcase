import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      /** ngrok ve mobil cihazdan erişim için (Blocked Host önleme) */
      allowedHosts: true,
    },
  }
});
