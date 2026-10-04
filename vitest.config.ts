import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ["src/lib/__tests__/**/*.test.ts"],
    exclude: [
      "src/__tests__/**/*.spec.ts",
      ".claude/worktrees/**",
      "node_modules/**",
    ],
    environment: "jsdom",
  },
});