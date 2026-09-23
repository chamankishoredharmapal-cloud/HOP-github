import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useMetadata, addJsonLd } from "@/hooks/useMetadata";
import { articles } from "@/data/journalArticles";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const JournalDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);
  usePrerenderReady(true);

  useMetadata({
    title: article ? `${article.title} — House of Padmavati` : "Journal — House of Padmavati",
    description: article?.dek ?? "Article not found.",
    ogImage: article?.img,
    ogType: article ? "article" : undefined,
  });

  useEffect(() => {
    if (!article) return;
    addJsonLd({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: article.title,
          description: article.dek,
          image: article.img,
          author: { "@type": "Organization", name: "House of Padmavati" },
          publisher: { "@type": "Organization", name: "House of Padmavati" },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "House", item: "https://houseofpadmavati.com/" },
            { "@type": "ListItem", position: 2, name: "Journal", item: "https://houseofpadmavati.com/journal" },
            { "@type": "ListItem", position: 3, name: article.title, item: `https://houseofpadmavati.com/journal/${article.slug}` },
          ],
        },
      ],
    });
  }, [article]);

  if (!article) {
    return (
      <PageLayout>
        <main className="container pt-28 pb-24 text-center">
          <p className="font-serif font-light text-2xl text-ink">This entry is not on the shelf.</p>
          <p className="mt-3 text-sm text-ink-soft font-light">It may have been moved to the archive.</p>
          <Link to="/journal" className="mt-8 inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.32em] uppercase text-ink border-b border-ink/30 pb-1 hover:border-ink transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Journal
          </Link>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="container pt-12 sm:pt-16 pb-24">
        <Link to="/journal" className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.32em] uppercase text-ink-soft hover:text-ink transition-colors mb-10">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to Journal
        </Link>

        <div className="max-w-3xl mx-auto">
          <p className="text-[0.65rem] tracking-[0.42em] uppercase text-ink-soft">{article.tag}</p>
          <h1 className="mt-4 font-serif font-light text-4xl md:text-5xl text-ink leading-[1.08] text-balance">
            {article.title}
          </h1>

          <div className="mt-10 aspect-[16/9] overflow-hidden rounded-sm bg-jasmine-deep">
            {article.assetPath ? (
              <OptimizedImage
                assetPath={article.assetPath}
                fallbackSrc={article.img}
                alt={article.title}
                sizes="(max-width: 768px) 100vw, 768px"
                priority={true}
                imgClassName="w-full h-full object-cover"
              />
            ) : (
              <img
                src={article.img}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <p className="mt-12 text-lg text-ink-soft font-light leading-relaxed">
            {article.dek}
          </p>
        </div>
      </main>
    </PageLayout>
  );
};

export default JournalDetail;
