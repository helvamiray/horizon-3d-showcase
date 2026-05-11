import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      /** ngrok ve mobil cihazdan erişim için (Blocked Host önleme) */
      allowedHosts: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/three") || id.includes("node_modules/@react-three")) {
              return "chunk-3d";
            }
            if (id.includes("node_modules/gsap")) {
              return "chunk-gsap";
            }
            if (id.includes("node_modules/framer-motion") || id.includes("node_modules/motion")) {
              return "chunk-motion";
            }
            if (id.includes("node_modules/animejs")) {
              return "chunk-anime";
            }
            if (id.includes("node_modules/leaflet") || id.includes("node_modules/react-leaflet")) {
              return "chunk-map";
            }
            if (id.includes("node_modules/flowbite")) {
              return "chunk-flowbite";
            }
            if (id.includes("node_modules/@radix-ui")) {
              return "chunk-radix";
            }
          },
        },
      },
    },
  },
});
