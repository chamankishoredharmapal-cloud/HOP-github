import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, Heart, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { fetchProductsByCollection } from "@/services/productService";
import { fetchCollectionBySlug } from "@/services/collectionService";
import { COLLECTION_VIDEOS } from "@/data/collectionVideos";
import { Film } from "@/components/hop/Film";
import { getCollectionDescriptor } from "@/data/collectionDescriptors";
import { getWorld } from "@/data/collectionWorlds";
import { Selvedge } from "@/components/hop/Selvedge";
import { useMetadata, addJsonLd } from "@/hooks/useMetadata";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import {
  getSupabaseOptimizedUrl,
  getSupabaseSrcSet,
} from "@/lib/supabaseImage";

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
  const { toggleItem, isWishlisted } = useWishlist();

  const { data: collection, isLoading: collectionLoading, isError: collectionError } = useQuery({
    queryKey: ["storefront", "collection", slug],
    queryFn: () => fetchCollectionBySlug(slug),
    enabled: slug !== "all",
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading: productsLoading, isError: productsError } = useQuery({
    queryKey: ["storefront", "products", slug],
    queryFn: () => fetchProductsByCollection(slug),
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = collectionLoading || productsLoading;
  usePrerenderReady(!isLoading);

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
  const displayNote = collection?.description ?? `Every saree in the house — ${displayName}`;
  const editorial = displayStory || displayNote;
  const world = getWorld(slug);

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

  if (slug !== "all" && !collectionLoading && !collection && !collectionError) {
    return (
      <PageLayout>
        <main className="hop-page">
          <div className="hop-page__state">
            <div>
              <p className="hop-page__kicker justify-center">Collection not found</p>
              <h1 className="hop-page__state-title">This room is not open.</h1>
              <p className="hop-page__state-copy">The collection you entered is no longer part of the house.</p>
              <Link to="/collections" className="hop-page__state-action">Return to Collections <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
            </div>
          </div>
        </main>
      </PageLayout>
    );
  }

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
      <main className="hop-page">
        <div className="w-full aspect-[2/1] overflow-hidden bg-jasmine-deep">
          {collectionLoading ? (
            <div className="w-full h-full bg-jasmine-deep animate-pulse" />
          ) : COLLECTION_VIDEOS[slug] && collection?.hero_image_url ? (
              <Film
                src={COLLECTION_VIDEOS[slug]}
                poster={collection.hero_image_url}
                alt={`${displayName} — collection film`}
                className="aspect-[2/1]"
                preload="metadata"
              />
          ) : collection?.hero_image_url ? (
            <img
              src={collection.hero_image_url}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-jasmine-deep text-ink-soft">
              <span className="text-[0.65rem] tracking-[0.32em] uppercase">{displayName}</span>
              <span className="text-xs font-light">Image forthcoming — the loom is still working.</span>
            </div>
          )}
        </div>

        <div className="hop-page__room">
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

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-ink/15 pb-6 mt-10">
            <div>
              <h1 className="font-editorial text-3xl sm:text-4xl text-ink leading-tight">{displayName}</h1>
              <p className="mt-2 text-[0.65rem] tracking-[0.42em] uppercase text-ink-soft">
                {displayTagline}{world ? ` · ${world.accentName}` : ""}
              </p>
              {world && (
                <p className="mt-2 text-[0.65rem] tracking-wide text-ink-soft font-light">{world.emotion}</p>
              )}
            </div>
            <span className="mt-2 sm:mt-0 text-sm text-ink-soft font-light whitespace-nowrap tnum">
              {data ? `${data.products.length} ${data.products.length === 1 ? "saree" : "sarees"}` : ""}
            </span>
          </div>
          {world && <Selvedge accent={world.accent} className="mt-6 max-w-[240px]" />}

          {editorial && (
            <div className="max-w-2xl mt-10">
              {getCollectionDescriptor(collection?.name, slug) && (
                <p className="font-serif italic font-light text-2xl sm:text-3xl text-ink-soft leading-snug text-balance mb-6">
                  {getCollectionDescriptor(collection?.name, slug)}
                </p>
              )}
              <p className="text-base sm:text-lg text-ink-soft font-light leading-relaxed">
                {editorial}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-14 mb-10">
            <label htmlFor="hop-sort" className="text-[0.65rem] tracking-[0.32em] uppercase text-ink-soft/70">
              Sort
            </label>
            <div className="relative">
              <select
                id="hop-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortValue)}
                className="text-sm text-ink bg-transparent border border-ink/20 rounded-sm pl-3 pr-9 py-2 outline-none cursor-pointer appearance-none font-light hover:border-ink/40 transition-colors"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-ink-soft pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-20 pb-28">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-sm bg-jasmine-deep" />
                  <div className="mt-5 space-y-3">
                    <div className="h-5 w-3/4 rounded-sm bg-jasmine-deep" />
                    <div className="h-4 w-1/3 rounded-sm bg-jasmine-deep" />
                  </div>
                </div>
              ))}
            </div>
          ) : productsError ? (
            <div className="hop-page__state pb-16">
              <div>
                <p className="hop-page__kicker justify-center">The house is quiet</p>
                <h2 className="hop-page__state-title">The collection could not be reached.</h2>
                <p className="hop-page__state-copy">Please try again before choosing a drape.</p>
              </div>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center pb-28 pt-6">
              <p className="font-serif font-light text-2xl text-ink">Nothing here yet.</p>
              <p className="mt-3 text-sm text-ink-soft font-light leading-relaxed max-w-sm mx-auto">
                This chapter is being woven. Begin with the full atelier, or read the journal while you wait.
              </p>
              <div className="mt-8 flex items-center justify-center gap-6 text-[0.65rem] tracking-[0.32em] uppercase">
                <Link to="/collections" className="text-ink border-b border-ink/30 pb-1 hover:border-ink transition-colors">
                  All collections
                </Link>
                <Link to="/journal" className="text-ink-soft hover:text-ink transition-colors">
                  Journal
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 sm:gap-x-6 lg:gap-x-10 gap-y-12 sm:gap-y-16 pb-28">
              {sortedProducts.map((p) => {
                const heroImage = p.images[0]?.url;
                return (
                  <div key={p.id} className="hop-product-card group">
                    <div className="hop-product-card__image relative aspect-[4/5] overflow-hidden rounded-sm bg-jasmine-deep">
                      <Link to={`/product/${p.id}`} aria-label={`View ${p.name}`}>
                        {heroImage ? (
                          <img
                            src={getSupabaseOptimizedUrl(heroImage, { width: 640 })}
                            srcSet={getSupabaseSrcSet(heroImage, [360, 640, 840]) || undefined}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            alt={p.name}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.dataset.fallback) {
                                target.dataset.fallback = "true";
                                target.srcset = "";
                                target.src = heroImage;
                              }
                            }}
                            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-ink-soft/30" />
                          </div>
                        )}
                      </Link>
                      <button
                        onClick={(e) => { e.preventDefault(); handleToggleWishlist(p.id, p.name, p.selling_price, heroImage); }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-jasmine/80 flex items-center justify-center hover:bg-jasmine transition-colors"
                        aria-label={isWishlisted(`product-${p.id}`) ? "Remove from wishlist" : "Save to wishlist"}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isWishlisted(`product-${p.id}`)
                              ? "fill-signature-crimson text-signature-crimson"
                              : "text-ink"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="hop-product-card__meta mt-4 space-y-1">
                      <Link to={`/product/${p.id}`}>
                        <h3 className="font-serif font-light text-base sm:text-lg md:text-xl text-ink leading-tight">
                          {p.name}
                        </h3>
                      </Link>
                      <p className="text-sm font-light text-ink-soft">
                        {formatPrice(p.selling_price)}
                      </p>
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
