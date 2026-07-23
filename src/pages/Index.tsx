import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { HeroSection } from "@/components/hop/HeroSection";
import { CollectionStage } from "@/components/hop/CollectionStage";
import { CraftSection } from "@/components/hop/CraftSection";
import { ModernHeirlooms } from "@/components/hop/ModernHeirlooms";
import { JournalPreview } from "@/components/hop/JournalPreview";
import { useMetadata, addJsonLd } from "@/hooks/useMetadata";

const Index = () => {
  useMetadata({
    title: "House of Padmavati",
    description: "House of Padmavati: a digital sanctuary for heritage and contemporary luxury sarees, woven with quiet artistry.",
  });

  useEffect(() => {
    addJsonLd({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          name: "House of Padmavati",
          description: "A digital sanctuary for heritage and contemporary luxury sarees.",
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
          description: "A digital sanctuary for heritage and contemporary luxury sarees.",
        },
      ],
    });
  }, []);

  return (
    <PageLayout transparent>
      <main>
        <HeroSection />
        <CollectionStage />
        <CraftSection />
        <ModernHeirlooms />
        <JournalPreview />
      </main>
    </PageLayout>
  );
};

export default Index;
