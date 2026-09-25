import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useMetadata } from "@/hooks/useMetadata";
import { getSupabaseOptimizedUrl } from "@/lib/supabaseImage";

export default function Wishlist() {
  useMetadata({
    title: "Wishlist — House of Padmavati",
    description: "Your saved items.",
  });
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <PageLayout>
        <main className="hop-page hop-page__room hop-page__section pt-28 pb-24">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="h-12 w-12 text-ink-soft/30 mb-6" strokeWidth={1} aria-hidden="true" />
            <h1 className="font-serif font-light text-3xl sm:text-4xl text-ink mb-4">Nothing kept yet.</h1>
            <p className="text-sm text-ink-soft font-light leading-relaxed max-w-sm mb-8">
              When a drape stays on your mind, keep it here.
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center gap-3 text-[0.65rem] tracking-[0.32em] uppercase text-ink border-b border-ink/30 pb-1.5 hover:border-ink transition-colors"
            >
              View collections <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </main>
      </PageLayout>
    );
  }

  const handleMoveToCart = (item: typeof items[number]) => {
    addItem({
      id: item.id,
      productId: item.id.replace(/^product-/, ""),
      name: item.name,
      price: item.price,
      formattedPrice: item.formattedPrice,
      image: item.image,
    });
    removeItem(item.id);
    toast("Moved to bag", {
      description: item.name,
      duration: 3000,
    });
  };

  return (
    <PageLayout>
      <main className="container pt-28 pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[0.65rem] tracking-[0.32em] uppercase text-ink-soft mb-2">Kept · {items.length}</p>
            <h1 className="font-serif font-light text-3xl md:text-4xl text-ink">Wishlist.</h1>
          </div>
          <button
            onClick={clearWishlist}
            className="text-[0.65rem] tracking-[0.2em] uppercase text-ink-soft hover:text-ink transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 sm:gap-x-6 lg:gap-x-10 gap-y-12">
          {items.map((item) => (
             <div key={item.id} className="hop-product-card group">
               <div className="hop-product-card__image relative aspect-[3/4] overflow-hidden rounded-sm bg-jasmine-deep">
                <Link to={`/product/${item.id.replace("product-", "")}`} aria-label={`View ${item.name}`}>
                  <img
                    src={getSupabaseOptimizedUrl(item.image, { width: 480, resize: "cover" })}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = "true";
                        target.src = item.image;
                      }
                    }}
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  />
                </Link>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-jasmine/80 transition-colors hover:bg-jasmine"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <Trash2 className="h-4 w-4 text-ink-soft" />
                  </button>
                </div>
              </div>
               <div className="hop-product-card__meta mt-4 space-y-1">
                {item.collection && (
                  <p className="text-[0.6rem] tracking-[0.38em] uppercase text-ink-soft">{item.collection}</p>
                )}
                <Link
                  to={`/product/${item.id.replace("product-", "")}`}
                  className="font-serif font-light text-lg text-ink leading-tight"
                >
                  {item.name}
                </Link>
                <p className="text-sm font-light text-ink-soft">{item.formattedPrice}</p>
              </div>
              <button
                onClick={() => handleMoveToCart(item)}
                className="mt-4 w-full rounded-full bg-ink py-3.5 text-[0.65rem] tracking-[0.32em] uppercase text-jasmine hover:bg-ink-soft transition-colors duration-300 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                Move to Bag
              </button>
            </div>
          ))}
        </div>
      </main>
    </PageLayout>
  );
}
