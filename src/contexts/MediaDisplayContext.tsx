/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type MediaDisplayMode = "structure-only" | "show-media";

export const MEDIA_DISPLAY_MODE_STORAGE_KEY = "hop_media_display_mode";
export const MEDIA_DISPLAY_MODE_EVENT = "hop-media-display-mode-change";
export const DEFAULT_MEDIA_DISPLAY_MODE: MediaDisplayMode = "show-media";

export interface MediaDisplayContextValue {
  /** Currently active media display mode */
  mode: MediaDisplayMode;
  /** Whether structure-only mode is active (true when all visual media is disabled) */
  isStructureOnly: boolean;
  /** Set the media display mode across the entire application */
  setMode: (mode: MediaDisplayMode) => void;
  /** Toggle between structure-only and show-media modes */
  toggleMode: () => void;
}

/**
 * Reads the authoritative media display mode from storage or query parameter.
 * Defaults to normal storefront media rendering.
 */
export function getStoredMediaDisplayMode(): MediaDisplayMode {
  if (typeof window === "undefined") {
    return DEFAULT_MEDIA_DISPLAY_MODE;
  }

  try {
    // 1. URL parameter override (?media_mode=show-media | ?media_mode=structure-only)
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get("media_mode");
    if (urlParam === "show-media" || urlParam === "structure-only") {
      return urlParam;
    }

    // 2. Local storage persistence
    const stored = window.localStorage?.getItem(MEDIA_DISPLAY_MODE_STORAGE_KEY);
    if (stored === "show-media" || stored === "structure-only") {
      return stored;
    }
  } catch {
    /* localStorage disabled or restricted */
  }

  return DEFAULT_MEDIA_DISPLAY_MODE;
}

/**
 * Sets the media display mode in localStorage and updates root document attribute.
 */
export function persistMediaDisplayMode(mode: MediaDisplayMode): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage?.setItem(MEDIA_DISPLAY_MODE_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }

  try {
    document.documentElement.setAttribute("data-media-mode", mode);
  } catch {
    /* ignore */
  }

  window.dispatchEvent(
    new CustomEvent(MEDIA_DISPLAY_MODE_EVENT, { detail: mode }),
  );
}

export const MediaDisplayContext = createContext<MediaDisplayContextValue | null>(null);

export interface MediaDisplayProviderProps {
  children?: ReactNode;
  initialMode?: MediaDisplayMode;
}

export function MediaDisplayProvider({ children, initialMode }: MediaDisplayProviderProps) {
  const [mode, setModeState] = useState<MediaDisplayMode>(() => {
    return initialMode || getStoredMediaDisplayMode();
  });

  const setMode = useCallback((newMode: MediaDisplayMode) => {
    setModeState(newMode);
    persistMediaDisplayMode(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((current) => {
      const next: MediaDisplayMode = current === "structure-only" ? "show-media" : "structure-only";
      persistMediaDisplayMode(next);
      return next;
    });
  }, []);

  // Sync with DOM attribute and listen for cross-tab or external changes
  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-media-mode", mode);
    } catch {
      /* ignore */
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === MEDIA_DISPLAY_MODE_STORAGE_KEY && event.newValue) {
        if (event.newValue === "show-media" || event.newValue === "structure-only") {
          setModeState(event.newValue);
        }
      }
    };

    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<MediaDisplayMode>;
      if (customEvent.detail && (customEvent.detail === "show-media" || customEvent.detail === "structure-only")) {
        setModeState(customEvent.detail);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(MEDIA_DISPLAY_MODE_EVENT, handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(MEDIA_DISPLAY_MODE_EVENT, handleCustomEvent);
    };
  }, [mode]);

  const value: MediaDisplayContextValue = {
    mode,
    isStructureOnly: mode === "structure-only",
    setMode,
    toggleMode,
  };

  return (
    <MediaDisplayContext.Provider value={value}>
      {children}
    </MediaDisplayContext.Provider>
  );
}

/**
 * Authoritative hook for accessing and controlling site-wide media display mode.
 * Safe to use in any component, including isolated unit tests without provider.
 */
export function useMediaDisplayMode(): MediaDisplayContextValue {
  const context = useContext(MediaDisplayContext);
  if (!context) {
    // If an explicit stored mode exists in localStorage or query params, respect it;
    // otherwise default to "show-media" when unprovided in isolated unit tests
    let unprovidedMode: MediaDisplayMode = "show-media";
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlParam = params.get("media_mode");
        if (urlParam === "show-media" || urlParam === "structure-only") {
          unprovidedMode = urlParam;
        } else {
          const stored = window.localStorage?.getItem(MEDIA_DISPLAY_MODE_STORAGE_KEY);
          if (stored === "show-media" || stored === "structure-only") {
            unprovidedMode = stored;
          }
        }
      } catch {
        /* ignore */
      }
    }
    return {
      mode: unprovidedMode,
      isStructureOnly: unprovidedMode === "structure-only",
      setMode: persistMediaDisplayMode,
      toggleMode: () => {
        const next = unprovidedMode === "structure-only" ? "show-media" : "structure-only";
        persistMediaDisplayMode(next);
      },
    };
  }
  return context;
}

export default MediaDisplayProvider;
