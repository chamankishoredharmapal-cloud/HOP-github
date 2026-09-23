import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import giftImg from "@/assets/hop-gift.jpg";

export const ModernHeirlooms = () => (
  <section className="container py-16 sm:py-24">
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className="order-2 lg:order-1 space-y-6 max-w-md">
        <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-ink-soft">Modern Heirlooms</p>
        <h2 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl leading-tight text-balance text-ink">
          Woven for tomorrow.
        </h2>
        <p className="text-sm sm:text-base text-ink-soft font-light leading-relaxed">
          Real zari softens with age. The silk relaxes, the metal deepens rather than fades.
          We do not design for a season — we design for the women who will inherit these
          drapes two decades from now.
        </p>
        <Link
          to="/collections"
          className="group inline-flex items-center gap-3 text-[0.7rem] tracking-[0.32em] uppercase text-ink border-b border-ink/30 pb-1.5 hover:border-ink transition-colors"
        >
          View the heirlooms
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
      <div className="order-1 lg:order-2">
        <div className="overflow-hidden rounded-sm bg-jasmine-deep">
          <img
            src={giftImg}
            alt="Hand-wrapped heirloom, kept in jasmine"
            loading="lazy"
            className="w-full aspect-[4/5] object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);