import { useState, useRef, useEffect, useCallback } from "react";
import { resolveOptimizedVideo } from "@/data/collectionVideos";

export interface LivingSareeSectionProps {
  src?: string;
  mobileSrc?: string;
  poster?: string;
  alt?: string;
  className?: string;
  isEnabled?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export const LivingSareeSection = ({
  src,
  mobileSrc,
  poster,
  alt = "Living Saree visual study",
  className = "",
  isEnabled = true,
  autoplay = true,
  loop = true,
  muted = true,
}: LivingSareeSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );

  // Resolve multi-resolution video variants if matching known optimized HOP films
  const resolved = resolveOptimizedVideo(src);
  const effectiveSrc = (resolved.src || src)?.trim() || undefined;
  const effectiveMobileSrc = mobileSrc?.trim() || (resolved.mobileSrc !== effectiveSrc ? resolved.mobileSrc : undefined);
  const displayPoster = poster?.trim() || resolved.poster || undefined;

  const hasVideo = Boolean(isEnabled !== false && effectiveSrc);

  const doPlay = useCallback((v: HTMLVideoElement) => {
    v.muted = muted;
    v.playsInline = true;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (conn?.saveData) return;
    } catch {
      /* connection API unavailable — autoplay as normal */
    }
    v.play().catch(() => {});
  }, [muted]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !hasVideo) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsMounted(true);
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsMounted(true);
            setInView(true);
            const v = videoRef.current;
            if (v && v.paused) {
              doPlay(v);
            }
          } else {
            setInView(false);
            const v = videoRef.current;
            if (v && !v.paused) {
              v.pause();
            }
          }
        }
      },
      { rootMargin: "300px 0px", threshold: 0.05 },
    );
    io.observe(frame);
    return () => io.disconnect();
  }, [hasVideo, doPlay]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !hasVideo || !inView) return;
    if (v.readyState >= 2) {
      setVideoReady(true);
      doPlay(v);
    }
  }, [hasVideo, inView, doPlay]);

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
    setVideoReady(false);
  }, []);

  return (
    <section
      className={`hop-living-saree ${className}`}
      aria-label="Living Saree visual study"
    >
      <div ref={frameRef} className="hop-living-saree__frame">
        {/* If video is configured: render only the video with native poster attribute; zero img tags, zero controls */}
        {hasVideo && isMounted && (
          <div
            className="hop-living-saree__video-layer"
            style={{ opacity: videoReady ? 1 : 0 }}
          >
            <video
              ref={videoRef}
              className="hop-living-saree__media hop-living-saree__video"
              poster={displayPoster}
              autoPlay={!reducedMotion && autoplay}
              muted={muted}
              loop={loop}
              playsInline
              preload={inView ? "metadata" : "none"}
              aria-label={alt}
              onLoadedData={handleLoadedData}
              onError={handleVideoError}
            >
              {effectiveMobileSrc && (
                <source media="(max-width: 767px)" src={effectiveMobileSrc} type="video/mp4" />
              )}
              {effectiveSrc && (
                <source src={effectiveSrc} type="video/mp4" />
              )}
            </video>
          </div>
        )}
      </div>
    </section>
  );
};

export default LivingSareeSection;
