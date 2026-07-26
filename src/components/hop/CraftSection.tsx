import { Film } from "@/components/hop/Film";
import { COLLECTION_VIDEOS } from "@/data/collectionVideos";
import heroImg from "@/assets/hop-hero.jpg";

export const CraftSection = () => (
  <section className="bg-sand/30">
    <div className="container py-20 sm:py-28 lg:py-32">
      <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
        <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-teal mb-4">The House</p>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight text-balance">
          How tradition is worn.
        </h2>
        <p className="mt-6 text-sm sm:text-base text-ink-soft font-light leading-relaxed">
          The saree is an expression of identity, not a museum piece. House of Padmavati curates five distinct ways of wearing tradition, designed with quiet confidence for the modern wardrobe.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <Film
          src={COLLECTION_VIDEOS.hero}
          poster={heroImg}
          alt="House of Padmavati — Atmosphere"
          className="aspect-[16/9]"
          preload="metadata"
        />
      </div>
    </div>
  </section>
);
