import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Monogram } from "@/components/hop/Monogram";
import { Film } from "@/components/hop/Film";
import { fetchCollections } from "@/services/collectionService";
import { COLLECTION_VIDEOS } from "@/data/collectionVideos";
import { getWorld } from "@/data/collectionWorlds";
import { useMetadata } from "@/hooks/useMetadata";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Collections = () => {
  useMetadata({
    title: "Collections — House of Padmavati",
    description: "Five ways of wearing tradition.",
  });
  const { data: collections, isLoading } = useQuery({
    queryKey: ["storefront", "collections"],
    queryFn: fetchCollections,
  });

  usePrerenderReady(true);

  const getChapterLabel = (index: number) => {
    return `Chapter ${String(index + 1).padStart(2, "0")}`;
  };

  return (
    <PageLayout>
      <main>
        <section className="container pt-12 sm:pt-16 pb-10 sm:pb-14 text-center">
          <Monogram className="h-10 sm:h-12 mx-auto mb-5 sm:mb-6 opacity-70" />
          <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-ink-soft mb-3 sm:mb-4">
            The Collections
          </p>
          <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl text-balance leading-[1.05] text-ink">
            Five ways of wearing tradition.
          </h1>
          <p className="mt-5 text-sm sm:text-base text-ink-soft font-light leading-relaxed max-w-xl mx-auto">
            Chapters, not categories. Enter slowly.
          </p>
        </section>

        <section className="container pb-20 sm:pb-28">
          {isLoading ? (
            <div className="space-y-16 sm:space-y-20 lg:space-y-24">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center animate-pulse">
                  <div className={`aspect-[16/10] rounded-sm bg-jasmine-deep ${i % 2 === 1 ? "lg:order-2" : ""}`} />
                  <div className="space-y-4">
                    <div className="h-4 w-32 rounded-sm bg-jasmine-deep" />
                    <div className="h-10 w-48 rounded-sm bg-jasmine-deep" />
                    <div className="h-16 w-full rounded-sm bg-jasmine-deep" />
                  </div>
                </div>
              ))}
            </div>
          ) : !collections || collections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-ink-soft text-sm font-light">No collections yet.</p>
            </div>
          ) : (
            <div className="space-y-12 sm:space-y-16 lg:space-y-20">
              {collections.map((c, i) => {
                const world = getWorld(c.slug);
                return (
                <Link
                  key={c.id}
                  to={`/collections/${c.slug}`}
                  className={`group grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center ${
                    i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                  aria-label={`Enter the ${c.name} collection`}
                >
                  <div className={`lg:col-span-7 overflow-hidden rounded-sm bg-jasmine-deep ${world?.slug === "padma" ? "aspect-square lg:aspect-[4/3]" : world?.slug === "viara" ? "aspect-[16/10]" : world?.slug === "spandana" ? "aspect-[3/4] lg:aspect-[4/5]" : "aspect-[16/10]"}`}>
                    <Film
                      src={c.hero_video_url ?? COLLECTION_VIDEOS[c.slug] ?? undefined}
                      poster={c.hero_image_url ?? ""}
                      alt={c.name}
                      className="w-full h-full [&>div>img]:transition-transform [&>div>img]:duration-1000 [&>div>img]:ease-out group-hover:[&>div>img]:scale-[1.02]"
                    />
                  </div>
                  <div className="lg:col-span-5 space-y-3 sm:space-y-4">
                    <p className="text-[0.6rem] tracking-[0.42em] uppercase text-ink-soft">
                      {getChapterLabel(i)}
                      {c.tagline ? ` · ${c.tagline}` : world ? ` · ${world.accentName}` : ""}
                    </p>
                    <h2 className="font-editorial text-3xl sm:text-4xl leading-[1.08] text-balance text-ink">
                      {c.name}
                    </h2>
                    {(c.editorial_story ?? c.description) && (
                      <p className="text-sm text-ink-soft font-light leading-relaxed max-w-md text-pretty line-clamp-3">
                        {c.editorial_story ?? c.description}
                      </p>
                    )}
                    {world && <p className="text-[0.65rem] text-ink-soft font-light">{world.emotion}</p>}
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.32em] uppercase text-ink border-b pb-1" style={{ borderColor: world?.accent ?? "hsl(var(--ink) / 0.3)" }}>
                        Enter
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="border-t border-ink/10">
          <div className="container py-14 sm:py-16 text-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[0.7rem] sm:text-xs tracking-[0.32em] uppercase text-ink-soft hover:text-ink transition-colors"
            >
              The House <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </PageLayout>
  );
};

export default Collections;
