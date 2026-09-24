import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { articles } from "@/data/journalArticles";

export const JournalPreview = () => {
  const preview = articles.slice(0, 3);
  return (
  <section className="container py-section-sm border-t border-ink/10">
    <div className="flex items-end justify-between mb-10 sm:mb-14 gap-4">
      <div>
        <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-ink-soft mb-3">The Journal</p>
        <h2 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl text-ink">Field notes &amp; reflections.</h2>
        <p className="mt-4 text-sm sm:text-base text-ink-soft font-light max-w-md">
          Dispatches from the loom, histories of the weave, and conversations on the art of choosing well.
        </p>
      </div>
      <Link to="/journal" className="hidden md:inline text-[0.7rem] tracking-[0.32em] uppercase text-ink border-b border-ink/30 pb-1 hover:border-ink transition-colors">
        Read all
      </Link>
    </div>
    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
      {preview.map((article) => (
        <Link key={article.slug} to={`/journal/${article.slug}`} className="group">
          <div className="aspect-[5/4] overflow-hidden rounded-sm bg-jasmine-deep">
            {article.assetPath ? (
              <OptimizedImage
                assetPath={article.assetPath}
                fallbackSrc={article.img}
                alt={article.title}
                sizes="(max-width: 768px) 100vw, 33vw"
                imgClassName="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <img
                src={article.img}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
              />
            )}
          </div>
          <p className="mt-5 text-[0.6rem] tracking-[0.32em] uppercase text-ink-soft">{article.tag}</p>
          <h3 className="mt-2 font-serif font-light text-xl sm:text-2xl text-ink leading-snug text-balance">
            {article.title}
          </h3>
        </Link>
      ))}
    </div>
    <div className="mt-10 text-center md:hidden">
      <Link to="/journal" className="inline-block text-[0.7rem] tracking-[0.32em] uppercase text-ink border-b border-ink/30 pb-1">
        Read all entries
      </Link>
    </div>
  </section>
  );
};