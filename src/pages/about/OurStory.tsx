import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import ImageTextBlock from "../../components/about/ImageTextBlock";
import AboutSidebar from "../../components/about/AboutSidebar";
import { useMetadata } from "@/hooks/useMetadata";
import { useAboutStorySection } from "@/hooks/useSiteSections";
import heroImg from "@/assets/hop-hero.jpg";

const OurStory = () => {
  usePrerenderReady(true);
  const { story, isPreview } = useAboutStorySection();

  useMetadata({
    title: `${story.heading || "The House"} — House of Padmavati`,
    description:
      story.header_subtitle ||
      "The story of House of Padmavati. A digital fashion house for Indian sarees.",
    ogImage: story.image_url || heroImg,
  });

  return (
    <PageLayout>
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>

        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
          {isPreview && (
            <div className="mb-4 bg-rasa-mulberry/10 border border-rasa-mulberry/30 px-3 py-1.5 text-xs text-rasa-mulberry font-mono rounded">
              Previewing Unapproved Studio Draft
            </div>
          )}

          <PageHeader
            title={story.header_title}
            subtitle={story.header_subtitle}
          />

          <h2 className="text-2xl font-light text-foreground mb-6">{story.heading}</h2>

          <ContentSection>
            <ImageTextBlock
              image={story.image_url || heroImg}
              assetPath={
                story.image_url === heroImg || !story.image_url.startsWith("http")
                  ? "src/assets/hop-hero.jpg"
                  : undefined
              }
              imageAlt={story.image_alt || "House of Padmavati"}
              title={story.story_title}
              content={story.story_content}
              imagePosition={story.image_position || "left"}
            />
          </ContentSection>
        </main>
      </div>
    </PageLayout>
  );
};

export default OurStory;
