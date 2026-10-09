import { useQuery } from "@tanstack/react-query";
import { fetchPublishedJournalArticles, type StorefrontJournalArticle } from "@/services/journalService";
import { articles as fallbackArticles } from "@/data/journalArticles";

export function useJournalArticles() {
  return useQuery<StorefrontJournalArticle[]>({
    queryKey: ["journal_articles"],
    queryFn: fetchPublishedJournalArticles,
    placeholderData: fallbackArticles,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useJournalArticle(slug?: string) {
  const { data: articles, isLoading } = useJournalArticles();
  const article = articles?.find((a) => a.slug === slug) ?? (slug ? fallbackArticles.find((a) => a.slug === slug) : null);
  return { article: article ?? null, isLoading };
}
