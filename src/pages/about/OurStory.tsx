import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import ImageTextBlock from "../../components/about/ImageTextBlock";
import AboutSidebar from "../../components/about/AboutSidebar";
import { useMetadata } from "@/hooks/useMetadata";
import heroImg from "@/assets/hop-hero.jpg";

const OurStory = () => {
  usePrerenderReady(true);
  useMetadata({
    title: "The House — House of Padmavati",
    description: "The story of House of Padmavati. A digital fashion house for Indian sarees.",
    ogImage: heroImg,
  });
  return (
    <PageLayout>
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>

        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
<PageHeader
          title="The House."
          subtitle="A digital fashion house for Indian sarees."
        />

        <h2 className="text-2xl font-light text-foreground mb-6">House of Padmavati</h2>

        <ContentSection>
          <ImageTextBlock
              image={heroImg}
              assetPath="src/assets/hop-hero.jpg"
              imageAlt=""
              title="House of Padmavati is named for a real woman."
              content="We curate the Indian saree for the modern wardrobe. Our collections are designed not as seasonal trends, but as enduring expressions of identity."
              imagePosition="left"
            />
          </ContentSection>
        </main>
      </div>
    </PageLayout>
  );
};

export default OurStory;

