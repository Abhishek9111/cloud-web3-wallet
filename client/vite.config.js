import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyFills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyFills()],
});
