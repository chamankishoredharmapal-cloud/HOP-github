import { useState, useRef, useEffect, useCallback } from "react";
import { Pause, Play } from "lucide-react";

/**
 * Cinematic media frame — uses native <video> with poster fallback.
 * Drop MP4s into Supabase Storage and pass their public URL via `src`.
 * Poster is always rendered underneath; video fades in when ready.
 */
export const Film = ({
  src,
  poster,
  alt,
  className = "",
  isCinematic = false,
  preload = "metadata",
  priority = false,
}: {
  src?: string;
  poster: string;
  alt: string;
  className?: string;
  isCinematic?: boolean;
  preload?: "auto" | "metadata" | "none";
  priority?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [inView, setInView] = useState(false);
  // Reduced-motion preference is read at mount so the browser never autoplays
  // for visitors who ask for stillness (the autoPlay attribute alone would win).
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const doPlay = useCallback(
    (v: HTMLVideoElement) => {
      v.muted = true;
      v.playsInline = true;
      // Respect visitors who ask for reduced motion — leave the still frame.
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
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

  // Only load / play the film when its frame enters the viewport.
  // Prevents 5+ simultaneous autoplays on collection feeds.
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
    // Poster remains — a still frame is an acceptable, quiet fallback.
    setVideoReady(false);
    setIsPlaying(false);
  }, []);

  return (
    <div ref={frameRef} className={`relative overflow-hidden bg-jasmine-deep ${className} ${isCinematic ? "rounded-2xl lg:rounded-3xl" : "rounded-sm"} gallery-shadow`}>
      {/* Poster layer — guarded: never render empty src */}
      <div className="absolute inset-0">
        {poster ? (
          <img
            src={poster}
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
        <div className="absolute inset-0 bg-gradient-to-t from-ink/15 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Video layer — mounts in view, fades in when ready */}
      {src && inView && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: videoReady ? 1 : 0 }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={src}
            poster={poster}
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            preload={priority ? "auto" : preload}
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
             className="absolute bottom-4 right-4 min-h-[44px] min-w-[44px] rounded-full bg-ink/70 p-3 text-paper-ivory backdrop-blur-sm transition-colors hover:bg-ink/90"
             aria-label={isPlaying ? "Pause film" : "Play film"}
             aria-pressed={!isPlaying}
           >
             {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
           </button>
        </div>
      )}
    </div>
  );
};
