import { articles as initialArticles, type JournalArticle } from "@/data/journalArticles";
import { activityService } from "./activityService";

export interface StudioJournalArticle extends JournalArticle {
  id: string;
  status: "draft" | "published" | "archived";
  content?: string;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = "hop_studio_journal_articles";

function getStoredArticles(): StudioJournalArticle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore error
  }

  // Seed with initial articles
  const seeded: StudioJournalArticle[] = initialArticles.map((a, idx) => ({
    id: `article-${idx + 1}`,
    slug: a.slug,
    title: a.title,
    tag: a.tag,
    img: a.img,
    assetPath: a.assetPath,
    dek: a.dek,
    status: "published",
    content: `${a.dek}\n\nField notes recorded from the looms and weavers of House of Padmavati.`,
    created_at: new Date(Date.now() - (idx + 1) * 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - (idx + 1) * 86400000 * 5).toISOString(),
  }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  } catch {
    // Ignore error
  }
  return seeded;
}

function saveStoredArticles(articles: StudioJournalArticle[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch {
    // Ignore storage quota
  }
}

export const journalService = {
  async getAll(): Promise<StudioJournalArticle[]> {
    return getStoredArticles();
  },

  async getById(id: string): Promise<StudioJournalArticle | null> {
    const list = getStoredArticles();
    return list.find((a) => a.id === id || a.slug === id) ?? null;
  },

  async create(
    article: Omit<StudioJournalArticle, "id" | "created_at" | "updated_at">,
  ): Promise<StudioJournalArticle> {
    const list = getStoredArticles();
    const newArticle: StudioJournalArticle = {
      ...article,
      id: `article-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    list.unshift(newArticle);
    saveStoredArticles(list);

    await activityService.log({
      action: "journal_created",
      entityType: "journal",
      entityId: newArticle.id,
      entityName: newArticle.title,
      details: { slug: newArticle.slug, status: newArticle.status },
    });

    return newArticle;
  },

  async update(
    id: string,
    updates: Partial<StudioJournalArticle>,
  ): Promise<StudioJournalArticle> {
    const list = getStoredArticles();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error("Article not found");

    const updated: StudioJournalArticle = {
      ...list[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredArticles(list);

    await activityService.log({
      action: "journal_updated",
      entityType: "journal",
      entityId: id,
      entityName: updated.title,
      details: updates,
    });

    return updated;
  },

  async delete(id: string): Promise<void> {
    const list = getStoredArticles();
    const target = list.find((a) => a.id === id);
    const filtered = list.filter((a) => a.id !== id);
    saveStoredArticles(filtered);

    if (target) {
      await activityService.log({
        action: "journal_deleted",
        entityType: "journal",
        entityId: id,
        entityName: target.title,
      });
    }
  },
};
