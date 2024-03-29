import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), basicSsl(), visualizer()],
  define: {
    VITE_APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  server: {
    host: "127.0.0.1",
  },
});
