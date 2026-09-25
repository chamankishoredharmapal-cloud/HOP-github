import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useMetadata } from "@/hooks/useMetadata";
import { articles } from "@/data/journalArticles";

const Journal = () => {
  usePrerenderReady(true);
  useMetadata({
    title: "The Journal — House of Padmavati",
    description: "Field notes and reflections from the House of Padmavati.",
  });

  const [featured, ...rest] = articles;

  return (
    <PageLayout>
      <main>
        <section className="hop-page__room hop-page__section pt-16 sm:pt-20 pb-10 sm:pb-14 text-center">
          <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-ink-soft mb-4">
            The Journal
          </p>
          <h1 className="hop-page__title mx-auto">
            Field notes &amp; reflections.
          </h1>
          <p className="mt-5 text-sm sm:text-base text-ink-soft font-light leading-relaxed max-w-xl mx-auto">
            Dispatches from the loom, histories of the weave, and conversations on the art of choosing well.
          </p>
        </section>

        {featured && (
           <section className="hop-page__room pb-16 sm:pb-24">
             <Link to={`/journal/${featured.slug}`} className="hop-journal-feature group">
               <div className="hop-journal-feature__image">
                {featured.assetPath ? (
                  <OptimizedImage
                    assetPath={featured.assetPath}
                    fallbackSrc={featured.img}
                    alt={featured.title}
                    sizes="(max-width: 768px) 100vw, 1200px"
                    priority={true}
                    imgClassName="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                  />
                ) : (
                  <img
                    src={featured.img}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                  />
                )}
              </div>
               <div className="max-w-3xl">
                <p className="text-[0.6rem] tracking-[0.42em] uppercase text-ink-soft">{featured.tag} · Featured</p>
                <h2 className="mt-3 font-editorial text-3xl md:text-5xl leading-[1.08] text-balance text-ink">
                  {featured.title}
                </h2>
                <p className="mt-4 text-ink-soft font-light text-base sm:text-lg leading-relaxed">{featured.dek}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[0.65rem] tracking-[0.32em] uppercase text-ink border-b border-ink/30 pb-1">
                  Read <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </section>
        )}

        {rest.length > 0 && (
          <section className="border-t border-ink/10">
             <div className="hop-page__room py-14 sm:py-20">
              <p className="text-[0.65rem] tracking-[0.42em] uppercase text-ink-soft mb-10">
                Earlier entries · {rest.length}
              </p>
              <div className="divide-y divide-ink/10 border-y border-ink/10">
                {rest.map((article) => (
                  <Link
                    key={article.slug}
                    to={`/journal/${article.slug}`}
                    className="group grid grid-cols-[64px_1fr] sm:grid-cols-[120px_1fr_auto] items-center gap-5 sm:gap-8 py-6"
                  >
                    <div className="aspect-square overflow-hidden rounded-sm bg-jasmine-deep">
                      {article.assetPath ? (
                        <OptimizedImage
                          assetPath={article.assetPath}
                          fallbackSrc={article.img}
                          alt=""
                          sizes="120px"
                          imgClassName="w-full h-full object-cover"
                        />
                      ) : (
                        <img src={article.img} alt="" loading="lazy" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.6rem] tracking-[0.32em] uppercase text-ink-soft">{article.tag}</p>
                      <h3 className="mt-1.5 font-editorial text-xl sm:text-2xl text-ink leading-snug text-balance">
                        {article.title}
                      </h3>
                      <p className="mt-1 text-sm text-ink-soft font-light leading-relaxed hidden sm:block">
                        {article.dek}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ink-soft transition-transform group-hover:translate-x-1 hidden sm:block" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </PageLayout>
  );
};

export default Journal;

