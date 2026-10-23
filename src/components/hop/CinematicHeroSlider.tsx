import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveOptimizedVideo } from "@/data/collectionVideos";
import {
  getSupabaseOptimizedUrl,
  getSupabaseSrcSet,
  isSupabaseStorageUrl,
} from "@/lib/supabaseImage";
import type { HeroBannerPayload, HeroSlide } from "@/types/siteSections";
import { DEFAULT_HERO_SLIDES } from "@/types/siteSections";
import heroStill from "@/assets/hop-hero.jpg";

export interface CinematicHeroSliderProps {
  section?: HeroBannerPayload;
  className?: string;
  onSlideChange?: (index: number) => void;
}

const SWIPE_THRESHOLD_PX = 48;
const WHEEL_THRESHOLD_PX = 60;
const POINTER_NAV_COOLDOWN_MS = 350;
const WHEEL_NAV_COOLDOWN_MS = 900;
const WHEEL_GESTURE_RESET_MS = 180;

export const CinematicHeroSlider = ({
  section,
  className = "",
  onSlideChange,
}: CinematicHeroSliderProps) => {
  // 1. Resolve and filter active slides
  const activeSlides = useMemo<HeroSlide[]>(() => {
    const rawSlides = section?.slides;
    if (rawSlides && rawSlides.length > 0) {
      const active = rawSlides.filter((s) => s.is_active !== false);
      if (active.length > 0) return active;
    }

    // Backwards-compatible fallback: if top-level section video is set
    if (section?.video_url && section.video_url.trim()) {
      const resolved = resolveOptimizedVideo(section.video_url);
      return [
        {
          id: "slide-legacy-single",
          video_url: resolved.src || section.video_url,
          mobile_video_url: resolved.mobileSrc,
          poster_url: section.poster_url || resolved.poster || heroStill,
          duration: 5,
          is_active: true,
          title: section.title,
          subtitle: section.subtitle,
          eyebrow: section.eyebrow,
          alt_text: section.alt_text,
          primary_cta: section.primary_cta,
          secondary_cta: section.secondary_cta,
        },
        ...DEFAULT_HERO_SLIDES.slice(1),
      ];
    }

    return DEFAULT_HERO_SLIDES;
  }, [section]);

  // 2. State management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioningFromIndex, setTransitioningFromIndex] = useState<number | null>(null);
  const [inView, setInView] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [videoReadyStates, setVideoReadyStates] = useState<Record<number, boolean>>({});

  // Reduced-motion preference check
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );

  const containerRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const swipeStartRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const lastPointerNavRef = useRef(0);
  const lastWheelNavRef = useRef(0);
  const wheelDeltaRef = useRef(0);
  const wheelResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Current slide information
  const totalSlides = activeSlides.length;
  const safeCurrentIndex = currentIndex % totalSlides;
  const currentSlide = activeSlides[safeCurrentIndex] || activeSlides[0];

  // Duration is capped at 5 seconds (targeting 3–5 seconds), min 1 second
  const displayDurationSec = Math.min(Math.max(currentSlide.duration || 5, 1), 5);
  const displayDurationMs = displayDurationSec * 1000;

  // Callback on change
  useEffect(() => {
    onSlideChange?.(safeCurrentIndex);
  }, [safeCurrentIndex, onSlideChange]);

  // 3. Play video with safety against autoplay policies and save-data
  const playVideoSafe = useCallback((v: HTMLVideoElement | null) => {
    if (!v) return;
    v.muted = true;
    v.playsInline = true;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    try {
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (conn?.saveData) return;
    } catch {
      /* ignore */
    }

    v.play().catch(() => {
      // Graceful fallback: poster remains displayed without disruptive errors
    });
  }, []);

  // 4. Advance to next slide with 850ms luxury cross-fade
  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (totalSlides <= 1) return;
      const normalized = ((targetIndex % totalSlides) + totalSlides) % totalSlides;
      if (normalized === safeCurrentIndex) return;

      // Begin luxury cross-fade: mark outgoing slide
      setTransitioningFromIndex(safeCurrentIndex);
      setCurrentIndex(normalized);

      // Start playing incoming slide
      const incomingVideo = videoRefs.current.get(normalized);
      if (incomingVideo) {
        incomingVideo.currentTime = 0;
        playVideoSafe(incomingVideo);
      }

      // Clear previous transition timer
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }

      // Complete cross-fade after 850ms: pause outgoing video and clear transition state
      transitionTimerRef.current = setTimeout(() => {
        const outgoingVideo = videoRefs.current.get(safeCurrentIndex);
        if (outgoingVideo) {
          outgoingVideo.pause();
        }
        setTransitioningFromIndex(null);
      }, 850);
    },
    [totalSlides, safeCurrentIndex, playVideoSafe],
  );

  const nextSlide = useCallback(() => {
    goToSlide(safeCurrentIndex + 1);
  }, [goToSlide, safeCurrentIndex]);

  const previousSlide = useCallback(() => {
    goToSlide(safeCurrentIndex - 1);
  }, [goToSlide, safeCurrentIndex]);

  const requestManualNavigation = useCallback(
    (direction: 1 | -1, source: "pointer" | "wheel" = "pointer") => {
      if (totalSlides <= 1) return;

      const now = Date.now();
      if (source === "wheel") {
        if (now - lastWheelNavRef.current < WHEEL_NAV_COOLDOWN_MS) return;
        lastWheelNavRef.current = now;
      } else {
        if (now - lastPointerNavRef.current < POINTER_NAV_COOLDOWN_MS) return;
        lastPointerNavRef.current = now;
      }

      if (direction === 1) {
        nextSlide();
      } else {
        previousSlide();
      }
    },
    [nextSlide, previousSlide, totalSlides],
  );

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    swipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
  }, []);

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const start = swipeStartRef.current;
      if (!start || start.pointerId !== event.pointerId) return;
      swipeStartRef.current = null;

      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;
      if (
        Math.abs(deltaX) < SWIPE_THRESHOLD_PX ||
        Math.abs(deltaX) <= Math.abs(deltaY) * 1.2
      ) {
        return;
      }

      requestManualNavigation(deltaX < 0 ? 1 : -1);
    },
    [requestManualNavigation],
  );

  const handlePointerCancel = useCallback(() => {
    swipeStartRef.current = null;
  }, []);

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLElement>) => {
      if (event.ctrlKey) return;

      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerWidth : 1;
      const deltaX = event.deltaX * unit;
      const deltaY = event.deltaY * unit;

      if (Math.abs(deltaX) < 2 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.25) {
        wheelDeltaRef.current = 0;
        return;
      }

      wheelDeltaRef.current += deltaX;
      if (wheelResetTimerRef.current) clearTimeout(wheelResetTimerRef.current);
      wheelResetTimerRef.current = setTimeout(() => {
        wheelDeltaRef.current = 0;
      }, WHEEL_GESTURE_RESET_MS);

      if (Math.abs(wheelDeltaRef.current) < WHEEL_THRESHOLD_PX) return;

      const direction = wheelDeltaRef.current > 0 ? 1 : -1;
      wheelDeltaRef.current = 0;
      requestManualNavigation(direction, "wheel");
    },
    [requestManualNavigation],
  );

  // 5. Automatic advancement timer
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Do not auto-advance if reduced motion, out of view, tab hidden, or only 1 slide
    if (
      reducedMotion ||
      !inView ||
      !isTabVisible ||
      totalSlides <= 1
    ) {
      return;
    }

    // Advance automatically when display window expires, regardless of source video length
    timerRef.current = setTimeout(() => {
      nextSlide();
    }, displayDurationMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    displayDurationMs,
    nextSlide,
    reducedMotion,
    inView,
    isTabVisible,
    totalSlides,
    safeCurrentIndex,
  ]);

  // 6. Viewport observation (IntersectionObserver)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            const currentVideo = videoRefs.current.get(safeCurrentIndex);
            if (currentVideo && currentVideo.paused) {
              playVideoSafe(currentVideo);
            }
          } else {
            setInView(false);
            const currentVideo = videoRefs.current.get(safeCurrentIndex);
            if (currentVideo && !currentVideo.paused) {
              currentVideo.pause();
            }
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [safeCurrentIndex, playVideoSafe]);

  // 7. Tab visibility change (pause timer and video when tab is hidden, resume when tab is active)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      setIsTabVisible(isVisible);
      const currentVideo = videoRefs.current.get(safeCurrentIndex);

      if (isVisible) {
        if (inView && currentVideo && currentVideo.paused) {
          playVideoSafe(currentVideo);
        }
      } else {
        if (currentVideo && !currentVideo.paused) {
          currentVideo.pause();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [safeCurrentIndex, inView, playVideoSafe]);

  // Cleanup on unmount
  useEffect(() => {
    const currentVideos = videoRefs.current;
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (wheelResetTimerRef.current) clearTimeout(wheelResetTimerRef.current);
      currentVideos.forEach((v) => {
        if (v && !v.paused) v.pause();
      });
      currentVideos.clear();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={`hop-threshold ${className}`}
      aria-roledescription="carousel"
      aria-label="Cinematic Hero Video Slider"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onWheel={handleWheel}
    >
      {/* Multi-Video Slider Media Layer — purely visual, zero text, zero controls */}
      <div className="hop-threshold__slider" aria-live="off">
        {activeSlides.map((slide, index) => {
          const isActive = index === safeCurrentIndex;
          const isTransitioningOut = index === transitioningFromIndex;
          const isVisible = isActive || isTransitioningOut;

          // Resolve multi-resolution video variants
          const resolved = resolveOptimizedVideo(slide.video_url);
          const rawPoster = slide.poster_url || resolved.poster || heroStill;
          const isSupabasePoster = isSupabaseStorageUrl(rawPoster);
          const posterUrl = isSupabasePoster
            ? getSupabaseOptimizedUrl(rawPoster, { width: 1600 })
            : rawPoster;
          const posterSrcSet = isSupabasePoster
            ? getSupabaseSrcSet(rawPoster, [640, 1024, 1600, 2560]) || undefined
            : undefined;

          const videoSrc = slide.video_url || resolved.src;
          const mobileVideoSrc = slide.mobile_video_url || resolved.mobileSrc;
          const altText =
            slide.alt_text?.trim() ||
            section?.alt_text?.trim() ||
            "House of Padmavati collection film";

          // Video mounting strategy:
          // Only the active slide (and outgoing slide during transition) mounts a <video> element.
          // Other slides render their high-res poster and do not eagerly download video streams.
          const shouldMountVideo = isActive || isTransitioningOut;
          const preloadStrategy = isActive ? "auto" : "none";

          return (
            <div
              key={slide.id || `slide-${index}`}
              className={`hop-threshold__slide ${
                isActive ? "hop-threshold__slide--active" : "hop-threshold__slide--inactive"
              } ${isTransitioningOut ? "hop-threshold__slide--transitioning-out" : ""}`}
              style={{
                opacity: isVisible ? 1 : 0,
                zIndex: isActive ? 2 : (isTransitioningOut ? 1 : 0),
                pointerEvents: isActive ? "auto" : "none",
              }}
              aria-hidden={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${totalSlides}`}
            >
              {/* Poster frame: ALWAYS rendered underneath video layer for instant visual stability and zero black frames */}
              <div className="hop-threshold__slide-poster-layer">
                <img
                  src={posterUrl}
                  srcSet={posterSrcSet}
                  sizes="100vw"
                  alt={altText}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  {...(index === 0 ? { fetchpriority: "high" } : {})}
                  className="hop-threshold__slide-poster"
                />
              </div>

              {/* Native <video> layer: rendered on-demand, plays only when active */}
              {shouldMountVideo && videoSrc && (
                <div
                  className="hop-threshold__slide-video-layer"
                  style={{ opacity: videoReadyStates[index] ? 1 : (isActive ? 1 : 0) }}
                >
                  <video
                    ref={(el) => {
                      if (el) {
                        videoRefs.current.set(index, el);
                        if (isActive && inView && isTabVisible) {
                          playVideoSafe(el);
                        }
                      } else {
                        videoRefs.current.delete(index);
                      }
                    }}
                    className="hop-threshold__slide-video"
                    poster={posterUrl}
                    autoPlay={!reducedMotion && isActive}
                    muted
                    loop
                    playsInline
                    preload={preloadStrategy}
                    aria-label={altText}
                    onLoadedData={() => {
                      setVideoReadyStates((prev) => ({ ...prev, [index]: true }));
                      if (isActive && inView && isTabVisible) {
                        const v = videoRefs.current.get(index);
                        if (v) playVideoSafe(v);
                      }
                    }}
                    onError={() => {
                      // Graceful handling of unavailable sources / network errors
                      // Slider will still automatically advance when the timer expires
                      setVideoReadyStates((prev) => ({ ...prev, [index]: false }));
                    }}
                  >
                    {mobileVideoSrc && (
                      <source media="(max-width: 767px)" src={mobileVideoSrc} type="video/mp4" />
                    )}
                    <source src={videoSrc} type="video/mp4" />
                  </video>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Discreet edge arrows — the only interactive controls */}
      {totalSlides > 1 && (
        <>
          <button
            type="button"
            className="hop-threshold__arrow hop-threshold__arrow--prev"
            aria-label="Previous slide"
            onClick={(event) => {
              event.stopPropagation();
              requestManualNavigation(-1);
            }}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
            onPointerCancel={(event) => event.stopPropagation()}
          >
            <ChevronLeft aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="hop-threshold__arrow hop-threshold__arrow--next"
            aria-label="Next slide"
            onClick={(event) => {
              event.stopPropagation();
              requestManualNavigation(1);
            }}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
            onPointerCancel={(event) => event.stopPropagation()}
          >
            <ChevronRight aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Subtle, minimal slide indicators (visual-only, bottom-center) */}
      {totalSlides > 1 && (
        <div
          className="hop-threshold__indicators"
          aria-hidden="true"
        >
          {activeSlides.map((slide, index) => {
            const isActive = index === safeCurrentIndex;
            return (
              <span
                key={slide.id || `indicator-${index}`}
                className={`hop-threshold__indicator-dot ${
                  isActive ? "hop-threshold__indicator-dot--active" : ""
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CinematicHeroSlider;
