import { useQuery } from "@tanstack/react-query";
import { Film } from "@/components/hop/Film";
import { fetchFeaturedCollection } from "@/services/collectionService";
import { COLLECTION_VIDEOS } from "@/data/collectionVideos";

export const HeroSection = () => {
  const { data: featured } = useQuery({
    queryKey: ["storefront", "featuredCollection"],
    queryFn: fetchFeaturedCollection,
  });

  return (
    <section className="relative pb-12 sm:pb-16 lg:pb-20">
      <div className="container">
        <div className="text-center mb-6 sm:mb-8 animate-fade-in" style={{ animationDuration: "1.4s" }}>
          <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-teal mb-3">
            {featured?.tagline ?? "Coastal Blossom · Spring Atelier"}
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance">
            Sarees · <em className="text-teal">Stories</em> · You
          </h1>
        </div>

        <div
          className="relative mx-auto rounded-xl overflow-hidden gallery-shadow animate-fade-in"
          style={{ width: "min(92vw, 1680px)", animationDuration: "1.6s", animationDelay: "0.3s", animationFillMode: "both" }}
        >
          <Film
            src={COLLECTION_VIDEOS.hero}
            poster={featured?.hero_image_url ?? ""}
            alt={featured ? `${featured.name} — collection film` : "House of Padmavati"}
            className="aspect-[16/9]"
            preload="metadata"
          />
          <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 bg-jasmine/85 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[0.6rem] sm:text-[0.7rem] tracking-[0.32em] uppercase text-ink-soft">
            {featured?.name ?? "Film"}
          </div>
          <div className="absolute top-5 right-5 sm:top-8 sm:right-8 hidden sm:block">
            <span className="text-[0.6rem] tracking-[0.42em] uppercase text-jasmine/90 bg-ink/40 backdrop-blur-sm px-4 py-2 rounded-full">
              {featured?.name ?? "House of Padmavati"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
