import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useMetadata } from "@/hooks/useMetadata";
import { getSupabaseOptimizedUrl } from "@/lib/supabaseImage";

export default function Cart() {
  useMetadata({
    title: "The Bag — House of Padmavati",
    description: "Your bag.",
  });
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <PageLayout>
        <main className="container pt-28 pb-24">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="h-12 w-12 text-ink-soft/30 mb-6" strokeWidth={1} aria-hidden="true" />
            <h1 className="font-serif font-light text-3xl sm:text-4xl text-ink mb-4">Your bag is empty.</h1>
            <p className="text-sm text-ink-soft font-light leading-relaxed max-w-sm mb-8">
              Each drape is singular. When one chooses you, it will wait here.
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

  return (
    <PageLayout>
      <main className="container pt-28 pb-24">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[0.65rem] tracking-[0.32em] uppercase text-ink-soft mb-2">Bag · {totalItems} {totalItems === 1 ? "drape" : "drapes"}</p>
            <h1 className="font-serif font-light text-3xl md:text-4xl text-ink">The Bag.</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-[0.65rem] tracking-[0.2em] uppercase text-ink-soft hover:text-ink transition-colors"
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
                    src={getSupabaseOptimizedUrl(item.image, { width: 160, height: 192, resize: "cover" })}
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
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-serif font-light text-base md:text-lg text-ink truncate">
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="text-xs text-ink-soft mt-0.5 font-light">{item.size}</p>
                      )}
                      <p className="text-sm text-ink mt-1.5 font-light">{item.formattedPrice}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-ink-soft/70 hover:text-ink transition-colors shrink-0"
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
            <div className="border border-ink/15 p-8 rounded-sm">
              <h2 className="text-[0.7rem] tracking-[0.25em] uppercase text-ink font-medium mb-6">
                Summary
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
                className="w-full mt-8 rounded-full bg-ink text-jasmine hover:bg-ink-soft transition-colors duration-300 h-12 text-[0.65rem] tracking-[0.25em] uppercase"
              >
                <Link to="/checkout">
                  Checkout <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>

              <div className="mt-4 text-center">
                <Link
                  to="/collections"
                  className="text-[0.65rem] tracking-[0.2em] uppercase text-ink-soft hover:text-ink border-b border-ink/20 pb-0.5 transition-colors"
                >
                  Return to collections
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border/40 pt-10">
          <h2 className="font-serif text-2xl text-ink mb-4">Return & Replacement Summary</h2>
          <div className="max-w-2xl space-y-3 text-sm text-ink-soft font-light leading-relaxed">
            <p>Return and replacement eligibility depends on the number of sarees in your order:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-ink">1 – 3 sarees per order:</strong> 3 calendar days from delivery</li>
              <li><strong className="text-ink">4 or more sarees per order:</strong> 7 calendar days from delivery</li>
            </ul>
            <p>Eligible reasons: wrong product, transit damage, manufacturing defect, incorrect measurements (stitched orders only).</p>
            <p>Not eligible: change of mind, colour variation, ordered by mistake, personal preference, worn, washed, altered, or damaged items.</p>
            <p>Refunds are processed via bank transfer within 5 – 7 business days after inspection. See the <Link to="/returns-policy" className="text-ink border-b border-ink/30 hover:border-ink transition-colors">Returns & Refund Policy</Link> for full details.</p>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
