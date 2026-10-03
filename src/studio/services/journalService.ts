import { supabase } from "@/integrations/supabase/client";
import { type JournalArticle } from "@/data/journalArticles";
import { activityService } from "./activityService";

export interface StudioJournalArticle extends JournalArticle {
  id: string;
  status: "draft" | "published" | "archived";
  content?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface JournalArticleRow {
  id: string;
  slug: string;
  title: string;
  tag: string;
  img: string;
  asset_path: string | null;
  dek: string;
  content: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(r: JournalArticleRow): StudioJournalArticle {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    tag: r.tag,
    img: r.img,
    assetPath: r.asset_path ?? undefined,
    dek: r.dek,
    content: r.content ?? undefined,
    status: (r.status as "draft" | "published" | "archived") || "published",
    published_at: r.published_at ?? undefined,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export const journalService = {
  async getAll(): Promise<StudioJournalArticle[]> {
    const { data, error } = await supabase
      .from("journal_articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch journal articles from Supabase:", error);
      throw error;
    }

    return (data || []).map(mapRow);
  },

  async getById(id: string): Promise<StudioJournalArticle | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = supabase.from("journal_articles").select("*");
    if (isUuid) {
      query = query.eq("id", id);
    } else {
      query = query.eq("slug", id);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error("Failed to fetch journal article by id:", error);
      throw error;
    }
    return data ? mapRow(data) : null;
  },

  async create(
    article: Omit<StudioJournalArticle, "id" | "created_at" | "updated_at">
  ): Promise<StudioJournalArticle> {
    const { data, error } = await supabase
      .from("journal_articles")
      .insert({
        slug: article.slug,
        title: article.title,
        tag: article.tag,
        img: article.img,
        asset_path: article.assetPath ?? null,
        dek: article.dek,
        content: article.content ?? null,
        status: article.status,
        published_at: article.status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create journal article:", error);
      throw error;
    }

    const created = mapRow(data);

    await activityService.log({
      action: "journal_created",
      entityType: "journal",
      entityId: created.id,
      entityName: created.title,
      details: { slug: created.slug, status: created.status },
    });

    return created;
  },

  async update(
    id: string,
    updates: Partial<StudioJournalArticle>
  ): Promise<StudioJournalArticle> {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.slug !== undefined) updatePayload.slug = updates.slug;
    if (updates.title !== undefined) updatePayload.title = updates.title;
    if (updates.tag !== undefined) updatePayload.tag = updates.tag;
    if (updates.img !== undefined) updatePayload.img = updates.img;
    if (updates.assetPath !== undefined) updatePayload.asset_path = updates.assetPath;
    if (updates.dek !== undefined) updatePayload.dek = updates.dek;
    if (updates.content !== undefined) updatePayload.content = updates.content;
    if (updates.status !== undefined) {
      updatePayload.status = updates.status;
      if (updates.status === "published") {
        updatePayload.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from("journal_articles")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update journal article:", error);
      throw error;
    }

    const updated = mapRow(data);

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
    const existing = await journalService.getById(id);

    const { error } = await supabase
      .from("journal_articles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete journal article:", error);
      throw error;
    }

    if (existing) {
      await activityService.log({
        action: "journal_deleted",
        entityType: "journal",
        entityId: id,
        entityName: existing.title,
      });
    }
  },
};
