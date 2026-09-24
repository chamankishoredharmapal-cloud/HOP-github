import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";
import { Link } from "react-router-dom";
// House photography only: the former Unsplash stock URLs returned 404 and
// violated the house imagery doctrine. Local weave studies stand in until
// commissioned collection photography exists (content track).
import heroImg from "@/assets/hop-hero.jpg";
import fabricImg from "@/assets/hop-fabric.jpg";
import giftImg from "@/assets/hop-gift.jpg";
import linenImg from "@/assets/hop-collection-linen.jpg";
import pattuImg from "@/assets/hop-collection-pattu.jpg";
import organzaImg from "@/assets/hop-collection-organza.jpg";

const Lookbook = () => {
  usePrerenderReady(true);
  useMetadata({
    title: "Lookbook · House of Padmavati",
    description: "A visual archive of House of Padmavati.",
  });

  return (
    <PageLayout>
      <main className="bg-sand/20 min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={fabricImg}
              alt="Macro detail of hand-twisted silver zari on a Kalyani border"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <div className="relative z-10 text-center px-6 mt-header">
            <h1 className="font-serif text-5xl md:text-7xl text-jasmine mb-6 drop-shadow-sm">Lookbook.</h1>
          </div>
        </section>

        {/* Section I: The Architecture of Silk */}
        <section className="py-section-lg px-6">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-24">

            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-8 items-start">
              {/* Image 1 */}
              <figure className="md:col-span-5 md:mt-24 space-y-4">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={pattuImg} 
                    alt="Detail of a heavy border"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm font-light text-ink-soft border-l border-signature-crimson/30 pl-4 py-1">
                  Kalyani Brocade. Hand-twisted silver zari over forty days.
                </figcaption>
              </figure>

              {/* Image 2 */}
              <figure className="md:col-span-7 space-y-4">
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={heroImg} 
                    alt="The interaction of warp and weft"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm font-light text-ink-soft border-l border-signature-crimson/30 pl-4 py-1">
                  Viara Tissue. The tension between the warp and weft.
                </figcaption>
              </figure>

              {/* Image 3 */}
              <figure className="md:col-span-8 md:col-start-3 space-y-4 md:mt-16">
                <div className="aspect-[3/2] overflow-hidden">
                  <img 
                    src={linenImg} 
                    alt="Pure zari detail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm font-light text-ink-soft border-l border-signature-crimson/30 pl-4 py-1">
                  The dense, heavy border of the Megham collection.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* Section II: The Drape */}
        <section className="py-section-lg px-6 bg-paper-alt">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-24">

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
              <figure className="space-y-4">
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={organzaImg} 
                    alt="Saree in motion"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm font-light text-ink-soft border-l border-signature-crimson/30 pl-4 py-1">
                  The unhurried fall of Kanchipuram silk.
                </figcaption>
              </figure>

              <figure className="space-y-4 md:mt-48">
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={linenImg} 
                    alt="Saree pleats"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm font-light text-ink-soft border-l border-signature-crimson/30 pl-4 py-1">
                  Linen holding its structure.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* Closure */}
        <section className="py-section-lg px-6 text-center">
          <div className="max-w-lg mx-auto space-y-12">
            <div className="aspect-square overflow-hidden bg-white/50 p-8 rounded-sm">
              <img 
                src={giftImg} 
                alt="Folded saree in a box"
                className="w-full h-full object-cover rounded-sm mix-blend-multiply"
              />
            </div>

            <div>
              <Link 
                to="/collections" 
                className="inline-block border border-signature-crimson text-signature-crimson px-8 py-3 text-sm tracking-widest uppercase hover:bg-signature-crimson hover:text-jasmine transition-colors"
              >
                View collections
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
};

export default Lookbook;

