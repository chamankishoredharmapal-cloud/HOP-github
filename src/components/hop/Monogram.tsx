import { cn } from "@/lib/utils";
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
  const resolved = variant ?? (withWordmark ? "primary" : "signature");
  const src =
    resolved === "seal" ? sealLogo : resolved === "primary" ? primaryLogo : signatureLogo;

  return (
    <img
      src={src}
      alt="House of Padmavati"
      className={cn("h-full w-auto object-contain select-none", className)}
      style={style}
      draggable={false}
    />
  );
};

export default Monogram;
