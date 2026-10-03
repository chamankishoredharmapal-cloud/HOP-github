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
      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        tag: r.tag,
        img: staticMatch?.img ?? r.img,
        assetPath: staticMatch?.assetPath ?? r.asset_path ?? undefined,
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
