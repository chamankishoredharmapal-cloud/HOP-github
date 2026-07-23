import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useMetadata } from "@/hooks/useMetadata";

export default function Cart() {
  useMetadata({
    title: "Shopping Bag — House of Padmavati",
    description: "View and edit items in your shopping bag.",
  });
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <PageLayout>
        <main className="container pt-28 pb-24">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="h-16 w-16 text-ink-soft/30 mb-6" />
            <h1 className="font-serif text-3xl text-ink mb-3">Your bag is empty</h1>
            <p className="text-ink-soft font-light mb-8 max-w-xs">
              Discover our collection of hand-woven sarees, each carrying a story.
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

  return (
    <PageLayout>
      <main className="container pt-28 pb-24">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-ink">Shopping Bag</h1>
          <button
            onClick={clearCart}
            className="text-xs tracking-[0.2em] uppercase text-ink-soft hover:text-teal transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 pb-6 border-b border-border/60"
              >
                <div className="w-24 h-32 md:w-28 md:h-36 shrink-0 bg-jasmine-deep rounded overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm md:text-base font-medium text-ink truncate">
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="text-xs text-ink-soft mt-0.5">{item.size}</p>
                      )}
                      <p className="text-sm text-ink mt-1.5">{item.formattedPrice}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-ink-soft/50 hover:text-teal transition-colors shrink-0"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex items-center border border-border rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-ink-soft hover:text-ink transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[2.5rem] text-center text-sm text-ink font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-ink-soft hover:text-ink transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-jasmine-deep/20 p-8 rounded">
              <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-ink-soft">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                  <span className="text-ink font-medium">
                    ₹ {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>Shipping</span>
                  <span className="text-ink">Calculated at checkout</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-sm">
                <span className="text-ink font-medium">Estimated Total</span>
                <span className="text-ink font-serif text-xl">
                  ₹ {totalPrice.toLocaleString()}
                </span>
              </div>

              <Button
                asChild
                className="w-full mt-8 rounded-full bg-teal-deep text-jasmine hover:bg-teal transition-colors duration-500 h-12 text-xs tracking-[0.2em] uppercase"
              >
                <Link to="/checkout">
                  Checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <div className="mt-4 text-center">
                <Link
                  to="/collections"
                  className="text-xs tracking-[0.15em] text-ink-soft hover:text-teal underline underline-offset-4 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
