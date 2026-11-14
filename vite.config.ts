import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "src/client",
  build: { outDir: "../../dist/client", emptyOutDir: true },
  server: {
    host: true,
    proxy: {
      "/socket.io": {
        target: `http://localhost:${process.env.PORT ?? 3000}`,
        ws: true,
      },
    },
  },
});
