import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";
import { Link } from "react-router-dom";

const Lookbook = () => {
  useMetadata({
    title: "Lookbook · House of Padmavati",
    description: "A visual archive of House of Padmavati.",
  });

  return (
    <PageLayout>
      <main className="bg-sand-light min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80"
              alt="Macro detail of hand-twisted silver zari on a Kalyani border"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <div className="relative z-10 text-center px-6 mt-32">
            <h1 className="font-serif text-5xl md:text-7xl text-jasmine mb-6 drop-shadow-sm">Lookbook.</h1>
          </div>
        </section>

        {/* Section I: The Architecture of Silk */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-24">

            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-8 items-start">
              {/* Image 1 */}
              <figure className="md:col-span-5 md:mt-24 space-y-4">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1584557997672-b7dce51d7c04?auto=format&fit=crop&q=80" 
                    alt="Detail of a heavy border"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm font-light text-ink-soft border-l border-teal/30 pl-4 py-1">
                  Kalyani Brocade. Hand-twisted silver zari over forty days.
                </figcaption>
              </figure>

              {/* Image 2 */}
              <figure className="md:col-span-7 space-y-4">
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1605810756770-3532cb19e240?auto=format&fit=crop&q=80" 
                    alt="The interaction of warp and weft"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm font-light text-ink-soft border-l border-teal/30 pl-4 py-1">
                  Viara Tissue. The tension between the warp and weft.
                </figcaption>
              </figure>

              {/* Image 3 */}
              <figure className="md:col-span-8 md:col-start-3 space-y-4 md:mt-16">
                <div className="aspect-[3/2] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1583391733975-6677f5f9f8c6?auto=format&fit=crop&q=80" 
                    alt="Pure zari detail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm font-light text-ink-soft border-l border-teal/30 pl-4 py-1">
                  The dense, heavy border of the Megham collection.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* Section II: The Drape */}
        <section className="py-32 px-6 bg-[#EBE7E0]">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-24">

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
              <figure className="space-y-4">
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1610030469607-482a5c53b27b?auto=format&fit=crop&q=80" 
                    alt="Saree in motion"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm font-light text-ink-soft border-l border-teal/30 pl-4 py-1">
                  The unhurried fall of Kanchipuram silk.
                </figcaption>
              </figure>

              <figure className="space-y-4 md:mt-48">
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1583391733958-d25e77b22438?auto=format&fit=crop&q=80" 
                    alt="Saree pleats"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm font-light text-ink-soft border-l border-teal/30 pl-4 py-1">
                  Linen holding its structure.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* Closure */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-lg mx-auto space-y-12">
            <div className="aspect-square overflow-hidden bg-white/50 p-8 rounded-sm">
              <img 
                src="https://images.unsplash.com/photo-1610030469647-7973dfd70756?auto=format&fit=crop&q=80" 
                alt="Folded saree in a box"
                className="w-full h-full object-cover rounded-sm mix-blend-multiply"
              />
            </div>

            <div>
              <Link 
                to="/collections" 
                className="inline-block border border-teal text-teal px-8 py-3 text-sm tracking-widest uppercase hover:bg-teal hover:text-jasmine transition-colors"
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
