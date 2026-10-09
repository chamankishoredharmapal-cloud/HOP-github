import { supabase } from "@/integrations/supabase/client";
import type {
  PublishedSectionView,
  SiteSectionRecord,
  SiteSectionRevision,
} from "@/types/siteSections";

export interface SaveDraftResponse {
  success: boolean;
  new_version?: number;
  error?: string;
  current_version?: number;
  message?: string;
}

export interface PublishSectionResponse {
  success: boolean;
  revision_number?: number;
  published_at?: string;
  error?: string;
  current_version?: number;
  message?: string;
}

export interface RestoreSectionResponse {
  success: boolean;
  restored_revision?: number;
  new_revision_number?: number;
  new_version?: number;
  error?: string;
  current_version?: number;
  message?: string;
}

export const siteSectionService = {
  /**
   * Public storefront query: Fetches all published sections for a given page name.
   * Safe for anonymous visitors.
   */
  async getPublishedPageSections(
    pageName: string,
  ): Promise<Record<string, Record<string, unknown>>> {
    const { data, error } = await supabase.rpc("get_published_site_sections", {
      p_page: pageName,
    });
    if (error) {
      console.warn(`Failed to fetch published sections for page ${pageName}:`, error.message);
      return {};
    }
    return (data as Record<string, Record<string, unknown>>) || {};
  },

  /**
   * Public storefront query: Fetches a single published section by key.
   */
  async getPublishedSection(
    sectionKey: string,
  ): Promise<Record<string, unknown> | null> {
    const { data, error } = await supabase.rpc("get_published_section", {
      p_key: sectionKey,
    });
    if (error) {
      console.warn(`Failed to fetch published section ${sectionKey}:`, error.message);
      return null;
    }
    return (data as Record<string, unknown>) || null;
  },

  /**
   * Public storefront query: Read-only query via published_sections view.
   */
  async getPublishedSectionsList(pageName?: string): Promise<PublishedSectionView[]> {
    let query = supabase.from("published_sections").select("*");
    if (pageName) {
      query = query.eq("page_name", pageName);
    }
    const { data, error } = await query;
    if (error) {
      console.warn("Failed to fetch published_sections view:", error.message);
      return [];
    }
    return (data as PublishedSectionView[]) || [];
  },

  /**
   * Admin-only query: Fetches all site_sections including draft_payload.
   * Requires is_admin() session.
   */
  async getAdminSections(pageName?: string): Promise<SiteSectionRecord[]> {
    let query = supabase.from("site_sections").select("*").order("key");
    if (pageName) {
      query = query.eq("page_name", pageName);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data as SiteSectionRecord[]) || [];
  },

  /**
   * Admin-only mutation: Saves an unapproved draft payload with optimistic locking.
   */
  async saveDraft(
    key: string,
    expectedVersion: number,
    draftPayload: Record<string, unknown>,
  ): Promise<SaveDraftResponse> {
    const { data, error } = await supabase.rpc("save_site_section_draft", {
      p_key: key,
      p_expected_version: expectedVersion,
      p_draft_payload: draftPayload,
    });
    if (error) throw error;
    return data as SaveDraftResponse;
  },

  /**
   * Admin-only mutation: Atomically publishes draft to live storefront, creating an immutable revision.
   */
  async publishSection(
    key: string,
    expectedVersion: number,
    changeSummary?: string,
  ): Promise<PublishSectionResponse> {
    const { data, error } = await supabase.rpc("publish_site_section", {
      p_key: key,
      p_expected_version: expectedVersion,
      p_change_summary: changeSummary ?? null,
    });
    if (error) throw error;
    return data as PublishSectionResponse;
  },

  /**
   * Admin-only mutation: Restores a previous revision payload.
   */
  async restoreRevision(
    key: string,
    revisionNumber: number,
    expectedVersion: number,
    reason?: string,
  ): Promise<RestoreSectionResponse> {
    const { data, error } = await supabase.rpc("restore_site_section_revision", {
      p_key: key,
      p_revision_number: revisionNumber,
      p_expected_version: expectedVersion,
      p_reason: reason ?? null,
    });
    if (error) throw error;
    return data as RestoreSectionResponse;
  },

  /**
   * Admin-only query: Retrieves immutable historical revisions for a section.
   */
  async getRevisions(key: string): Promise<SiteSectionRevision[]> {
    const { data, error } = await supabase.rpc("get_section_revisions", {
      p_key: key,
    });
    if (error) throw error;
    return (data as SiteSectionRevision[]) || [];
  },
};
