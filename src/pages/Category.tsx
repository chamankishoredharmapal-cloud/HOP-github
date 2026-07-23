import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { fetchProductsByCollection } from "@/services/productService";
import { fetchCollectionBySlug } from "@/services/collectionService";
import { COLLECTION_VIDEOS } from "@/data/collectionVideos";
import { useMetadata, addJsonLd } from "@/hooks/useMetadata";

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

function formatPrice(paise: number): string {
  return `₹ ${(paise / 100).toLocaleString("en-IN")}`;
}

const Category = () => {
  const { slug = "all" } = useParams();
  const [sort, setSort] = useState<SortValue>("newest");
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  const { data: collection, isLoading: collectionLoading } = useQuery({
    queryKey: ["storefront", "collection", slug],
    queryFn: () => fetchCollectionBySlug(slug),
    enabled: slug !== "all",
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading: productsLoading } = useQuery({
    queryKey: ["storefront", "products", slug],
    queryFn: () => fetchProductsByCollection(slug),
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = collectionLoading || productsLoading;

  useMetadata({
    title: `${collection?.name ?? "The Atelier"} — House of Padmavati`,
    description: collection?.editorial_story ?? collection?.description ?? "Every saree currently in the house.",
    ogImage: collection?.hero_image_url,
  });

  useEffect(() => {
    if (!slug || slug === "all") return;
    const items = [
      { position: 1, name: "House", item: "/" },
      { position: 2, name: "Collections", item: "/collections" },
      { position: 3, name: collection?.name ?? "The Atelier", item: `/collections/${slug}` },
    ];
    addJsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map(({ position, name, item }) => ({
        "@type": "ListItem",
        position,
        name,
        item: `https://houseofpadmavati.com${item}`,
      })),
    });
  }, [slug, collection?.name]);

  const displayName = collection?.name ?? "The Atelier";
  const displayTagline = collection?.tagline ?? "All weaves · All seasons";
  const displayStory = collection?.editorial_story ?? "";
  const displayNote = collection?.description ?? "Every saree currently in the house.";
  const editorial = displayStory || displayNote;

  const sortedProducts = useMemo(() => {
    if (!data) return [];
    const products = [...data.products];
    switch (sort) {
      case "price-asc":
        return products.sort((a, b) => a.selling_price - b.selling_price);
      case "price-desc":
        return products.sort((a, b) => b.selling_price - a.selling_price);
      case "name-asc":
        return products.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return products;
    }
  }, [sort, data]);

  const handleAddToCart = (productId: string, name: string, price: number, image?: string) => {
    addItem({
      id: `product-${productId}`,
      productId,
      name,
      price,
      formattedPrice: formatPrice(price),
      image: image ?? "",
    });
    toast("Added to bag", { description: name, duration: 3000 });
  };

  const handleToggleWishlist = (productId: string, name: string, price: number, image?: string) => {
    const id = `product-${productId}`;
    const wasWishlisted = isWishlisted(id);
    toggleItem({
      id,
      name,
      price,
      formattedPrice: formatPrice(price),
      image: image ?? "",
      collection: displayName,
    });
    toast(wasWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      description: name,
      duration: 2000,
    });
  };

  return (
    <PageLayout>
      <main>
        <div className="w-full aspect-[2/1] overflow-hidden bg-jasmine-deep">
          {collectionLoading ? (
            <div className="w-full h-full bg-muted animate-pulse" />
          ) : COLLECTION_VIDEOS[slug] ? (
              <video
                src={COLLECTION_VIDEOS[slug]}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={collection?.hero_image_url}
              />
          ) : collection?.hero_image_url ? (
            <img
              src={collection.hero_image_url}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs text-ink-soft/30" />
            </div>
          )}
        </div>

        <div className="container">
          <div className="pt-6 pb-2">
            <Breadcrumb>
              <BreadcrumbList className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild><Link to="/">House</Link></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild><Link to="/collections">Collections</Link></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6 mt-10">
            <div>
              <p className="text-xs tracking-[0.42em] uppercase text-teal">{displayTagline}</p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-ink mt-2 leading-tight">
                {displayName}
              </h1>
            </div>
            <span className="mt-2 sm:mt-0 text-sm text-ink-soft font-light whitespace-nowrap">
              {data ? `${data.products.length} sarees` : ""}
            </span>
          </div>

          {editorial && (
            <div className="max-w-2xl mt-12">
              <p className="text-base sm:text-lg text-ink-soft font-light leading-relaxed">
                {editorial}
              </p>
              <p className="mt-8 text-xs tracking-[0.32em] uppercase text-ink-soft/50">
                — A note from the house
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-20 mb-14">
            <label className="text-xs tracking-[0.32em] uppercase text-ink-soft/70">
              Sort
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortValue)}
              className="text-sm text-ink bg-transparent border border-border px-3 py-2 outline-none cursor-pointer appearance-none font-light"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-20 pb-28">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-md bg-muted" />
                  <div className="mt-5 space-y-3">
                    <div className="h-5 w-3/4 rounded bg-muted" />
                    <div className="h-4 w-1/3 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="flex items-center justify-center pb-28">
              <p className="text-ink-soft text-sm font-light">No products found in this collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-20 pb-28">
              {sortedProducts.map((p) => {
                const heroImage = p.images[0]?.url;
                return (
                  <div key={p.id} className="group">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-jasmine-deep">
                      <Link to={`/product/${p.id}`}>
                        {heroImage ? (
                          <img
                            src={heroImage}
                            alt={p.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-1200 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-ink-soft/30" />
                          </div>
                        )}
                      </Link>
                      <button
                        onClick={(e) => { e.preventDefault(); handleToggleWishlist(p.id, p.name, p.selling_price, heroImage); }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-jasmine/70 backdrop-blur-sm flex items-center justify-center hover:bg-jasmine transition-colors"
                        aria-label={isWishlisted(`product-${p.id}`) ? "Remove from wishlist" : "Save to wishlist"}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isWishlisted(`product-${p.id}`)
                              ? "fill-teal text-teal"
                              : "text-ink"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="mt-5 space-y-3">
                      <Link to={`/product/${p.id}`}>
                        <h3 className="font-serif text-lg md:text-xl text-ink leading-tight hover:text-teal transition-colors">
                          {p.name}
                        </h3>
                      </Link>
                      <p className="text-sm font-light text-ink-soft">
                        {formatPrice(p.selling_price)}
                      </p>
                      <Button
                        onClick={() => handleAddToCart(p.id, p.name, p.selling_price, heroImage)}
                        className="rounded-full bg-teal-deep text-jasmine hover:bg-teal transition-colors duration-500 text-[0.6rem] tracking-[0.32em] uppercase h-8 px-5"
                      >
                        Add to bag
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
};

export default Category;
