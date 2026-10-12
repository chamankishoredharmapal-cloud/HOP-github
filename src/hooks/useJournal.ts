import { useQuery } from "@tanstack/react-query";
import {
  fetchPublishedJournalArticles,
  fetchJournalArticleBySlug,
  type StorefrontJournalArticle,
} from "@/services/journalService";
import { articles as fallbackArticles } from "@/data/journalArticles";

export function useJournalArticles() {
  return useQuery<StorefrontJournalArticle[]>({
    queryKey: ["journal_articles"],
    queryFn: fetchPublishedJournalArticles,
    placeholderData: fallbackArticles.map((a) => ({
      ...a,
      author: a.author || "House of Padmavati",
      sort_order: a.sort_order ?? 0,
    })),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useJournalArticle(slug?: string) {
  const isPreviewRequested =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("studio_preview") === "true";

  const { data: previewArticle, isLoading: isPreviewLoading } = useQuery<StorefrontJournalArticle | null>({
    queryKey: ["journal_article_preview", slug],
    queryFn: () => (slug ? fetchJournalArticleBySlug(slug, { allowDraftPreview: true }) : Promise.resolve(null)),
    enabled: Boolean(slug && isPreviewRequested),
    staleTime: 0,
  });

  const { data: articles, isLoading: isListLoading } = useJournalArticles();

  if (isPreviewRequested) {
    return {
      article: previewArticle ?? null,
      isLoading: isPreviewLoading,
      isPreview: Boolean(previewArticle?.isPreview),
    };
  }

  const article = articles?.find((a) => a.slug === slug) ?? (slug ? fallbackArticles.find((a) => a.slug === slug) : null);
  return { article: article ?? null, isLoading: isListLoading, isPreview: false };
}
