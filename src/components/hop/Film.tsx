import { useState, useRef, useEffect, useCallback } from "react";
import { Pause, Play } from "lucide-react";
import { useMediaDisplayMode } from "@/contexts/MediaDisplayContext";
import {
  getSupabaseOptimizedUrl,
  getSupabaseSrcSet,
  isSupabaseStorageUrl,
} from "@/lib/supabaseImage";

export interface FilmProps {
  src?: string;
  mobileSrc?: string;
  poster: string;
  alt: string;
  className?: string;
  isCinematic?: boolean;
  preload?: "auto" | "metadata" | "none";
  priority?: boolean;
  showControls?: boolean;
}

/**
 * Cinematic media frame — uses native <video> with poster fallback.
 * Supports multi-resolution responsive sources (720p desktop + 540p mobile),
 * fast-start metadata streaming, and viewport-aware play/pause lifecycle.
 */
export const Film = ({
  src,
  mobileSrc,
  poster,
  alt,
  className = "",
  isCinematic = false,
  preload = "metadata",
  priority = false,
  showControls = true,
}: FilmProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Priority videos (hero) mount immediately. Lazy videos mount once near viewport.
  const [isMounted, setIsMounted] = useState(priority);
  // Viewport intersection state: always false initially until confirmed by observer,
  // preventing off-screen videos from autoplaying on page load.
  const [inView, setInView] = useState(false);

  // Reduced-motion preference check
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const { isStructureOnly } = useMediaDisplayMode();



  const doPlay = useCallback(
    (v: HTMLVideoElement) => {
      v.muted = true;
      v.playsInline = true;
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      try {
        const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
        if (conn?.saveData) return;
      } catch {
        /* connection API unavailable — autoplay as normal */
      }
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    },
    [],
  );

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      doPlay(video);
    } else {
      video.pause();
    }
  }, [doPlay]);

  // Viewport lifecycle:
  // - Intersecting viewport (rootMargin: 0px): mount <video> tag and play
  // - Scrolled out of viewport: pause immediately to release decoder/CPU/network
  useEffect(() => {
    if (isStructureOnly) return;
    const frame = frameRef.current;
    if (!frame || !src) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsMounted(true);
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            setIsMounted(true);
            setInView(true);
            const v = videoRef.current;
            if (v && v.paused) {
              doPlay(v);
            }
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.05) {
            setInView(false);
            const v = videoRef.current;
            if (v && !v.paused) {
              v.pause();
            }
          }
        }
      },
      { rootMargin: "0px", threshold: [0, 0.05, 0.15] },
    );

    io.observe(frame);
    return () => {
      io.disconnect();
    };
  }, [src, doPlay, isStructureOnly]);

  // Tab visibility change listener: pause when tab hidden, resume when tab visible and element in view
  useEffect(() => {
    if (isStructureOnly) return;
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      const v = videoRef.current;
      if (!v) return;
      if (!isVisible && !v.paused) {
        v.pause();
      } else if (isVisible && inView && v.paused) {
        doPlay(v);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [inView, doPlay, isStructureOnly]);

  // Teardown on unmount: ensure video pauses and frees media resources
  useEffect(() => {
    const ref = videoRef;
    return () => {
      const v = ref.current;
      if (v && !v.paused) {
        v.pause();
      }
    };
  }, []);

  // When video mounts and is ready, trigger playback if in view
  useEffect(() => {
    if (isStructureOnly) return;
    const v = videoRef.current;
    if (!v || !src || !inView) return;
    if (v.readyState >= 2) {
      setVideoReady(true);
      doPlay(v);
    }
  }, [src, inView, doPlay, isStructureOnly]);

  const handleLoadedData = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      setVideoReady(true);
      if (inView) {
        doPlay(e.currentTarget);
      }
    },
    [inView, doPlay],
  );

  const handleVideoError = useCallback(() => {
    // Graceful fallback: poster remains without disruption
    setVideoReady(false);
    setIsPlaying(false);
  }, []);

  // In structure-only mode: render pure structural frame with zero media requests and zero video mounting
  if (isStructureOnly) {
    return (
      <div
        ref={frameRef}
        className={`relative overflow-hidden bg-jasmine-deep/35 ${className} ${
          isCinematic ? "rounded-2xl lg:rounded-3xl" : "rounded-sm"
        } gallery-shadow select-none transition-colors`}
        aria-hidden="true"
        role="presentation"
      />
    );
  }

  return (
    <div
      ref={frameRef}
      className={`relative overflow-hidden bg-jasmine-deep ${className} ${
        isCinematic ? "rounded-2xl lg:rounded-3xl" : "rounded-sm"
      } gallery-shadow`}
    >
      {/* Poster layer — always rendered underneath for instant visual stability */}
      <div className="absolute inset-0">
        {poster ? (
          <img
            src={isSupabaseStorageUrl(poster) ? getSupabaseOptimizedUrl(poster, { width: 1200 }) : poster}
            srcSet={isSupabaseStorageUrl(poster) ? getSupabaseSrcSet(poster, [640, 1024, 1600]) || undefined : undefined}
            sizes="100vw"
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            {...(priority ? { fetchpriority: "high" } : {})}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-jasmine-deep flex items-center justify-center">
            <span className="text-[0.6rem] tracking-[0.2em] uppercase text-ink-soft/40">House of Padmavati</span>
          </div>
        )}
      </div>

      {/* Video layer — mounted on-demand, fades in smoothly when first frame ready */}
      {src && isMounted && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: videoReady ? 1 : 0 }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={poster}
            autoPlay={!reducedMotion && inView}
            muted
            loop
            playsInline
            preload={priority ? "auto" : (inView ? "metadata" : "none")}
            aria-label={alt}
            onLoadedData={handleLoadedData}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={handleVideoError}
          >
            {mobileSrc && (
              <source media="(max-width: 767px)" src={mobileSrc} type="video/mp4" />
            )}
            <source src={src} type="video/mp4" />
          </video>

          {showControls && (
            <button
              type="button"
              onClick={togglePlayback}
              className="absolute bottom-4 right-4 min-h-[44px] min-w-[44px] rounded-full bg-ink/70 p-3 text-paper-ivory backdrop-blur-sm transition-colors hover:bg-ink/90"
              aria-label={isPlaying ? "Pause film" : "Play film"}
              aria-pressed={!isPlaying}
            >
              {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
