import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";
import { articles } from "@/data/journalArticles";

const Journal = () => {
  useMetadata({
    title: "The Journal — House of Padmavati",
    description: "Slow words on cloth and light. Field notes from the loom, the studio, and the quiet hours in between.",
  });

  return (
    <PageLayout>
      <main>
        <section className="container pt-20 pb-12 text-center">
          <p className="text-xs tracking-[0.42em] uppercase text-teal mb-4">The Journal</p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-balance leading-tight">
            Slow words on cloth and light.
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-ink-soft font-light leading-relaxed">
            Field notes from the loom, the studio, and the quiet hours in between.
          </p>
        </section>

        {/* Featured */}
        <section className="container pb-24">
          <Link to={`/journal/${articles[0].slug}`} className="group block">
            <div className="aspect-[16/9] overflow-hidden rounded-md bg-jasmine-deep">
              <img
                src={articles[0].img}
                alt={articles[0].title}
                className="w-full h-full object-cover transition-transform duration-1400 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
            <div className="mt-8 max-w-3xl">
              <p className="text-xs tracking-[0.32em] uppercase text-teal">{articles[0].tag} · Featured</p>
              <h2 className="mt-3 font-serif text-3xl md:text-5xl leading-tight text-balance group-hover:text-teal transition-colors duration-500">
                {articles[0].title}
              </h2>
              <p className="mt-4 text-ink-soft font-light text-lg">{articles[0].dek}</p>
            </div>
          </Link>
        </section>

        {/* Grid */}
        <section className="container pb-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {articles.slice(1).map((a) => (
              <Link key={a.slug} to={`/journal/${a.slug}`} className="group">
                <div className="aspect-[5/4] overflow-hidden rounded-md bg-jasmine-deep">
                  <img
                    src={a.img}
                    alt={a.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1200 ease-out group-hover:scale-105"
                  />
                </div>
                <p className="mt-5 text-[0.7rem] tracking-[0.32em] uppercase text-teal">{a.tag}</p>
                <h3 className="mt-2 font-serif text-2xl text-ink leading-snug text-balance group-hover:text-teal transition-colors duration-500">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-ink-soft font-light">{a.dek}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-[0.65rem] tracking-[0.32em] uppercase text-teal-deep">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </PageLayout>
  );
};

export default Journal;
