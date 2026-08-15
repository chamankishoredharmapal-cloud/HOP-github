import { useEffect } from "react";

/**
 * Signals to the prerender script that the page has finished loading all critical data,
 * rendered its content, and injected metadata/JSON-LD.
 * @param isReady - Boolean indicating if the page is fully ready.
 */
export function usePrerenderReady(isReady: boolean) {
  useEffect(() => {
    if (isReady && typeof window !== "undefined") {
      // Delay slightly to ensure React has flushed the DOM and Helmet/Metadata has injected tags.
      const timer = setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__PRERENDER_STATUS = "ready";
      }, 100);
      return () => clearTimeout(timer);
    } else if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__PRERENDER_STATUS = "loading";
    }
  }, [isReady]);
}
