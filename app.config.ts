import { defineConfig } from "@tanstack/react-start/config";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: { preset: "vercel" },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      /** @ts-ignore */
      tailwindcss(),
    ],
    define: {
      VITE_APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
  },
});
