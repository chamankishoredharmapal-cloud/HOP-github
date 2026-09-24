import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getSupabaseOptimizedUrl,
  getSupabaseSrcSet,
} from "@/lib/supabaseImage";

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;

type ProductGalleryImage = {
  url: string;
  altText?: string | null;
};

type ProductGalleryProps = {
  images: ProductGalleryImage[];
  aspectRatio?: "4/5" | "16/9" | "1/1";
  enableZoom?: boolean;
};

export const ProductGallery = React.memo(function ProductGallery({
  images,
  aspectRatio = "4/5",
  enableZoom = true,
}: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "x",
    dragFree: true,
    containScroll: "trimSnaps",
    loop: false,
  });

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [isZoomed, setIsZoomed] = React.useState(false);

  const aspectRatioClass = {
    "4/5": "aspect-[4/5]",
    "16/9": "aspect-[16/9]",
    "1/1": "aspect-square",
  }[aspectRatio];

  const syncState = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("init", syncState);
    emblaApi.on("reInit", syncState);
    emblaApi.on("select", syncState);
    emblaApi.on("settle", syncState);
    emblaApi.on("resize", syncState);
    syncState();
    return () => {
      emblaApi.off("init", syncState);
      emblaApi.off("reInit", syncState);
      emblaApi.off("select", syncState);
      emblaApi.off("settle", syncState);
      emblaApi.off("resize", syncState);
    };
  }, [emblaApi, syncState]);

  React.useEffect(() => {
    if (!emblaApi) return;
    let rafId = 0;
    const reInit = () => {
      rafId = 0;
      emblaApi.reInit();
    };
    rafId = window.requestAnimationFrame(() => {
      rafId = window.requestAnimationFrame(reInit);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [emblaApi]);

  const scrollPrev = React.useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleZoomIn = () => {
    setZoomLevel(2);
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setZoomLevel(1);
    setIsZoomed(false);
  };

  const galleryRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = galleryRef.current;
    if (!node) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      } else if (event.key === "Escape" && isZoomed) {
        event.preventDefault();
        handleZoomOut();
      }
    };

    node.addEventListener("keydown", handleKeyDown);
    return () => node.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext, isZoomed]);

  const getImageAlt = (image: ProductGalleryImage, index: number) =>
    image.altText?.trim() || `Product view ${index + 1}`;

  const handleZoomToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!enableZoom) return;
    if (isZoomed) handleZoomOut();
    else handleZoomIn();
  };

  return (
    <div ref={galleryRef} className="relative w-full" tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Product images">
      <div className="relative overflow-hidden rounded-sm bg-jasmine-deep" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => {
            const optimizedSrc = getSupabaseOptimizedUrl(image.url, { width: 800 });
            const srcSet = getSupabaseSrcSet(image.url, [480, 800, 1200]);
            return (
              <div key={index} className="min-w-0 shrink-0 grow-0 basis-full">
                <div className={`relative ${aspectRatioClass} w-full`} style={{ transform: isZoomed ? `scale(${zoomLevel})` : "scale(1)", transformOrigin: "center" }}>
                  <img
                    src={optimizedSrc}
                    srcSet={srcSet || undefined}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
                    alt={getImageAlt(image, index)}
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out ${enableZoom ? (isZoomed ? "cursor-zoom-out" : "cursor-zoom-in") : ""}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding={index === 0 ? "sync" : "async"}
                    // lowercase fetchpriority: React 18 warns on camelCase and drops it (see OptimizedImage).
                    {...(index === 0 ? { fetchpriority: "high" } : {})}
                    // Pointer shortcut: the overlay zoom button remains the keyboard-operable control.
                    onClick={enableZoom ? handleZoomToggle : undefined}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = "true";
                        target.srcset = "";
                        target.src = image.url;
                      }
                    }}
                    style={{ transitionProperty: "transform" }}
                  />
                  {/* Zoom toggle. Shown only when not zoomed: once zoomed, the
                      top-right dismiss control is the single Zoom-out affordance,
                      so a scaled duplicate can never cover pointer events. */}
                  {enableZoom && !isZoomed && (
                    <button
                      onClick={handleZoomToggle}
                      className="absolute bottom-4 right-4 rounded-full bg-ink/60 p-2.5 text-jasmine transition-colors hover:bg-ink/80 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isZoomed && enableZoom && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className="absolute top-4 right-4 z-10 rounded-full bg-ink/60 p-2.5 text-jasmine transition-colors hover:bg-ink/80 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Zoom out"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      <div className="mt-4 grid grid-cols-4 gap-3">
        {images.map((image, index) => {
          const thumbSrc = getSupabaseOptimizedUrl(image.url, { width: 160, height: 160, resize: "cover" });
          return (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`relative aspect-square overflow-hidden rounded-sm bg-jasmine-deep border transition-all duration-300 min-h-[44px] ${
                index === selectedIndex
                  ? "border-ink shadow-sm"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Show product image ${index + 1}`}
              aria-pressed={index === selectedIndex}
            >
              <img
                src={thumbSrc}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = "true";
                    target.src = image.url;
                  }
                }}
              />
            </button>
          );
        })}
      </div>

      <button
        onClick={scrollPrev}
        className="hidden lg:block absolute -left-12 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background p-2 transition-colors hover:bg-accent"
        disabled={!canScrollPrev}
        aria-label="Previous image"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <button
        onClick={scrollNext}
        className="hidden lg:block absolute -right-12 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background p-2 transition-colors hover:bg-accent"
        disabled={!canScrollNext}
        aria-label="Next image"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
});
