import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Film } from "@/components/hop/Film";
import { fetchCollections } from "@/services/collectionService";
import { COLLECTION_VIDEOS } from "@/data/collectionVideos";
import { getCollectionDescriptor } from "@/data/collectionDescriptors";
import { getWorld } from "@/data/collectionWorlds";
import { Selvedge } from "./Selvedge";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

export const CollectionStage = () => {
  const { data: collections, isLoading } = useQuery({
    queryKey: ["storefront", "collections"],
    queryFn: fetchCollections,
  });

  usePrerenderReady(!isLoading && collections !== undefined);

  if (!isLoading && (!collections || collections.length === 0)) {
    return (
      <section className="relative">
        <div className="container text-center py-16 sm:py-24">
          <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-ink-soft mb-4">The Collections</p>
          <h2 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl leading-tight text-balance max-w-2xl mx-auto text-ink">
            Five ways of wearing tradition.
          </h2>
          <p className="mt-6 text-sm sm:text-base text-ink-soft font-light leading-relaxed max-w-md mx-auto">
            The house is preparing the next drape. Return shortly — or begin with our story.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      <div className="container text-center py-14 sm:py-20">
        <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-ink-soft mb-4">The Collections</p>
        <h2 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl leading-tight text-balance max-w-3xl mx-auto text-ink">
          Five different ways to wear tradition.
        </h2>
        <Selvedge className="max-w-[240px] mx-auto mt-6" />
      </div>

      <div className="space-y-0">
        {collections?.map((c, i) => {
          const align = i % 2 === 0 ? "left" : "right";
          const world = getWorld(c.slug);
          return (
            <article
              key={c.id}
              className="relative"
            >
              <div className="container py-12 sm:py-16 lg:py-20">
                <div
                  className={`grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center ${
                    align === "right" ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className={`lg:col-span-5 space-y-5 ${align === "right" ? "lg:pl-8" : "lg:pr-8"}`}>
                    <div className="flex items-center gap-4">
                      <span className="h-px w-10" style={{ background: world?.accent ?? "hsl(var(--ink) / 0.25)" }} aria-hidden="true" />
                      <p className="text-[0.6rem] sm:text-[0.65rem] tracking-[0.42em] uppercase text-ink-soft">
                        {c.tagline ?? `Chapter ${String(i + 1).padStart(2, "0")}`} {world ? `· ${world.accentName}` : ""}
                      </p>
                    </div>
                    <h3 className="font-editorial font-light leading-[1.02] text-balance text-ink text-4xl sm:text-5xl md:text-6xl">
                      {c.name}
                    </h3>
                    <p className="text-sm sm:text-base text-ink-soft font-light leading-relaxed max-w-md text-pretty">
                      {c.editorial_story ?? c.description ?? ""}
                    </p>
                    {world && (
                      <p className="text-[0.65rem] tracking-wide text-ink-soft font-light max-w-md">
                        {world.emotion} · {world.material}
                      </p>
                    )}
                    <Link
                      to={`/collections/${c.slug}`}
                      className="group inline-flex items-center gap-3 text-[0.7rem] sm:text-xs tracking-[0.32em] uppercase text-ink border-b pb-1.5 hover:border-ink transition-colors"
                      style={{ borderColor: world?.accent ?? "hsl(var(--ink) / 0.3)" }}
                    >
                      Explore {c.name}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </div>

                  <div className="lg:col-span-7">
                    {getCollectionDescriptor(c.name, c.slug) && (
                      <p className="font-serif italic font-light text-xl sm:text-2xl text-ink-soft leading-snug mb-8 max-w-xl">
                        {getCollectionDescriptor(c.name, c.slug)}
                      </p>
                    )}
                    <div className="relative">
                      <Film
                        src={c.hero_video_url ?? COLLECTION_VIDEOS[c.slug] ?? undefined}
                        poster={c.hero_image_url ?? ""}
                        alt={`${c.name} — collection film`}
                        className={
                          world?.slug === "padma"
                            ? "aspect-square lg:aspect-[4/3]"
                            : world?.slug === "viara"
                              ? "aspect-[16/10] lg:aspect-[16/10]"
                              : world?.slug === "spandana"
                                ? "aspect-[3/4] lg:aspect-[4/5]"
                                : "aspect-[4/5] lg:aspect-[5/4]"
                        }
                      />
                      {world && (
                        <div className="absolute inset-x-0 -bottom-px h-px" style={{ background: world.accent }} aria-hidden="true" />
                      )}
                    </div>
                    {world && (
                      <p className="mt-3 text-[0.6rem] tracking-[0.2em] uppercase text-ink-soft">
                        {world.photo}
                      </p>
                    )}
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
