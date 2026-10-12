import { supabase } from "@/integrations/supabase/client";
import { articles as fallbackArticles, type JournalArticle } from "@/data/journalArticles";

export interface StorefrontJournalArticle extends JournalArticle {
  id?: string;
  content?: string;
  publishedAt?: string;
  author?: string;
  image_alt?: string;
  sort_order?: number;
  status?: string;
  isPreview?: boolean;
}

interface RawJournalRow {
  id: string;
  slug: string;
  title: string;
  tag: string;
  img: string;
  asset_path: string | null;
  dek: string;
  content: string | null;
  author?: string | null;
  image_alt?: string | null;
  sort_order?: number | null;
  status?: string;
  published_at?: string | null;
}

function mapStorefrontRow(r: RawJournalRow, isPreview: boolean = false): StorefrontJournalArticle {
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
    author: r.author || "House of Padmavati",
    image_alt: r.image_alt ?? undefined,
    sort_order: r.sort_order ?? 0,
    status: r.status,
    publishedAt: r.published_at ?? undefined,
    isPreview,
  };
}

export async function fetchPublishedJournalArticles(): Promise<StorefrontJournalArticle[]> {
  try {
    const { data, error } = await supabase
      .from("journal_articles")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn("Supabase journal fetch failed, using fallback:", error.message);
      }
      return fallbackArticles.map((a) => ({
        ...a,
        author: a.author || "House of Padmavati",
        sort_order: a.sort_order ?? 0,
      }));
    }

    return data.map((r) => mapStorefrontRow(r, false));
  } catch (err) {
    console.warn("Exception during journal fetch, using fallback:", err);
    return fallbackArticles.map((a) => ({
      ...a,
      author: a.author || "House of Padmavati",
      sort_order: a.sort_order ?? 0,
    }));
  }
}

export async function fetchJournalArticleBySlug(
  slug: string,
  options?: { allowDraftPreview?: boolean }
): Promise<StorefrontJournalArticle | null> {
  if (options?.allowDraftPreview) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from("journal_articles")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (!error && data) {
          return mapStorefrontRow(data, data.status !== "published");
        }
      }
    } catch {
      // Fall through to public published lookup
    }
  }

  const articles = await fetchPublishedJournalArticles();
  return articles.find((a) => a.slug === slug) ?? fallbackArticles.find((a) => a.slug === slug) ?? null;
}
