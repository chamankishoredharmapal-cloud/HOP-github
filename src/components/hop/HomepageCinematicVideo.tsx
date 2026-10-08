import { useState, useRef, useEffect, useCallback } from "react";
import { Pause, Play } from "lucide-react";
import {
  getSupabaseOptimizedUrl,
  getSupabaseSrcSet,
  isSupabaseStorageUrl,
} from "@/lib/supabaseImage";

interface HomepageCinematicVideoProps {
  src?: string;
  poster?: string;
  alt?: string;
  className?: string;
}

export const HomepageCinematicVideo = ({
  src,
  poster,
  alt = "House of Padmavati — Homepage cinematic film",
  className = "",
}: HomepageCinematicVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoSrc, setHasVideoSrc] = useState(!!src);

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

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !src) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.1 },
    );
    io.observe(frame);
    return () => io.disconnect();
  }, [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src || !inView) return;
    if (v.readyState >= 2) {
      setVideoReady(true);
      doPlay(v);
    }
  }, [src, inView, doPlay]);

  const handleLoadedData = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      setVideoReady(true);
      doPlay(e.currentTarget);
    },
    [doPlay],
  );

  const handleVideoError = useCallback(() => {
    setVideoReady(false);
    setIsPlaying(false);
  }, []);

  return (
    <section className={`hop-cinematic-video ${className}`} aria-labelledby="cinematic-video-title">
      <div ref={frameRef} className="hop-cinematic-video__frame">
        {/* Poster layer — always rendered, no empty src */}
        <div className="hop-cinematic-video__poster-layer">
          {poster ? (
            <img
              src={isSupabaseStorageUrl(poster) ? getSupabaseOptimizedUrl(poster, { width: 1600 }) : poster}
              srcSet={isSupabaseStorageUrl(poster) ? getSupabaseSrcSet(poster, [640, 1024, 1600, 2560]) || undefined : undefined}
              sizes="100vw"
              alt={alt}
              loading="eager"
              decoding="async"
              fetchpriority="high"
              className="hop-cinematic-video__poster"
            />
          ) : (
            <div className="hop-cinematic-video__placeholder">
              <span className="text-[0.6rem] tracking-[0.2em] uppercase text-ink-soft/40">House of Padmavati</span>
            </div>
          )}
          <div className="hop-cinematic-video__gradient" aria-hidden="true" />
        </div>

        {/* Video layer — mounts in view, fades in when ready */}
        {src && inView && (
          <div
            className="hop-cinematic-video__video-layer"
            style={{ opacity: videoReady ? 1 : 0 }}
          >
            <video
              ref={videoRef}
              className="hop-cinematic-video__video"
              src={src}
              poster={poster}
              autoPlay={!reducedMotion}
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={alt}
              onLoadedData={handleLoadedData}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={handleVideoError}
            />
            <button
              type="button"
              onClick={togglePlayback}
              className="hop-cinematic-video__controls"
              aria-label={isPlaying ? "Pause film" : "Play film"}
              aria-pressed={!isPlaying}
            >
              {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        )}

        {/* Accessible title for screen readers (visually hidden) */}
        <h2 id="cinematic-video-title" className="sr-only">
          Homepage cinematic film
        </h2>
      </div>
    </section>
  );
};

export default HomepageCinematicVideo;