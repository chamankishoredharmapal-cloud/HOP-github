import React, { forwardRef, type ImgHTMLAttributes, type ReactNode } from "react";
import { useMediaDisplayMode } from "@/contexts/MediaDisplayContext";
import { cn } from "@/lib/utils";

export interface MediaSurfaceProps {
  className?: string;
  aspectRatio?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

/**
 * Universal container that renders a neutral structural surface in structure-only mode,
 * or passes through children when show-media is active.
 */
export function MediaSurface({
  className,
  aspectRatio,
  style,
  children,
}: MediaSurfaceProps) {
  const { isStructureOnly } = useMediaDisplayMode();

  if (isStructureOnly) {
    return (
      <div
        className={cn(
          "w-full h-full min-w-0 overflow-hidden bg-jasmine-deep/35 select-none transition-colors",
          className
        )}
        style={{
          ...(aspectRatio ? { aspectRatio } : {}),
          ...style,
        }}
        aria-hidden="true"
        role="presentation"
      />
    );
  }

  return <>{children}</>;
}

export interface MediaImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
  aspectRatio?: string;
}

/**
 * Drop-in image replacement that respects the authoritative site-wide media display mode.
 * In structure-only mode: renders a plain neutral structural surface with identical dimensions
 * without requesting or rendering the source image.
 * In show-media mode: renders the normal semantic <img> element.
 */
export const MediaImage = forwardRef<HTMLImageElement, MediaImageProps>(
  ({ src, alt, className, fallbackClassName, aspectRatio, style, ...props }, ref) => {
    const { isStructureOnly } = useMediaDisplayMode();

    if (isStructureOnly) {
      return (
        <div
          className={cn(
            "bg-jasmine-deep/35 select-none transition-colors",
            fallbackClassName || className
          )}
          style={{
            ...(aspectRatio ? { aspectRatio } : {}),
            ...style,
          }}
          aria-hidden="true"
          role="presentation"
        />
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        style={{
          ...(aspectRatio ? { aspectRatio } : {}),
          ...style,
        }}
        {...props}
      />
    );
  }
);

MediaImage.displayName = "MediaImage";

export default MediaSurface;
