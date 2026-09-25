import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";
import { Link } from "react-router-dom";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import fabricImg from "@/assets/hop-fabric.jpg";
import linenImg from "@/assets/hop-collection-linen.jpg";
import pattuImg from "@/assets/hop-collection-pattu.jpg";
import organzaImg from "@/assets/hop-collection-organza.jpg";

const QuietWedding = () => {
  usePrerenderReady(true);
  useMetadata({
    title: "The Quiet Wedding · House of Padmavati",
    description: "A bridal note from House of Padmavati.",
  });

  return (
    <PageLayout darkHero>
      <main className="hop-page">
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <img
            src={fabricImg}
            alt="A close study of heavy silk and zari"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 text-center text-jasmine px-6 max-w-4xl mx-auto">
            <p className="hop-page__kicker justify-center hop-page__kicker--light">The quiet wedding</p>
            <h1 className="hop-page__title mt-6">For the hour that stays.</h1>
            <p className="mx-auto mt-6 max-w-xl font-editorial text-lg leading-relaxed text-jasmine/80">
              A bridal note for the rituals, textures and silences that gather around a wedding.
            </p>
          </div>
        </section>

        <section className="hop-page__room hop-page__section">
          <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="hop-page__kicker">Campaign notes</p>
              <h2 className="hop-page__title hop-page__title--small mt-6">A softer kind of ceremony.</h2>
              <p className="hop-page__lede mt-8">
                The bridal wardrobe is a conversation between presence and restraint. Begin with the collection, then choose the drape that feels most like you.
              </p>
              <Link to="/collections" className="hop-cta-primary mt-8">
                Explore collections
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <figure className="space-y-3">
                <div className="aspect-[3/4] overflow-hidden bg-jasmine-deep">
                  <img src={pattuImg} alt="A zari border study" className="w-full h-full object-cover" />
                </div>
                <figcaption className="hop-lookbook__caption">The border, held close.</figcaption>
              </figure>
              <figure className="space-y-3 pt-12 sm:pt-20">
                <div className="aspect-[3/4] overflow-hidden bg-jasmine-deep">
                  <img src={organzaImg} alt="A folded silk study" className="w-full h-full object-cover" />
                </div>
                <figcaption className="hop-lookbook__caption">Light finding its way through the weave.</figcaption>
              </figure>
              <figure className="col-span-2 space-y-3 sm:ml-[20%]">
                <div className="aspect-[16/9] overflow-hidden bg-jasmine-deep">
                  <img src={linenImg} alt="A natural fibre texture study" className="w-full h-full object-cover" />
                </div>
                <figcaption className="hop-lookbook__caption">The final layer: something chosen to keep.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="hop-page__section--dark">
          <div className="hop-page__room py-24 text-center sm:py-32">
            <p className="hop-page__kicker justify-center hop-page__kicker--light">The house invitation</p>
            <h2 className="hop-page__title mx-auto mt-6">Choose with intention.</h2>
            <p className="mx-auto mt-7 max-w-lg font-editorial text-lg leading-relaxed text-jasmine/75">
              For private viewing and bridal conversations, write to the House and we will guide you through the next step.
            </p>
            <Link to="/appointments" className="hop-cta-primary mt-9 border-jasmine bg-jasmine text-ink hover:bg-jasmine/90">
              Request an appointment
            </Link>
          </div>
        </section>
      </main>
    </PageLayout>
  );
};

export default QuietWedding;
