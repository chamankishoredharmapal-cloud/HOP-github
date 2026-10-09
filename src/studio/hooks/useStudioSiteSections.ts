import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { siteSectionService } from "@/services/siteSectionService";
import type { SiteSectionRecord, SiteSectionRevision } from "@/types/siteSections";
import { toast } from "sonner";

export function useStudioSiteSections(pageName: string = "home") {
  return useQuery<SiteSectionRecord[]>({
    queryKey: ["studio", "site_sections", pageName],
    queryFn: () => siteSectionService.getAdminSections(pageName),
  });
}

export function useSaveSectionDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      key,
      expectedVersion,
      draftPayload,
    }: {
      key: string;
      expectedVersion: number;
      draftPayload: Record<string, unknown>;
    }) => {
      return siteSectionService.saveDraft(key, expectedVersion, draftPayload);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["studio", "site_sections"] });
      qc.invalidateQueries({ queryKey: ["site_sections", "draft_preview"] });
      if (data.success) {
        toast.success("Draft saved successfully", {
          description: `Version incremented to v${data.new_version}`,
        });
      } else if (data.error === "concurrency_conflict") {
        toast.error("Concurrency Conflict", {
          description: data.message || "Another administrator modified this section. Please reload.",
        });
      }
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to save draft";
      toast.error("Failed to save draft", { description: msg });
    },
  });
}

export function usePublishSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      key,
      expectedVersion,
      changeSummary,
    }: {
      key: string;
      expectedVersion: number;
      changeSummary?: string;
    }) => {
      return siteSectionService.publishSection(key, expectedVersion, changeSummary);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["studio", "site_sections"] });
      qc.invalidateQueries({ queryKey: ["site_sections", "published"] });
      qc.invalidateQueries({ queryKey: ["site_sections", "draft_preview"] });
      if (data.success) {
        toast.success("Section published live to storefront", {
          description: `Revision #${data.revision_number} is now visible to all visitors`,
        });
      } else if (data.error === "concurrency_conflict") {
        toast.error("Concurrency Conflict", {
          description: data.message || "Another administrator modified this section. Please reload.",
        });
      }
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to publish section";
      toast.error("Failed to publish section", { description: msg });
    },
  });
}

export function useSectionRevisions(sectionKey?: string) {
  return useQuery<SiteSectionRevision[]>({
    queryKey: ["studio", "site_sections", "revisions", sectionKey],
    queryFn: () => (sectionKey ? siteSectionService.getRevisions(sectionKey) : Promise.resolve([])),
    enabled: Boolean(sectionKey),
  });
}
