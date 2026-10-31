import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

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

/**
 * Standardized Photo/Image Placeholder Section
 * Replaces obsolete video placeholder implementation across the website.
 * Follows the HOP Site-Wide Placeholder Policy:
 * - 16:9 landscape ratio
 * - Full-image preservation using object-fit: contain
 * - Zero fake video frames, zero play buttons
 * - Returns null when disabled to prevent empty/blank gaps
 */
export const LivingSareeSection = ({
  src,
  mobileSrc,
  poster,
  alt = "Living Saree visual study photograph",
  className = "",
  isEnabled = true,
}: LivingSareeSectionProps) => {
  if (isEnabled === false) {
    return null;
  }

  const imageSrc = poster?.trim() || src?.trim() || null;

  return (
    <section
      className={`hop-living-saree ${className}`}
      aria-label={alt}
    >
      <div className="hop-living-saree__frame">
        <PhotoPlaceholder
          src={imageSrc}
          mobileSrc={mobileSrc}
          alt={alt}
          ratio="16:9"
          className="w-full h-full bg-transparent"
        />
      </div>
    </section>
  );
};

export default LivingSareeSection;
