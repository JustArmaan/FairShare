import { VitePWA } from "vite-plugin-pwa";

export default {
  build: {
    sourcemap: true,
  },
  plugins: [
    VitePWA({
      includeAssets: ["public/favicon.svg"],
      manifest: {
        name: "FairShare",
        short_name: "FairShare",
        description:
          "A personal finance application with social, bill splitting features.",
        theme_color: "#181616",
        icons: [
          {
            src: "pwa-192x192.png", // need to create these ! app won't work without them.
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
};
