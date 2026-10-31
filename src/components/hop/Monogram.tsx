import { cn } from "@/lib/utils";
import { useMediaDisplayMode } from "@/contexts/MediaDisplayContext";
import signatureLogo from "@/assets/hop-logo-signature.png";
import primaryLogo from "@/assets/hop-logo-primary.png";
import sealLogo from "@/assets/hop-logo-seal.png";

interface MonogramProps {
  className?: string;
  withWordmark?: boolean;
  variant?: "signature" | "primary" | "seal";
  style?: React.CSSProperties;
}

/**
 * House of Padmavati brand mark.
 * - signature: brush "O" only (default, compact)
 * - primary: brush "O" + "HOUSE OF PADMAVATI" wordmark stacked
 * - seal: circular seal with full lockup
 */
export const Monogram = ({ className, withWordmark = false, variant, style }: MonogramProps) => {
  const { isStructureOnly } = useMediaDisplayMode();

  if (isStructureOnly) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center font-serif text-ink tracking-[0.2em] uppercase font-light text-[0.65rem] select-none",
          className
        )}
        style={style}
        role="presentation"
      >
        HOP
      </span>
    );
  }

  const resolved = variant ?? (withWordmark ? "primary" : "signature");
  const src =
    resolved === "seal" ? sealLogo : resolved === "primary" ? primaryLogo : signatureLogo;

  return (
    <img
      src={src}
      alt=""
      className={cn("h-full w-auto object-contain select-none", className)}
      style={style}
      draggable={false}
    />
  );
};

export default Monogram;
