import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { HeroSection } from "@/components/hop/HeroSection";
import { CollectionStage } from "@/components/hop/CollectionStage";
import { CraftSection } from "@/components/hop/CraftSection";
import { ModernHeirlooms } from "@/components/hop/ModernHeirlooms";
import { JournalPreview } from "@/components/hop/JournalPreview";
import { useMetadata, addJsonLd } from "@/hooks/useMetadata";

const Index = () => {
  usePrerenderReady(true);
  useMetadata({
    title: "House of Padmavati",
    description: "House of Padmavati is a digital fashion house for Indian sarees.",
  });

  useEffect(() => {
    addJsonLd({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          name: "House of Padmavati",
          description: "A digital fashion house for Indian sarees.",
          url: "https://houseofpadmavati.com",
          logo: "https://houseofpadmavati.com/favicon.png",
          sameAs: [
            "https://instagram.com/houseofpadmavati",
            "https://pinterest.com/houseofpadmavati",
          ],
        },
        {
          "@type": "WebSite",
          url: "https://houseofpadmavati.com",
          name: "House of Padmavati",
          description: "A digital fashion house for Indian sarees.",
        },
      ],
    });
  }, []);

  return (
    <PageLayout transparent>
      <main>
        <HeroSection />
        <CollectionStage />
        <ModernHeirlooms />
        <CraftSection />
        <JournalPreview />
      </main>
    </PageLayout>
  );
};

export default Index;

