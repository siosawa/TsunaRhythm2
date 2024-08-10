/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"), 
    },
  },
  test: {
    globals: true, // これにより`test`や`expect`がグローバルに利用可能
    environment: "jsdom", // Reactコンポーネントをテストするために必要
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    setupFiles: "./setupTests.js",
  },
});
