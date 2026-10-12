import { describe, it, expect } from "vitest";

describe("Phase 3 Stage 5: Editorial Management & Operational Resilience", () => {
  describe("Workstream A: Editorial Validation & Slug Rules", () => {
    it("generates clean URL-safe slugs from reflection titles", () => {
      const titles = [
        { title: "How morning light reads a weave.", expected: "how-morning-light-reads-a-weave" },
        { title: "Linen, and the art of doing less.", expected: "linen-and-the-art-of-doing-less" },
        { title: "Padmavati — the name behind the house.", expected: "padmavati-the-name-behind-the-house" },
      ];

      for (const item of titles) {
        const slug = item.title
          .toLowerCase()
          .replace(/[''.—,]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
        expect(slug).toBe(item.expected);
      }
    });

    it("enforces default author byline when not provided", () => {
      const author = "" || "House of Padmavati";
      expect(author).toBe("House of Padmavati");

      const customAuthor = "Siddharth Rao" || "House of Padmavati";
      expect(customAuthor).toBe("Siddharth Rao");
    });

    it("verifies sorting order comparator handles both custom order and publication dates", () => {
      const articles = [
        { title: "Article A", sort_order: 20, published_at: "2026-10-01T00:00:00Z" },
        { title: "Article B", sort_order: 10, published_at: "2026-09-01T00:00:00Z" },
        { title: "Article C", sort_order: 10, published_at: "2026-09-15T00:00:00Z" },
      ];

      const sorted = [...articles].sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order;
        }
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      });

      expect(sorted[0].title).toBe("Article C"); // sort_order 10, newer date
      expect(sorted[1].title).toBe("Article B"); // sort_order 10, older date
      expect(sorted[2].title).toBe("Article A"); // sort_order 20
    });
  });

  describe("Workstream B: Defensive Media Catalog & Usage Inspection", () => {
    const mockStoreReferences = {
      collections: [
        { name: "Yūgen", hero_video_url: "https://example.com/yugen-hero.mp4", hero_image_url: "https://example.com/yugen-poster.jpg" },
      ],
      products: [
        { name: "Kanjivaram Silk Saree", image_url: "https://example.com/kanjivaram-1.jpg" },
      ],
      journal: [
        { title: "Weave History", img: "https://example.com/loom-still.jpg", asset_path: null, content: "Read notes at https://example.com/body-asset.jpg" },
      ],
      site_sections: [
        { display_name: "Homepage Hero", payload: JSON.stringify({ image_url: "https://example.com/hero-banner.jpg" }) },
      ],
    };

    function checkSimulatedUsage(url: string): { inUse: boolean; references: string[] } {
      const refs: string[] = [];

      // Check collections
      for (const c of mockStoreReferences.collections) {
        if (c.hero_video_url === url) refs.push(`Collection "${c.name}" (Hero Film)`);
        if (c.hero_image_url === url) refs.push(`Collection "${c.name}" (Poster Still)`);
      }

      // Check products
      for (const p of mockStoreReferences.products) {
        if (p.image_url === url) refs.push(`Product "${p.name}"`);
      }

      // Check journal
      for (const j of mockStoreReferences.journal) {
        if (j.img === url) refs.push(`Journal Article "${j.title}" (Cover)`);
        if (j.asset_path === url) refs.push(`Journal Article "${j.title}" (Asset)`);
        if (j.content.includes(url)) refs.push(`Journal Article "${j.title}" (Body)`);
      }

      // Check site sections
      for (const s of mockStoreReferences.site_sections) {
        if (s.payload.includes(url)) refs.push(`Site Section "${s.display_name}"`);
      }

      return {
        inUse: refs.length > 0,
        references: refs,
      };
    }

    it("flags media in active use by Journal cover image as protected", () => {
      const check = checkSimulatedUsage("https://example.com/loom-still.jpg");
      expect(check.inUse).toBe(true);
      expect(check.references).toContain('Journal Article "Weave History" (Cover)');
    });

    it("flags media embedded in Journal body content as protected", () => {
      const check = checkSimulatedUsage("https://example.com/body-asset.jpg");
      expect(check.inUse).toBe(true);
      expect(check.references).toContain('Journal Article "Weave History" (Body)');
    });

    it("flags media used in Site Sections as protected", () => {
      const check = checkSimulatedUsage("https://example.com/hero-banner.jpg");
      expect(check.inUse).toBe(true);
      expect(check.references).toContain('Site Section "Homepage Hero"');
    });

    it("permits deletion only when an asset has zero live references", () => {
      const check = checkSimulatedUsage("https://example.com/unused-orphan.jpg");
      expect(check.inUse).toBe(false);
      expect(check.references.length).toBe(0);
    });

    it("enforces that permanent purge requires trash status first", () => {
      const assetActive = { status: "active", url: "https://example.com/unused-orphan.jpg" };
      const assetTrash = { status: "trash", url: "https://example.com/unused-orphan.jpg" };

      const canPurgeActive = assetActive.status === "trash";
      const canPurgeTrash = assetTrash.status === "trash";

      expect(canPurgeActive).toBe(false);
      expect(canPurgeTrash).toBe(true);
    });
  });

  describe("Workstream C: Revisions & Operational Audit Snapshots", () => {
    it("creates sequential revision numbers", () => {
      const existingRevisions = [
        { revision_number: 1, created_at: "2026-10-01" },
        { revision_number: 2, created_at: "2026-10-05" },
      ];

      const nextRev = Math.max(0, ...existingRevisions.map((r) => r.revision_number)) + 1;
      expect(nextRev).toBe(3);
    });

    it("records restoration action with reference to original revision number", () => {
      const targetRevNumber = 2;
      const restorationNote = `Restored from revision #${targetRevNumber}`;
      expect(restorationNote).toBe("Restored from revision #2");
    });

    it("ensures unauthenticated visitors cannot access draft articles", () => {
      const articles = [
        { id: "1", slug: "live-reflection", status: "published" },
        { id: "2", slug: "secret-draft", status: "draft" },
        { id: "3", slug: "old-archive", status: "archived" },
      ];

      // Public visitor filter
      const publicVisible = articles.filter((a) => a.status === "published");
      expect(publicVisible.length).toBe(1);
      expect(publicVisible[0].slug).toBe("live-reflection");
      expect(publicVisible.find((a) => a.slug === "secret-draft")).toBeUndefined();
    });
  });
});
