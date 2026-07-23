import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { ProductGallery } from "@/components/hop/ProductGallery";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { fetchProductById, fetchRelatedProducts } from "@/services/productService";
import { useMetadata, addJsonLd } from "@/hooks/useMetadata";

function formatPrice(paise: number): string {
  return `₹ ${(paise / 100).toLocaleString("en-IN")}`;
}

const ProductDetail = () => {
  const { productId } = useParams();
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  const { data: product, isLoading } = useQuery({
    queryKey: ["storefront", "product", productId],
    queryFn: () => fetchProductById(productId!),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["storefront", "related", product?.collection_id, product?.id],
    queryFn: () => fetchRelatedProducts(product!.collection_id!, product!.id),
    enabled: !!product?.collection_id && !!product?.id,
    staleTime: 5 * 60 * 1000,
  });

  const heroImage = product?.images?.[0]?.url;

  useMetadata({
    title: product ? `${product.name} — House of Padmavati` : "House of Padmavati",
    description: product
      ? (product.story || product.short_description || product.customer_description || "Handcrafted with care.")
      : "House of Padmavati: a digital sanctuary for heritage and contemporary luxury sarees.",
    ogImage: heroImage,
  });

  useEffect(() => {
    if (!product || !productId) return;
    const price = (product.selling_price / 100).toFixed(2);
    const availability = product.stock > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";
    addJsonLd({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          name: product.name,
          description: product.story || product.short_description || product.customer_description || "",
          image: heroImage ?? undefined,
          brand: { "@type": "Brand", name: "House of Padmavati" },
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "INR",
            availability,
          },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "House", item: "https://houseofpadmavati.com/" },
            { "@type": "ListItem", position: 2, name: product.collection_name ?? "Collections", item: `https://houseofpadmavati.com${product.collection_id ? `/collections/${product.slug}` : "/collections"}` },
            { "@type": "ListItem", position: 3, name: product.name, item: `https://houseofpadmavati.com/product/${productId}` },
          ],
        },
      ],
    });
  }, [product, productId, heroImage]);

  if (isLoading) {
    return (
      <PageLayout>
        <main className="container pt-10 pb-24 animate-pulse">
          <div className="h-4 w-64 rounded bg-muted mb-10" />
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="aspect-[4/5] rounded-md bg-muted" />
            <div className="space-y-6">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-10 w-3/4 rounded bg-muted" />
              <div className="h-6 w-32 rounded bg-muted" />
              <div className="h-20 w-full rounded bg-muted" />
            </div>
          </div>
        </main>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <main className="container pt-10 pb-24">
          <Breadcrumb className="mb-10">
            <BreadcrumbList className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">House</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Product not found</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-ink-soft text-lg font-light">Product not found.</p>
        </main>
      </PageLayout>
    );
  }

  const gallery = product.images.length > 0
    ? product.images.map((img) => img.url)
    : [];

  const wishlistId = `product-${product.id}`;
  const saved = isWishlisted(wishlistId);

  const handleAddToCart = () => {
    addItem({
      id: wishlistId,
      productId: product.id,
      name: product.name,
      price: product.selling_price,
      formattedPrice: formatPrice(product.selling_price),
      image: gallery[0] ?? "",
      size: `Drape · ${product.length || "5.5m"}${product.blouse_included ? " + 0.8m blouse" : ""}`,
    });
    toast("Added to bag", {
      description: product.name,
      duration: 3000,
    });
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id: wishlistId,
      name: product.name,
      price: product.selling_price,
      formattedPrice: formatPrice(product.selling_price),
      image: gallery[0] ?? "",
      collection: product.collection_name ?? "",
    });
    toast(saved ? "Removed from wishlist" : "Added to wishlist", {
      description: product.name,
      duration: 2000,
    });
  };

  return (
    <PageLayout>
      <main className="container pt-10 pb-24">
        <Breadcrumb className="mb-10">
          <BreadcrumbList className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">House</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={product.collection_id ? `/collections/${product.slug}` : "/collections"}>
                  {product.collection_name ?? "Collections"}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            {gallery.length > 0 ? (
              <ProductGallery images={gallery} aspectRatio="4/5" />
            ) : (
              <div className="aspect-[4/5] rounded-md bg-jasmine-deep flex items-center justify-center">
                <p className="text-sm text-ink-soft/50 font-light">No images available</p>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-32 lg:h-fit space-y-8">
            <div>
              {product.collection_name && (
                <p className="text-[0.7rem] tracking-[0.42em] uppercase text-teal">
                  {product.collection_name}
                </p>
              )}
              <h1 className="mt-3 font-serif text-4xl md:text-5xl text-ink leading-tight">
                {product.name}
              </h1>
              <p className="mt-4 text-xl font-light text-ink-soft">
                {formatPrice(product.selling_price)}
              </p>
            </div>

            <p className="text-ink-soft font-light leading-relaxed max-w-md">
              {product.story || product.short_description || product.customer_description || "Handcrafted with care."}
            </p>

            <div className="space-y-3">
              <p className="text-[0.7rem] tracking-[0.32em] uppercase text-ink-soft">
                {product.length ? `Drape · ${product.length}` : "Standard drape"}
                {product.blouse_included ? " + 0.8m blouse" : ""}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-teal-deep text-jasmine px-7 py-4 text-[0.7rem] tracking-[0.32em] uppercase rounded-full hover:bg-teal transition-colors duration-500"
              >
                Add to bag
              </button>
              <button
                onClick={handleToggleWishlist}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:text-teal transition-colors"
              >
                <Heart className={`w-4 h-4 transition-colors ${saved ? "fill-teal text-teal" : ""}`} />
              </button>
            </div>

            <Accordion type="single" collapsible className="border-t border-border pt-2">
              {product.fabric || product.weave ? (
                <AccordionItem value="weave" className="border-b border-border">
                  <AccordionTrigger className="text-sm tracking-wider uppercase">The Weave</AccordionTrigger>
                  <AccordionContent className="text-ink-soft font-light leading-relaxed">
                    {product.weave && `Weave: ${product.weave}`}
                    {product.weave && product.fabric ? ". " : ""}
                    {product.fabric && `Fabric: ${product.fabric}`}
                    {product.country_of_origin && `. Made in ${product.country_of_origin}.`}
                  </AccordionContent>
                </AccordionItem>
              ) : null}
              {product.care_instructions ? (
                <AccordionItem value="care" className="border-b border-border">
                  <AccordionTrigger className="text-sm tracking-wider uppercase">Saree Care</AccordionTrigger>
                  <AccordionContent className="text-ink-soft font-light leading-relaxed">
                    {product.care_instructions}
                  </AccordionContent>
                </AccordionItem>
              ) : null}
              <AccordionItem value="ship" className="border-b border-border">
                <AccordionTrigger className="text-sm tracking-wider uppercase">Wrapped & Shipped</AccordionTrigger>
                <AccordionContent className="text-ink-soft font-light leading-relaxed space-y-2">
                  <p>Hand-wrapped in jasmine paper with a handwritten keepsake card. Worldwide shipping, fully insured.</p>
                  <p className="text-xs text-ink-soft/60">Free standard shipping within India. 14-day return window for unworn sarees.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-32">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-serif text-3xl md:text-4xl">From the same loom.</h2>
              <Link
                to={product.collection_id ? `/collections/${product.slug}` : "/collections"}
                className="text-sm font-light text-ink hover:text-teal flex items-center gap-2"
              >
                View {product.collection_name ?? "Collection"} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group">
                  <div className="aspect-[4/5] overflow-hidden bg-jasmine-deep rounded-md">
                    {p.images[0] ? (
                      <img
                        src={p.images[0].url}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-1200 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-ink-soft/50" />
                      </div>
                    )}
                  </div>
                  <div className="mt-4 space-y-1">
                    <h3 className="font-serif text-lg text-ink leading-tight">{p.name}</h3>
                    <p className="text-sm font-light text-ink-soft">{formatPrice(p.selling_price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </PageLayout>
  );
};

export default ProductDetail;
