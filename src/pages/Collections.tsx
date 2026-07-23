import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Monogram } from "@/components/hop/Monogram";
import { fetchCollections } from "@/services/collectionService";
import { useMetadata } from "@/hooks/useMetadata";

const Collections = () => {
  useMetadata({
    title: "Collections — House of Padmavati",
    description: "Five collections, one quiet house. Every Padmavati saree belongs to one of five families — each woven with a different rhythm.",
  });
  const { data: collections, isLoading } = useQuery({
    queryKey: ["storefront", "collections"],
    queryFn: fetchCollections,
  });

  return (
    <PageLayout>
      <main>
        <section className="container pt-12 sm:pt-16 pb-10 sm:pb-14 text-center">
          <Monogram className="h-10 sm:h-12 mx-auto mb-5 sm:mb-6 opacity-70" />
          <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-teal mb-3 sm:mb-4">
            The Atelier
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-balance leading-tight">
            Five collections,<br />
            <em className="text-teal">one quiet house.</em>
          </h1>
          <p className="mt-5 sm:mt-7 max-w-xl mx-auto text-sm sm:text-base text-ink-soft font-light leading-relaxed px-4">
            Every Padmavati saree belongs to one of five families — each woven with a different rhythm,
            but the same Coastal Blossom calibration.
          </p>
        </section>

        <section className="container pb-20 sm:pb-28">
          {isLoading ? (
            <div className="space-y-16 sm:space-y-20 lg:space-y-24">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center animate-pulse">
                  <div className={`aspect-[4/5] rounded-md bg-muted ${i % 2 === 1 ? "lg:order-2" : ""}`} />
                  <div className="space-y-4">
                    <div className="h-4 w-32 rounded bg-muted" />
                    <div className="h-10 w-48 rounded bg-muted" />
                    <div className="h-16 w-full rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : !collections || collections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-ink-soft text-sm font-light">No collections yet.</p>
            </div>
          ) : (
            <div className="space-y-16 sm:space-y-20 lg:space-y-24">
              {collections.map((c, i) => (
                <Link
                  key={c.id}
                  to={`/collections/${c.slug}`}
                  className={`group grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center ${
                    i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] overflow-hidden rounded-md bg-jasmine-deep">
                    {c.hero_image_url ? (
                      <img
                        src={c.hero_image_url}
                        alt={c.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-1400 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-ink-soft/30" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-4 sm:space-y-5 lg:px-6">
                    <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-teal">
                      {c.tagline ?? ""}
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-balance group-hover:text-teal transition-colors duration-500">
                      {c.name}
                    </h2>
                    <p className="text-sm sm:text-base text-ink-soft font-light leading-relaxed max-w-md text-pretty">
                      {c.editorial_story ?? c.description ?? ""}
                    </p>
                    <div className="flex items-center gap-5 sm:gap-7 pt-2">
                      <span className="inline-flex items-center gap-2 text-[0.65rem] sm:text-xs tracking-[0.32em] uppercase text-teal-deep border-b border-teal-deep/40 pb-1">
                        Explore Collection
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="bg-sand/40">
          <div className="container py-16 sm:py-20 lg:py-24 text-center">
            <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ink leading-snug max-w-2xl mx-auto text-balance">
              "A saree is never bought. It is chosen, then carried."
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-[0.7rem] sm:text-xs tracking-[0.32em] uppercase text-teal-deep hover:text-teal"
            >
              The Padmavati story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </PageLayout>
  );
};

export default Collections;
