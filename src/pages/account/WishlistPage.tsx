import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWishlistProductIds, removeFromWishlist } from "@/services/customerWishlistService";
import { useWishlist } from "@/contexts/WishlistContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMetadata } from "@/hooks/useMetadata";

export default function WishlistPage() {
  useMetadata({
    title: "Wishlist — House of Padmavati",
    description: "Your saved items at House of Padmavati.",
    noIndex: true,
  });
  const { user } = useAuth();
  const { removeItem } = useWishlist();
  const queryClient = useQueryClient();

  const { data: wishlistIds, isLoading } = useQuery({
    queryKey: ["customer-wishlist-ids", user?.id],
    queryFn: () => fetchWishlistProductIds(user!.id),
    enabled: !!user,
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromWishlist(user!.id, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-wishlist-ids", user?.id] });
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (!wishlistIds || wishlistIds.length === 0) {
    return (
      <div className="text-center py-16 text-ink-soft">
        <Heart className="w-10 h-10 mx-auto mb-4 opacity-30" />
        <p className="text-sm mb-1">Your wishlist is empty</p>
        <p className="text-xs">Save your favourite pieces here.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-ink mb-6">Wishlist</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {wishlistIds.map((productId) => (
          <div key={productId} className="group relative rounded-lg border border-border overflow-hidden">
            <Link to={`/product/${productId}`}>
              <div className="aspect-square bg-ink/5 flex items-center justify-center">
                <Heart className="w-8 h-8 text-teal-deep/30" />
              </div>
            </Link>
            <button
              onClick={() => {
                removeItem(productId);
                removeMutation.mutate(productId);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-jasmine/80 backdrop-blur-sm text-ink-soft hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
