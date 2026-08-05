import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Film } from "@/components/hop/Film";
import { fetchCollections } from "@/services/collectionService";
import { COLLECTION_VIDEOS } from "@/data/collectionVideos";
import { getCollectionDescriptor } from "@/data/collectionDescriptors";

const COLLECTION_SYMBOLS: Record<string, string> = {
  kalyani: "❈",
  viara: "⟡",
  arya: "⁂",
  padma: "◈",
  spandana: "⸙",
};

const renderDescriptor = (text: string) => {
  const words = text.split(" ");
  return words.map((word, idx) => (
    <span key={idx} className={idx === 1 ? "text-teal" : undefined}>
      {idx > 0 ? " " : ""}{word}
    </span>
  ));
};

export const CollectionStage = () => {
  const { data: collections } = useQuery({
    queryKey: ["storefront", "collections"],
    queryFn: fetchCollections,
  });

  return (
    <section className="relative">
      <div className="container text-center py-14 sm:py-20 lg:py-24">
        <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-teal mb-4">The Collections</p>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-balance max-w-5xl mx-auto">
          Five Different Ways to Wear Tradition
        </h2>
      </div>

      <div className="space-y-0">
        {collections?.map((c, i) => {
          const align = i % 2 === 0 ? "left" : "right";
          const flagship = i === 1;
          return (
            <article
              key={c.id}
              className="relative"
            >
              <div className={`container py-14 sm:py-20 lg:py-28 ${flagship ? "lg:py-36" : ""}`}>
                <div
                  className={`grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-start ${
                    align === "right" ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className={`lg:col-span-5 space-y-5 sm:space-y-6 lg:pt-20 xl:pt-24 ${align === "right" ? "lg:pl-8" : "lg:pr-8"}`}>
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-teal-deep text-lg">
                        {COLLECTION_SYMBOLS[c.slug] ?? String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px w-12 bg-teal-deep" />
                      <p className="text-[0.6rem] sm:text-[0.65rem] tracking-[0.42em] uppercase text-teal">
                        {c.tagline ?? ""}
                      </p>
                    </div>
                    <h3 className={`font-serif leading-[0.95] text-balance text-teal ${
                      flagship
                        ? "text-5xl sm:text-7xl md:text-8xl lg:text-[9rem]"
                        : "text-4xl sm:text-6xl md:text-7xl"
                    }`}>
                      {c.name}
                    </h3>
                    <p className="text-sm sm:text-base text-ink-soft font-light leading-relaxed max-w-md text-pretty">
                      {c.editorial_story ?? c.description ?? ""}
                    </p>
                    <Link
                      to={`/collections/${c.slug}`}
                      className="group inline-flex items-center gap-3 text-[0.7rem] sm:text-xs tracking-[0.42em] uppercase text-teal-deep border-b border-teal-deep pb-1.5 hover:border-teal-deep transition-colors"
                    >
                      Explore {c.name}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>

                  <div className="lg:col-span-7">
                    {getCollectionDescriptor(c.name, c.slug) && (
                      <p className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl text-teal-deep font-normal leading-snug mb-9">
                        {renderDescriptor(getCollectionDescriptor(c.name, c.slug))}
                      </p>
                    )}
                    <Film
                      src={c.hero_video_url ?? COLLECTION_VIDEOS[c.slug] ?? undefined}
                      poster={c.hero_image_url ?? ""}
                      alt={`${c.name} — collection film`}
                      className={`rounded-md gallery-shadow ${
                        flagship ? "aspect-[5/6] sm:aspect-[4/5] lg:aspect-[16/11]" : "aspect-[4/5] lg:aspect-[5/4]"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
