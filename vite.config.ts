/**
 * @type {import('vite').UserConfig}
 */
import { defineConfig } from "vite";

export default defineConfig({
  appType: "mpa",
  build: {
    sourcemap: true,
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100,
      ignored: [
        "node_modules/**",
        "dist/**",
        "**/node_modules/**",
        "**/dist/**",
        "**/.venv/**",
      ],
    },
  },
});
