import { useState, useRef, useEffect, useCallback } from "react";

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
}: {
  src?: string;
  poster: string;
  alt: string;
  className?: string;
  isCinematic?: boolean;
  preload?: "auto" | "metadata" | "none";
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  const doPlay = useCallback(
    (v: HTMLVideoElement) => {
      v.muted = true;
      v.playsInline = true;
      v.play().catch((err) => console.error("Film play failed", src, err));
    },
    [src],
  );

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;
    if (v.readyState >= 2) {
      setVideoReady(true);
      doPlay(v);
    }
  }, [src, doPlay]);

  const handleLoadedData = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      setVideoReady(true);
      doPlay(e.currentTarget);
    },
    [doPlay],
  );

  const handleVideoError = useCallback(() => {
    console.error("Film video error", src);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-jasmine-deep ${className} ${isCinematic ? "rounded-2xl lg:rounded-3xl" : "rounded-md"} gallery-shadow`}>
      {/* Poster layer — always rendered */}
      <div className="absolute inset-0">
        <img
          src={poster}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover animate-[kenburns_22s_ease-in-out_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Video layer — fades in when ready */}
      {src && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: videoReady ? 1 : 0 }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload={preload}
            aria-label={alt}
            onLoadedData={handleLoadedData}
            onError={handleVideoError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent pointer-events-none" />
          {isCinematic && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-jasmine/90 backdrop-blur-sm flex items-center justify-center opacity-80">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-deep ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.14L19 12 8 18.86V5.14z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
