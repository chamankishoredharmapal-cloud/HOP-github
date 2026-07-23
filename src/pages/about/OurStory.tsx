import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import ImageTextBlock from "../../components/about/ImageTextBlock";
import AboutSidebar from "../../components/about/AboutSidebar";
import { useMetadata } from "@/hooks/useMetadata";
import heroImg from "@/assets/hop-hero.jpg";

const OurStory = () => {
  useMetadata({
    title: "Our Story — House of Padmavati",
    description: "House of Padmavati was born from the quiet rhythm of a loom — a love letter to the woman who wove our world.",
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
            title="A House, not a shop."
            subtitle="House of Padmavati was born from the quiet rhythm of a loom — a love letter to the woman who wove our world."
          />

          <ContentSection>
            <ImageTextBlock
              image={heroImg}
              imageAlt="A weaver at her pit loom in early morning light"
              title="To the woman who wove my world."
              content="House of Padmavati began as a private dedication — to a mother, a grandmother, an aunt; to the women whose hands carry the memory of cloth. We make sarees the way they were once made for our own homes: slowly, with care, and without noise. No countdown timers. No aggressive sales. Only the cloth, the woman, and the story between them."
              imagePosition="left"
            />
          </ContentSection>

          <ContentSection title="The Coastal Blossom">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-ink">A palette, a feeling</h3>
                <p className="text-ink-soft leading-relaxed font-light">
                  Every Padmavati saree is calibrated to a single ratio — sixty per cent Jasmine Mist,
                  twenty-five per cent Coastal Teal, ten per cent Golden Sand, five per cent Sakura blush.
                  It is the colour of a coastal morning in South India, held still.
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-ink">A house, not a shop</h3>
                <p className="text-ink-soft leading-relaxed font-light">
                  We are not a marketplace. We are a small studio that releases a handful of sarees each
                  month — each one a vessel for a memory, designed to be passed on, never thrown away.
                </p>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="What we hold to">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-ink">Slowness</h3>
                <p className="text-ink-soft font-light">
                  Twenty-one days on the loom, not twenty-one minutes on a feed.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-ink">Quietness</h3>
                <p className="text-ink-soft font-light">
                  No badges, no banners, no urgency. Only the cloth, photographed in daylight.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-ink">Continuance</h3>
                <p className="text-ink-soft font-light">
                  A Padmavati is meant to outlive its first wearer — a modern heirloom.
                </p>
              </div>
            </div>
          </ContentSection>
        </main>
      </div>
    </PageLayout>
  );
};

export default OurStory;
