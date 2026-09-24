import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Film } from "@/components/hop/Film";
import { fetchFeaturedCollection } from "@/services/collectionService";
import { COLLECTION_VIDEOS } from "@/data/collectionVideos";
import houseStill from "@/assets/hop-hero.jpg";

export const HeroSection = () => {
  const { data: featured } = useQuery({
    queryKey: ["storefront", "featuredCollection"],
    queryFn: fetchFeaturedCollection,
  });

  // The hero must stand alone: when no collection is featured,
  // the house still shows its own still — never an empty frame.
  const collectionName = featured?.name ?? "House of Padmavati";
  const poster = featured?.hero_image_url || houseStill;

  return (
    <section className="relative pb-16 sm:pb-20 lg:pb-24">
      <div className="container">
        <div className="text-center mb-8 sm:mb-10 animate-fade-in" style={{ animationDuration: "1.2s" }}>
          <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-ink-soft mb-4">
            {featured?.tagline ?? "House of Padmavati"}
          </p>
          <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance text-ink">
            Saree. Time. You.
          </h1>
          <p className="mt-5 text-sm sm:text-base text-ink-soft font-light leading-relaxed max-w-xl mx-auto text-pretty">
            Five ways of wearing tradition — woven slowly, chosen quietly.
          </p>
        </div>

        <div
          className="relative mx-auto overflow-hidden animate-fade-in"
          style={{ width: "min(92vw, 1680px)", animationDuration: "1.4s", animationDelay: "0.2s", animationFillMode: "both" }}
        >
          <Film
            src={COLLECTION_VIDEOS.hero}
            poster={poster}
            alt={featured ? `${featured.name} — collection film` : "House of Padmavati — woven drape in natural light"}
            className="aspect-[16/9]"
            preload="auto"
            priority
          />
          <p className="mt-4 flex items-baseline justify-between gap-4">
            <span className="text-[0.6rem] sm:text-[0.65rem] tracking-[0.32em] uppercase text-ink-soft">
              {collectionName}
            </span>
            <Link
              to="/collections"
              className="text-[0.6rem] sm:text-[0.65rem] tracking-[0.32em] uppercase text-ink border-b border-ink/30 pb-1 hover:border-ink hover:text-ink transition-colors"
            >
              Enter the collections
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
