import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";
import { Link } from "react-router-dom";
import { HeroSection } from "@/components/hop/HeroSection";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import ProductGrid from "@/components/hop/ProductGrid";
import ContentBlock from "@/components/hop/ContentBlock";
// House photography only: the former Unsplash stock URLs returned 404.
// Local weave studies stand in until commissioned campaign photography exists.
import fabricImg from "@/assets/hop-fabric.jpg";
import linenImg from "@/assets/hop-collection-linen.jpg";
import pattuImg from "@/assets/hop-collection-pattu.jpg";
import organzaImg from "@/assets/hop-collection-organza.jpg";

const QuietWedding = () => {
  usePrerenderReady(true);
  useMetadata({
    title: "The Quiet Wedding · House of Padmavati",
    description: "Bridal collection.",
  });

  return (
    <PageLayout>
      <main>
        {/* Campaign Hero */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center bg-sand/20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20 z-10" />
          <img
            src={fabricImg}
            alt="A close up of heavy Kanchipuram silk draping"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 text-center text-jasmine px-6 max-w-3xl mx-auto">
            <h1 className="font-serif text-5xl md:text-7xl mb-6">Bridal.</h1>
          </div>
        </section>



        {/* Curated Products */}
        <section className="bg-sand/10 py-24 px-6">
          <div className="max-w-[1400px] mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl text-ink">Bridal.</h2>
            </div>
            
            {/* Mocking a grid of curated products for the campaign */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: "1",
                  title: "Kalyani Brocade",
                  price: 85000,
                  image: pattuImg,
                  href: "/product/1"
                },
                {
                  id: "2",
                  title: "Viara Tissue",
                  price: 110000,
                  image: organzaImg,
                  href: "/product/2"
                },
                {
                  id: "3",
                  title: "Megham Pure Zari",
                  price: 95000,
                  image: linenImg,
                  href: "/product/3"
                }
              ].map((product) => (
                <Link to={product.href} key={product.id} className="group block space-y-4">
                  <div className="aspect-[3/4] overflow-hidden bg-sand/20">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="font-serif text-lg text-ink">{product.title}</h3>
                    <p className="text-sm font-light text-ink-soft">₹{(product.price).toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>


      </main>
    </PageLayout>
  );
};

export default QuietWedding;
