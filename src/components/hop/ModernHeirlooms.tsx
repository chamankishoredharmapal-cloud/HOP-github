import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Film } from "@/components/hop/Film";
import giftImg from "@/assets/hop-gift.jpg";

export const ModernHeirlooms = () => (
  <section className="container py-20 sm:py-28 lg:py-32">
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className="order-2 lg:order-1 space-y-6 max-w-md">
        <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-teal">Modern Heirlooms</p>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight text-balance">
          A keepsake note, printed on jasmine cardstock.
        </h2>
        <p className="text-sm sm:text-base text-ink-soft font-light leading-relaxed">
          When you gift a Padmavati, your message is printed in Ink Charcoal on Jasmine Mist paper —
          tucked inside a hand-wrapped box. No marketing, no clutter. Only your words and the cloth.
        </p>
        <Link
          to="/gift"
          className="group inline-flex items-center gap-3 bg-ink text-jasmine px-7 py-3.5 rounded-full text-[0.7rem] tracking-[0.32em] uppercase hover:bg-teal-deep transition-colors"
        >
          Begin a gift
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="order-1 lg:order-2">
        <Film poster={giftImg} alt="Hand-wrapped gift presentation" className="aspect-[4/5] rounded-md gallery-shadow" />
      </div>
    </div>
  </section>
);