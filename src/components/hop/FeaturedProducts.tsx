import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import heroImg from "@/assets/hop-hero.jpg";
import fabricImg from "@/assets/hop-fabric.jpg";
import giftImg from "@/assets/hop-gift.jpg";
import linenImg from "@/assets/hop-collection-linen.jpg";
import pattuImg from "@/assets/hop-collection-pattu.jpg";
import organzaImg from "@/assets/hop-collection-organza.jpg";

/**
 * Phase 3 — Pattern 1: Static ESM & Catalog Assets
 *
 * Each catalog item retains its original source fallback (`img`)
 * and gains an explicit `assetPath` for deterministic manifest resolution
 * via <OptimizedImage />.
 */
export interface FeaturedProduct {
  name: string;
  price: string;
  img: string;
  assetPath: string;
  href: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const featured: FeaturedProduct[] = [
  {
    name: "Padmini · Coastal Pattu",
    price: "₹ 48,000",
    img: pattuImg,
    assetPath: "src/assets/hop-collection-pattu.jpg",
    href: "/product/1",
  },
  {
    name: "Viara · Reception Silk",
    price: "₹ 64,000",
    img: heroImg,
    assetPath: "src/assets/hop-hero.jpg",
    href: "/product/2",
  },
  {
    name: "Megham · Twilight Linen",
    price: "₹ 14,200",
    img: linenImg,
    assetPath: "src/assets/hop-collection-linen.jpg",
    href: "/product/3",
  },
  {
    name: "Oosi Kattam · Gold Grid",
    price: "₹ 38,500",
    img: fabricImg,
    assetPath: "src/assets/hop-fabric.jpg",
    href: "/product/4",
  },
  {
    name: "Sakura · Organza Drift",
    price: "₹ 22,500",
    img: organzaImg,
    assetPath: "src/assets/hop-collection-organza.jpg",
    href: "/product/5",
  },
  {
    name: "Jasmine · Heirloom Ivory",
    price: "₹ 86,000",
    img: giftImg,
    assetPath: "src/assets/hop-gift.jpg",
    href: "/product/6",
  },
];

export const FeaturedProducts = () => (
  <section className="bg-jasmine-deep/40">
    <div className="container py-20 sm:py-28 lg:py-32">
      <div className="flex items-end justify-between mb-12 sm:mb-16 gap-4">
        <div>
          <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-teal mb-3">
            Six, quietly chosen
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl">
            From the house.
          </h2>
        </div>
        <Link
          to="/collections"
          className="hidden md:inline text-[0.7rem] tracking-[0.32em] uppercase text-ink hover:text-teal underline underline-offset-4"
        >
          View atelier
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-12 sm:gap-y-16">
        {featured.map((p) => (
          <Link key={p.name} to={p.href} className="group">
            <div className="aspect-[4/5] overflow-hidden bg-jasmine rounded-md">
              <OptimizedImage
                assetPath={p.assetPath}
                fallbackSrc={p.img}
                alt={p.name}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                imgClassName="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-3">
              <h3 className="font-serif text-base sm:text-lg md:text-xl text-ink leading-tight">
                {p.name}
              </h3>
              <p className="text-xs sm:text-sm font-light text-ink-soft whitespace-nowrap">
                {p.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
export default FeaturedProducts;
