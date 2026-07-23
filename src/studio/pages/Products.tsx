import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProductsList } from "../hooks/useProducts";
import type { ProductsListResponse, ProductStatus } from "../types/product";

const statusLabels: Record<ProductStatus, string> = {
  draft: "Draft",
  review: "Ready for Review",
  published: "Published",
  archived: "Archived",
};

const statusStyles: Record<ProductStatus, string> = {
  draft: "bg-jasmine-deep text-ink",
  review: "bg-sand/60 text-ink",
  published: "bg-teal-deep/10 text-teal-deep",
  archived: "bg-muted text-muted-foreground",
};

function formatPrice(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(paise / 100);
}

export default function Products() {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useProductsList();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-light text-foreground tracking-tight">
          Products
        </h2>
        <Button
          onClick={() => navigate("/studio/products/new")}
          className="gap-1.5 bg-teal-deep text-jasmine hover:bg-teal transition-colors"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-border/50 bg-card">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-destructive">Failed to load products.</p>
          </CardContent>
        </Card>
      ) : !products || products.length === 0 ? (
        <Card className="border-border/50 bg-card">
          <CardContent className="p-12 text-center space-y-3">
            <p className="text-muted-foreground text-sm">No products yet.</p>
            <Button
              onClick={() => navigate("/studio/products/new")}
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Create your first product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/studio/products/${product.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onClick }: { product: ProductsListResponse; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left w-full p-4 rounded-lg border border-border/40 bg-card hover:border-teal/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-base font-light text-foreground truncate">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{product.sku}</p>
          {product.collection_name && (
            <p className="text-xs text-muted-foreground/60 mt-0.5">{product.collection_name}</p>
          )}
        </div>
        <span className={`shrink-0 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[product.status] || "bg-jasmine-deep text-ink"}`}>
          {statusLabels[product.status] || "Draft"}
        </span>
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <span>{formatPrice(product.selling_price)}</span>
        <span>{product.stock} in stock</span>
      </div>
      {product.featured && (
        <span className="inline-block mt-2 text-[10px] uppercase tracking-[0.12em] text-sand font-medium">
          Featured
        </span>
      )}
    </button>
  );
}
