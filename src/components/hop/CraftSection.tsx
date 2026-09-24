import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hop-hero.jpg";

export const CraftSection = () => (
  <section className="border-t border-ink/10">
    <div className="container py-section">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-5 max-w-md">
          <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-ink-soft mb-4">The House</p>
          <h2 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl leading-tight text-balance text-ink">
            How tradition is worn.
          </h2>
          <p className="mt-6 text-sm sm:text-base text-ink-soft font-light leading-relaxed">
            The saree is an expression of identity, not a museum piece. Five distinct ways of wearing
            tradition — chosen with quiet confidence for the modern wardrobe.
          </p>
          <Link
            to="/about"
            className="group mt-8 inline-flex items-center gap-3 text-[0.7rem] sm:text-xs tracking-[0.32em] uppercase text-ink border-b border-ink/30 pb-1.5 hover:border-ink transition-colors"
          >
            Our story
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-sm bg-jasmine-deep">
            <img
              src={heroImg}
              alt="House of Padmavati — woven drape in natural light"
              loading="lazy"
              className="w-full aspect-[16/10] object-cover"
            />
          </div>
          <p className="mt-4 text-[0.6rem] tracking-[0.32em] uppercase text-ink-soft">
            Natural light · Worn, not staged
          </p>
        </div>
      </div>
    </div>
  </section>
);
