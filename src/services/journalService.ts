import { supabase } from "@/integrations/supabase/client";
import { articles as fallbackArticles, type JournalArticle } from "@/data/journalArticles";

export interface StorefrontJournalArticle extends JournalArticle {
  id?: string;
  content?: string;
  publishedAt?: string;
}

export async function fetchPublishedJournalArticles(): Promise<StorefrontJournalArticle[]> {
  try {
    const { data, error } = await supabase
      .from("journal_articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn("Supabase journal fetch failed, using fallback:", error.message);
      }
      return fallbackArticles;
    }

    return data.map((r) => {
      const staticMatch = fallbackArticles.find((a) => a.slug === r.slug);
      
      // Determine image URL:
      // Canonical priority: if r.img is a real custom URL or external image, use it directly.
      // Only resolve to bundled static asset if r.img matches the unbundled dev seed path.
      const isLegacyRawAssetPath = Boolean(
        r.img && (r.img.startsWith("/src/assets/") || r.img.startsWith("src/assets/"))
      );
      const isCustomSavedImage = Boolean(r.img && !isLegacyRawAssetPath);

      const img = isCustomSavedImage
        ? r.img
        : (staticMatch?.img || r.img || "");

      // For OptimizedImage: only provide assetPath if the image actually points to the
      // bundled static asset. For any custom saved image URL, assetPath must be undefined
      // to prevent the manifest from overriding the editor's saved image.
      const assetPath = isCustomSavedImage
        ? undefined
        : (r.asset_path || staticMatch?.assetPath || undefined);

      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        tag: r.tag,
        img,
        assetPath,
        dek: r.dek,
        content: r.content ?? undefined,
        publishedAt: r.published_at ?? undefined,
      };
    });
  } catch (err) {
    console.warn("Exception during journal fetch, using fallback:", err);
    return fallbackArticles;
  }
}

export async function fetchJournalArticleBySlug(slug: string): Promise<StorefrontJournalArticle | null> {
  const articles = await fetchPublishedJournalArticles();
  return articles.find((a) => a.slug === slug) ?? fallbackArticles.find((a) => a.slug === slug) ?? null;
}
