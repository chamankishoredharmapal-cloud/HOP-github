import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useMetadata } from "@/hooks/useMetadata";

export default function Wishlist() {
  useMetadata({
    title: "Wishlist — House of Padmavati",
    description: "Your saved sarees and favourite weaves.",
  });
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <PageLayout>
        <main className="container pt-28 pb-24">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="h-16 w-16 text-ink-soft/30 mb-6" />
            <h1 className="font-serif text-3xl text-ink mb-3">Your wishlist is empty</h1>
            <p className="text-ink-soft font-light mb-8 max-w-xs">
              Save your favourite sarees and find them here.
            </p>
            <Button asChild>
              <Link to="/collections">
                Explore Collections <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
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
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-ink">Wishlist</h1>
          <button
            onClick={clearWishlist}
            className="text-xs tracking-[0.2em] uppercase text-ink-soft hover:text-teal transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 lg:gap-x-10 gap-y-12">
          {items.map((item) => (
            <div key={item.id} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-jasmine-deep">
                <Link to={`/product/${item.id.replace("product-", "")}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  />
                </Link>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-jasmine/90 backdrop-blur-sm transition-all hover:bg-jasmine hover:shadow-lg"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <Trash2 className="h-4 w-4 text-ink-soft" />
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                {item.collection && (
                  <p className="text-[0.6rem] tracking-[0.38em] uppercase text-teal">{item.collection}</p>
                )}
                <Link
                  to={`/product/${item.id.replace("product-", "")}`}
                  className="font-serif text-lg text-ink leading-tight hover:text-teal transition-colors"
                >
                  {item.name}
                </Link>
                <p className="text-sm font-light text-ink-soft">{item.formattedPrice}</p>
              </div>
              <button
                onClick={() => handleMoveToCart(item)}
                className="mt-4 w-full rounded-full border border-border py-3 text-[0.65rem] tracking-[0.32em] uppercase text-ink-soft hover:bg-teal-deep hover:text-jasmine hover:border-teal-deep transition-all duration-500 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Move to Bag
              </button>
            </div>
          ))}
        </div>
      </main>
    </PageLayout>
  );
}
