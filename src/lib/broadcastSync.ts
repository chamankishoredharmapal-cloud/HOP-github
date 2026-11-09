/**
 * Cross-Tab Synchronization for Site Section Publications
 *
 * Broadcasts publication events across browser tabs using the standard BroadcastChannel API,
 * with a localStorage storage-event fallback for cross-window / browser compatibility.
 */

export const BROADCAST_CHANNEL_NAME = "hop_site_sections_sync";
export const LOCAL_STORAGE_SYNC_KEY = "hop_site_sections_last_published";

export interface SectionPublicationMessage {
  key: string;
  revision?: number;
  timestamp: number;
}

/**
 * Notifies all open storefront tabs across windows that a section has been published live.
 */
export function broadcastSectionPublication(sectionKey: string, revisionNumber?: number): void {
  const payload: SectionPublicationMessage = {
    key: sectionKey,
    revision: revisionNumber,
    timestamp: Date.now(),
  };

  try {
    if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage(payload);
      channel.close();
    }
  } catch {
    // BroadcastChannel unsupported or blocked
  }

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(LOCAL_STORAGE_SYNC_KEY, JSON.stringify(payload));
    }
  } catch {
    // localStorage unsupported or blocked
  }
}
