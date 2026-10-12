import { supabase } from "@/integrations/supabase/client";
import { type JournalArticle } from "@/data/journalArticles";
import { activityService } from "./activityService";

export interface StudioJournalArticle extends JournalArticle {
  id: string;
  status: "draft" | "published" | "archived";
  content?: string;
  author: string;
  image_alt?: string;
  sort_order: number;
  archived_at?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface JournalArticleRevision {
  id: string;
  article_id: string;
  revision_number: number;
  title: string;
  slug: string;
  tag: string;
  img: string;
  asset_path?: string;
  dek: string;
  content?: string;
  author: string;
  image_alt?: string;
  status: string;
  snapshot: Record<string, unknown>;
  change_summary?: string;
  actor_email?: string;
  created_at: string;
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
  author: string | null;
  image_alt: string | null;
  sort_order: number | null;
  status: string;
  archived_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface JournalRevisionRow {
  id: string;
  article_id: string;
  revision_number: number;
  title: string;
  slug: string;
  tag: string;
  img: string;
  asset_path: string | null;
  dek: string;
  content: string | null;
  author: string | null;
  image_alt: string | null;
  status: string;
  snapshot: Record<string, unknown>;
  change_summary: string | null;
  actor_email: string | null;
  created_at: string;
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
    author: r.author || "House of Padmavati",
    image_alt: r.image_alt ?? undefined,
    sort_order: r.sort_order ?? 0,
    status: (r.status as "draft" | "published" | "archived") || "published",
    archived_at: r.archived_at ?? undefined,
    published_at: r.published_at ?? undefined,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export const journalService = {
  async getAll(filter?: { status?: string; search?: string }): Promise<StudioJournalArticle[]> {
    let query = supabase
      .from("journal_articles")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (filter?.status && filter.status !== "all") {
      query = query.eq("status", filter.status);
    }

    if (filter?.search && filter.search.trim()) {
      const q = `%${filter.search.trim()}%`;
      query = query.or(`title.ilike.${q},dek.ilike.${q},slug.ilike.${q},tag.ilike.${q}`);
    }

    const { data, error } = await query;

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

  async checkSlugAvailability(slug: string, currentArticleId?: string): Promise<{ available: boolean }> {
    let query = supabase.from("journal_articles").select("id").eq("slug", slug);
    if (currentArticleId) {
      query = query.neq("id", currentArticleId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return { available: !data || data.length === 0 };
  },

  async create(
    article: Omit<StudioJournalArticle, "id" | "created_at" | "updated_at">,
    changeSummary: string = "Initial publication"
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
        author: article.author || "House of Padmavati",
        image_alt: article.image_alt ?? null,
        sort_order: article.sort_order ?? 0,
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

    // Snapshot revision #1
    try {
      await supabase.rpc("save_journal_article_revision", {
        p_article_id: created.id,
        p_change_summary: changeSummary,
      });
    } catch (revErr) {
      console.warn("Failed to capture baseline revision for new article:", revErr);
    }

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
    updates: Partial<StudioJournalArticle>,
    changeSummary?: string
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
    if (updates.author !== undefined) updatePayload.author = updates.author;
    if (updates.image_alt !== undefined) updatePayload.image_alt = updates.image_alt;
    if (updates.sort_order !== undefined) updatePayload.sort_order = updates.sort_order;
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

    // Snapshot new revision
    try {
      await supabase.rpc("save_journal_article_revision", {
        p_article_id: id,
        p_change_summary: changeSummary || "Updated reflection details",
      });
    } catch (revErr) {
      console.warn("Failed to capture revision:", revErr);
    }

    await activityService.log({
      action: "journal_updated",
      entityType: "journal",
      entityId: id,
      entityName: updated.title,
      details: updates,
    });

    return updated;
  },

  async archive(id: string): Promise<StudioJournalArticle> {
    const { data, error } = await supabase.rpc("archive_journal_article", {
      p_id: id,
    });

    if (error) {
      console.error("Failed to archive article via RPC:", error);
      throw error;
    }

    return mapRow(data as JournalArticleRow);
  },

  async restore(id: string): Promise<StudioJournalArticle> {
    const { data, error } = await supabase.rpc("restore_journal_article", {
      p_id: id,
    });

    if (error) {
      console.error("Failed to restore article via RPC:", error);
      throw error;
    }

    return mapRow(data as JournalArticleRow);
  },

  async getRevisions(articleId: string): Promise<JournalArticleRevision[]> {
    const { data, error } = await supabase
      .from("journal_article_revisions")
      .select("*")
      .eq("article_id", articleId)
      .order("revision_number", { ascending: false });

    if (error) {
      console.error("Failed to fetch journal revisions:", error);
      throw error;
    }

    return ((data || []) as JournalRevisionRow[]).map((r) => ({
      id: r.id,
      article_id: r.article_id,
      revision_number: r.revision_number,
      title: r.title,
      slug: r.slug,
      tag: r.tag,
      img: r.img,
      asset_path: r.asset_path ?? undefined,
      dek: r.dek,
      content: r.content ?? undefined,
      author: r.author || "House of Padmavati",
      image_alt: r.image_alt ?? undefined,
      status: r.status,
      snapshot: r.snapshot,
      change_summary: r.change_summary ?? undefined,
      actor_email: r.actor_email ?? undefined,
      created_at: r.created_at,
    }));
  },

  async restoreRevision(articleId: string, revisionNumber: number): Promise<StudioJournalArticle> {
    const { data, error } = await supabase.rpc("restore_journal_article_revision", {
      p_article_id: articleId,
      p_revision_number: revisionNumber,
    });

    if (error) {
      console.error("Failed to restore journal revision:", error);
      throw error;
    }

    return mapRow(data as JournalArticleRow);
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
