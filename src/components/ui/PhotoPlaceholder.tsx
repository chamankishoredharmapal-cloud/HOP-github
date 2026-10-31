import { useState, type ReactNode } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useMediaDisplayMode } from "@/contexts/MediaDisplayContext";
import { cn } from "@/lib/utils";

export interface PhotoPlaceholderProps {
  /** Source image URL or local asset import. If null or empty, renders intentional missing-image state. */
  src?: string | null;
  /** Mobile image URL if distinct from desktop */
  mobileSrc?: string | null;
  /** Accessible alt text */
  alt?: string;
  /**
   * Aspect ratio preset:
   * - "16:9" (default): Standard default landscape ratio with complete image preservation via object-fit: contain
   * - "2:3": Permitted strictly for dedicated mobile feed-style thumbnails
   */
  ratio?: "16:9" | "2:3";
  /** Additional container classes */
  className?: string;
  /** Additional <img> classes */
  imgClassName?: string;
  /** Eager loading with high fetchpriority */
  priority?: boolean;
  /** Responsive sizes attribute */
  sizes?: string;
  /** Optional custom text displayed on missing-image state */
  fallbackText?: string;
  /** Optional custom content rendered for missing-image state */
  fallbackContent?: ReactNode;
  /** Callback triggered if image fails to load */
  onError?: () => void;
}

/**
 * HOP Standardized Photo/Image Placeholder Component
 * Enforces the HOP Site-Wide Placeholder Policy:
 * 1. Default 16:9 landscape aspect ratio frame reserved upfront to prevent layout shift (CLS).
 * 2. Complete image rendered within the 16:9 frame using object-fit: contain.
 * 3. Mobile: scales 16:9 image to available width without cropping or losing content.
 * 4. Does not upscale source images unnecessarily (max-w-full max-h-full).
 * 5. Permitted 2:3 crop only for specifically designed mobile feed-style thumbnails.
 * 6. Intentional, accessible missing-image state without fake video thumbnails or blank frames.
 */
export function PhotoPlaceholder({
  src,
  mobileSrc,
  alt = "House of Padmavati photograph",
  ratio = "16:9",
  className,
  imgClassName,
  priority = false,
  sizes = "100vw",
  fallbackText,
  fallbackContent,
  onError,
}: PhotoPlaceholderProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const isFeedCrop = ratio === "2:3";
  const ratioClass = isFeedCrop ? "aspect-[2/3]" : "aspect-[16/9]";
  const showImage = Boolean(src && !hasError);

  const { isStructureOnly } = useMediaDisplayMode();

  // In structure-only mode: render plain neutral structural frame; zero media requests
  if (isStructureOnly) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden bg-jasmine-deep/35 select-none transition-colors",
          ratioClass,
          className
        )}
        style={{
          aspectRatio: isFeedCrop ? "2 / 3" : "16 / 9",
        }}
        aria-hidden="true"
        role="presentation"
      />
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden flex items-center justify-center bg-jasmine-deep/60 text-ink select-none",
        ratioClass,
        className
      )}
      style={{
        aspectRatio: isFeedCrop ? "2 / 3" : "16 / 9",
      }}
    >
      {showImage ? (
        <picture className="w-full h-full flex items-center justify-center">
          {mobileSrc && (
            <source media="(max-width: 767px)" srcSet={mobileSrc} />
          )}
          <img
            src={src!}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            {...(priority ? { fetchpriority: "high" } : {})}
            onError={handleError}
            sizes={sizes}
            className={cn(
              isFeedCrop
                ? "w-full h-full object-cover"
                : "max-w-full max-h-full w-auto h-auto object-contain",
              "transition-opacity duration-300",
              imgClassName
            )}
          />
        </picture>
      ) : (
        <div
          role="img"
          aria-label={alt || "House of Padmavati — image placeholder"}
          className="flex flex-col items-center justify-center text-center p-6 gap-2 text-ink-soft/70 w-full h-full"
        >
          {fallbackContent ? (
            fallbackContent
          ) : (
            <>
              <ImageIcon className="h-6 w-6 stroke-[1.25] opacity-50" aria-hidden="true" />
              <span className="text-[0.65rem] tracking-[0.28em] uppercase font-light opacity-80">
                House of Padmavati
              </span>
              {fallbackText && (
                <span className="text-xs font-light opacity-60 max-w-xs">{fallbackText}</span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PhotoPlaceholder;
