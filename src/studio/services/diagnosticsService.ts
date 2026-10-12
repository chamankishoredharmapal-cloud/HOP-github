import { supabase } from "@/integrations/supabase/client";

export interface DiagnosticCheckResult {
  id: string;
  name: string;
  category: "site_sections" | "journal" | "media" | "database" | "storage";
  status: "pass" | "warn" | "fail";
  message: string;
  details?: Record<string, unknown> | string[];
}

export interface SystemIntegrityReport {
  timestamp: string;
  overallStatus: "healthy" | "warning" | "error";
  totalChecks: number;
  passed: number;
  warnings: number;
  failures: number;
  checks: DiagnosticCheckResult[];
}

export const diagnosticsService = {
  async runIntegrityAudit(): Promise<SystemIntegrityReport> {
    const checks: DiagnosticCheckResult[] = [];

    // 1. Check Site Sections (all 11 canonical sections)
    try {
      const { data: sections, error } = await supabase
        .from("site_sections")
        .select("key, section_type, status, published_payload, draft_payload");

      if (error) {
        checks.push({
          id: "sections_access",
          name: "Site Sections Table Access",
          category: "site_sections",
          status: "fail",
          message: `Failed to query site_sections: ${error.message}`,
        });
      } else {
        const canonicalKeys = [
          "home.hero",
          "home.craft",
          "home.philosophy",
          "home.ownership",
          "home.invitation",
          "about.story",
          "care.info",
          "policy.shipping",
          "policy.returns",
          "policy.privacy",
          "policy.terms",
        ];

        const foundKeys = (sections || []).map((s) => s.key);
        const missingKeys = canonicalKeys.filter((k) => !foundKeys.includes(k));

        if (missingKeys.length === 0) {
          checks.push({
            id: "sections_completeness",
            name: "Site Sections Canonical Inventory",
            category: "site_sections",
            status: "pass",
            message: `All 11 canonical sections are present and cataloged.`,
            details: foundKeys,
          });
        } else {
          checks.push({
            id: "sections_completeness",
            name: "Site Sections Canonical Inventory",
            category: "site_sections",
            status: "warn",
            message: `Missing ${missingKeys.length} canonical section(s): ${missingKeys.join(", ")}`,
            details: missingKeys,
          });
        }

        // Check payload validity
        let invalidCount = 0;
        for (const s of sections || []) {
          if (!s.published_payload || typeof s.published_payload !== "object") {
            invalidCount++;
          }
        }

        checks.push({
          id: "sections_payload_integrity",
          name: "Published Section Payload Health",
          category: "site_sections",
          status: invalidCount === 0 ? "pass" : "fail",
          message:
            invalidCount === 0
              ? `All ${sections?.length || 0} section payloads are valid JSON objects.`
              : `${invalidCount} section(s) contain null or invalid payloads.`,
        });
      }
    } catch (err) {
      checks.push({
        id: "sections_exception",
        name: "Site Sections Exception",
        category: "site_sections",
        status: "fail",
        message: err instanceof Error ? err.message : "Unknown error checking sections",
      });
    }

    // 2. Check Journal Integrity
    try {
      const { data: articles, error } = await supabase
        .from("journal_articles")
        .select("id, slug, title, status, img, published_at");

      if (error) {
        checks.push({
          id: "journal_access",
          name: "Journal Articles Access",
          category: "journal",
          status: "fail",
          message: error.message,
        });
      } else {
        const total = articles?.length || 0;
        const missingImgs = (articles || []).filter((a) => !a.img || a.img.trim() === "");
        const published = (articles || []).filter((a) => a.status === "published");

        checks.push({
          id: "journal_inventory",
          name: "Journal Reflections Inventory",
          category: "journal",
          status: "pass",
          message: `${total} reflections cataloged (${published.length} published, ${total - published.length} draft/archived).`,
        });

        checks.push({
          id: "journal_covers",
          name: "Journal Imagery Integrity",
          category: "journal",
          status: missingImgs.length === 0 ? "pass" : "warn",
          message:
            missingImgs.length === 0
              ? "All reflections have assigned cover photographs."
              : `${missingImgs.length} article(s) are missing cover photographs.`,
        });
      }
    } catch (err) {
      checks.push({
        id: "journal_exception",
        name: "Journal Articles Exception",
        category: "journal",
        status: "fail",
        message: err instanceof Error ? err.message : "Unknown error checking journal",
      });
    }

    // 3. Check Media Catalog
    try {
      const { data: media, error } = await supabase
        .from("media_assets")
        .select("id, public_url, bucket_id, status, storage_path");

      if (error) {
        checks.push({
          id: "media_catalog_access",
          name: "Media Catalog Table Access",
          category: "media",
          status: "fail",
          message: error.message,
        });
      } else {
        const activeCount = (media || []).filter((m) => m.status === "active").length;
        const trashCount = (media || []).filter((m) => m.status === "trash").length;

        checks.push({
          id: "media_catalog_inventory",
          name: "Media Catalog Asset Records",
          category: "media",
          status: "pass",
          message: `${media?.length || 0} media assets tracked (${activeCount} active, ${trashCount} in trash).`,
        });
      }
    } catch (err) {
      checks.push({
        id: "media_exception",
        name: "Media Catalog Exception",
        category: "media",
        status: "fail",
        message: err instanceof Error ? err.message : "Unknown error checking media",
      });
    }

    // 4. Check Storage Buckets Accessibility
    try {
      const { data: filmFiles, error: filmErr } = await supabase.storage
        .from("HOP-films")
        .list("", { limit: 10 });

      checks.push({
        id: "storage_films",
        name: "Storage Bucket: HOP-films",
        category: "storage",
        status: filmErr ? "warn" : "pass",
        message: filmErr
          ? `Could not list HOP-films bucket: ${filmErr.message}`
          : `HOP-films storage bucket is reachable and responsive (${filmFiles?.length || 0} files listed).`,
      });

      const { data: imgFiles, error: imgErr } = await supabase.storage
        .from("product-images")
        .list("", { limit: 10 });

      checks.push({
        id: "storage_images",
        name: "Storage Bucket: product-images",
        category: "storage",
        status: imgErr ? "warn" : "pass",
        message: imgErr
          ? `Could not list product-images bucket: ${imgErr.message}`
          : `product-images storage bucket is reachable and responsive (${imgFiles?.length || 0} files listed).`,
      });
    } catch (err) {
      checks.push({
        id: "storage_exception",
        name: "Storage Buckets Exception",
        category: "storage",
        status: "warn",
        message: err instanceof Error ? err.message : "Unknown error querying storage buckets",
      });
    }

    // Determine overall status
    const failures = checks.filter((c) => c.status === "fail").length;
    const warnings = checks.filter((c) => c.status === "warn").length;
    const passed = checks.filter((c) => c.status === "pass").length;

    let overallStatus: "healthy" | "warning" | "error" = "healthy";
    if (failures > 0) overallStatus = "error";
    else if (warnings > 0) overallStatus = "warning";

    return {
      timestamp: new Date().toISOString(),
      overallStatus,
      totalChecks: checks.length,
      passed,
      warnings,
      failures,
      checks,
    };
  },
};
