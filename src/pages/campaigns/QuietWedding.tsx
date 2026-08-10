import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";
import { Link } from "react-router-dom";
import { HeroSection } from "@/components/hop/HeroSection";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import ProductGrid from "@/components/hop/ProductGrid";
import ContentBlock from "@/components/hop/ContentBlock";

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
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center bg-sand-light overflow-hidden">
          <div className="absolute inset-0 bg-black/20 z-10" />
          <img
            src="https://images.unsplash.com/photo-1583391733958-d25e77b22438?auto=format&fit=crop&q=80"
            alt="A close up of heavy Kanchipuram silk draping"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 text-center text-jasmine px-6 max-w-3xl mx-auto">
            <h1 className="font-serif text-5xl md:text-7xl mb-6">Bridal.</h1>
          </div>
        </section>



        {/* Curated Products */}
        <section className="bg-sand-light/30 py-24 px-6">
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
                  image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80",
                  href: "/products/kalyani-brocade"
                },
                {
                  id: "2",
                  title: "Viara Tissue",
                  price: 110000,
                  image: "https://images.unsplash.com/photo-1605810756770-3532cb19e240?auto=format&fit=crop&q=80",
                  href: "/products/viara-tissue"
                },
                {
                  id: "3",
                  title: "Megham Pure Zari",
                  price: 95000,
                  image: "https://images.unsplash.com/photo-1583391733975-6677f5f9f8c6?auto=format&fit=crop&q=80",
                  href: "/products/megham-pure-zari"
                }
              ].map((product) => (
                <Link to={product.href} key={product.id} className="group block space-y-4">
                  <div className="aspect-[3/4] overflow-hidden bg-sand-light">
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
