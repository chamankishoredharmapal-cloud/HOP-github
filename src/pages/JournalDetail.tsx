import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useMetadata, addJsonLd } from "@/hooks/useMetadata";
import { articles } from "@/data/journalArticles";

const JournalDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

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
          <p className="text-ink-soft text-lg font-light">Article not found.</p>
          <Link to="/journal" className="mt-4 inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase text-teal-deep hover:text-teal transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Journal
          </Link>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="container pt-16 pb-24">
        <Link to="/journal" className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase text-ink-soft hover:text-teal transition-colors mb-10">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Journal
        </Link>

        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.32em] uppercase text-teal">{article.tag}</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-tight text-balance">
            {article.title}
          </h1>

          <div className="mt-10 aspect-[16/9] overflow-hidden rounded-md bg-jasmine-deep">
            <img
              src={article.img}
              alt={article.title}
              className="w-full h-full object-cover"
            />
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
