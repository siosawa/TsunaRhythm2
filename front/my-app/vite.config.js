/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),  // プロジェクトのルートディレクトリをエイリアスにマッピング
        },
    },
    test: {
        globals: true,  // これにより、`test`や`expect`がグローバルに利用可能になります
        environment: "jsdom",  // Reactコンポーネントをテストするために必要です
        include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },
});
