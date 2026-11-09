import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Startup configuration guard for staging mode:
  // Prevent tests in staging mode from silently connecting to production Supabase
  if (mode === "staging") {
    const supabaseUrl = env.VITE_SUPABASE_URL || "";
    const projectId = env.VITE_SUPABASE_PROJECT_ID || "";
    if (supabaseUrl.includes("kbvjmcnaaogkbnerjcoc") || projectId === "kbvjmcnaaogkbnerjcoc") {
      throw new Error(
        "[Vite Staging Guard] Cannot start Vite in staging mode: Supabase URL or project ID targets PRODUCTION (kbvjmcnaaogkbnerjcoc). " +
        "Ensure .env.staging.local is present and configured for staging project dovnhgbisiturzbjgvei."
      );
    }
  }

  return {
  server: {
    host: "::",
    port: 8080,
    watch: {
      ignored: ["**/tools/**", "**/output/**", "**/.git/**"],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("lucide-react")) return "vendor-icons";
              if (id.includes("recharts")) return "vendor-charts";
              if (id.includes("@supabase")) return "vendor-supabase";
              if (id.includes("@tanstack")) return "vendor-query";
              if (id.includes("@radix-ui")) return "vendor-radix";
            }
          },
        },
      },
    },
  };
});
