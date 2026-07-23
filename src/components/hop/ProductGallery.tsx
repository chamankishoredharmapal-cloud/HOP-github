import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;

type ProductGalleryProps = {
  images: string[];
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
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [isZoomed, setIsZoomed] = React.useState(false);

  const aspectRatioClass = {
    "4/5": "aspect-[4/5]",
    "16/9": "aspect-[16/9]",
    "1/1": "aspect-square",
  }[aspectRatio];

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

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

  const handleImageClick = () => {
    if (enableZoom) {
      if (isZoomed) {
        handleZoomOut();
      } else {
        handleZoomIn();
      }
    }
  };

  React.useEffect(() => {
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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext, isZoomed]);

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-md bg-jasmine-deep" ref={emblaRef} onClick={handleImageClick}>
        <div className="flex">
          {images.map((image, index) => (
            <div key={index} className="min-w-0 shrink-0 grow-0 basis-full">
              <div className={`relative ${aspectRatioClass} w-full`} style={{ transform: isZoomed ? `scale(${zoomLevel})` : "scale(1)", transformOrigin: "center" }}>
                <img
                  src={image}
                  alt={`Product view ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out"
                  loading="lazy"
                  style={{ transitionProperty: "transform" }}
                />
                {enableZoom && (
                  <div className="absolute bottom-4 right-4 rounded-full bg-black/50 p-2 backdrop-blur-sm transition-opacity duration-300">
                    <ZoomIn className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isZoomed && enableZoom && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 backdrop-blur-sm text-white transition-colors hover:bg-white/20"
          aria-label="Zoom out"
        >
          <span className="text-xs font-medium">✕</span>
        </button>
      )}

      <div className="mt-4 grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`relative aspect-square overflow-hidden rounded bg-jasmine-deep border transition-all duration-300 ${
              index === selectedIndex
                ? "border-teal-deep shadow-sm"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <img src={image} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <button
        onClick={scrollPrev}
        className="hidden lg:block absolute -left-12 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background p-2 transition-colors hover:bg-accent"
        disabled={!emblaApi?.canScrollPrev()}
        aria-label="Previous image"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <button
        onClick={scrollNext}
        className="hidden lg:block absolute -right-12 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background p-2 transition-colors hover:bg-accent"
        disabled={!emblaApi?.canScrollNext()}
        aria-label="Next image"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
});
