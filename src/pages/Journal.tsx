import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Film } from "@/components/hop/Film";
import { COLLECTION_VIDEOS } from "@/data/collectionVideos";
import { useMetadata } from "@/hooks/useMetadata";
import { articles } from "@/data/journalArticles";
import heroImg from "@/assets/hop-hero.jpg";

const Journal = () => {
  useMetadata({
    title: "The Journal — House of Padmavati",
    description: "The House of Padmavati Journal.",
  });

  return (
    <PageLayout>
      <main>
        <section className="container pt-20 pb-12 text-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-balance leading-tight">
            The Journal.
          </h1>
        </section>

        <section className="container pb-32">
          <Link to={`/journal/${articles[0].slug}`} className="group block">
            <div className="aspect-[16/9] overflow-hidden rounded-md bg-jasmine-deep">
              <Film
                src={COLLECTION_VIDEOS.hero}
                poster={heroImg}
                alt={articles[0].title}
                className="w-full h-full"
                preload="metadata"
              />
            </div>
            <div className="mt-8 max-w-3xl">
              <p className="text-xs tracking-[0.32em] uppercase text-teal">{articles[0].tag} · Featured</p>
              <h2 className="mt-3 font-serif text-3xl md:text-5xl leading-tight text-balance group-hover:text-teal transition-colors duration-500">
                {articles[0].title}
              </h2>
              <p className="mt-4 text-ink-soft font-light text-lg">{articles[0].dek}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[0.65rem] tracking-[0.32em] uppercase text-teal-deep group-hover:text-teal transition-colors">
                Read <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </section>
      </main>
    </PageLayout>
  );
};

export default Journal;
