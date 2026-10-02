/**
 * Studio Environment Detection
 * Identifies whether Studio is running in DEVELOPMENT, STAGING, or PRODUCTION.
 */

export type StudioEnvironment = "DEVELOPMENT" | "STAGING" | "PRODUCTION";

export interface EnvironmentInfo {
  name: StudioEnvironment;
  isProduction: boolean;
  isStaging: boolean;
  isDevelopment: boolean;
  badgeLabel: string;
  badgeClass: string;
}

export function getStudioEnvironment(): EnvironmentInfo {
  const supabaseUrl =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof process !== "undefined" && process.env?.VITE_SUPABASE_URL) ||
    "";
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";

  // 1. Hostname overrides
  if (
    hostname === "houseofpadmavati.com" ||
    hostname === "www.houseofpadmavati.com" ||
    hostname === "houseofpadmavati.pages.dev" ||
    hostname === "hop-production.pages.dev"
  ) {
    return {
      name: "PRODUCTION",
      isProduction: true,
      isStaging: false,
      isDevelopment: false,
      badgeLabel: "PRODUCTION",
      badgeClass: "bg-signature-crimson/15 text-signature-crimson border-signature-crimson/30",
    };
  }

  if (hostname.includes("hop-staging.pages.dev") || supabaseUrl.includes("dovnhgbisiturzbjgvei")) {
    return {
      name: "STAGING",
      isProduction: false,
      isStaging: true,
      isDevelopment: false,
      badgeLabel: "STAGING",
      badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    };
  }

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    // If running locally against production Supabase, flag it clearly
    const isProdDb = supabaseUrl.includes("kbvjmcnaaogkbnerjcoc");
    return {
      name: isProdDb ? "PRODUCTION" : "DEVELOPMENT",
      isProduction: isProdDb,
      isStaging: !isProdDb,
      isDevelopment: true,
      badgeLabel: isProdDb ? "LOCAL (PROD DB)" : "DEVELOPMENT",
      badgeClass: isProdDb
        ? "bg-signature-crimson/15 text-signature-crimson border-signature-crimson/30"
        : "bg-coastal-teal/15 text-coastal-teal border-coastal-teal/30",
    };
  }

  return {
    name: "STAGING",
    isProduction: false,
    isStaging: true,
    isDevelopment: false,
    badgeLabel: "STAGING",
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  };
}
