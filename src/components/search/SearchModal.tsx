import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Package, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchAll, type SearchResult } from "@/services/searchService";

function formatPrice(paise: number): string {
  return `₹ ${(paise / 100).toLocaleString("en-IN")}`;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSearched(false);
      setActiveIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const id = setTimeout(async () => {
      setLoading(true);
      const data = await searchAll(query);
      setResults(data);
      setSearched(true);
      setLoading(false);
      setActiveIndex(-1);
    }, 250);

    return () => clearTimeout(id);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        return;
      }

      if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
        const r = results[activeIndex];
        const path = r.type === "collection" ? `/collections/${r.slug}` : `/product/${r.id}`;
        navigate(path);
        onClose();
      }
    },
    [navigate, results, activeIndex, onClose],
  );

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search products and collections"
    >
      <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl mx-4 bg-background border border-border/60 rounded-lg shadow-2xl animate-fade-in"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
          <Search className="h-5 w-5 text-ink-soft/50 shrink-0" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sarees by name, colour, weave, collection..."
            className="border-0 bg-transparent px-0 text-base text-ink placeholder:text-ink-soft/40 focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Search"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-jasmine-deep transition-colors"
            aria-label="Close search"
          >
            <X className="h-5 w-5 text-ink-soft" />
          </button>
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2" role="listbox">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-teal-deep/30 border-t-teal-deep rounded-full animate-spin" />
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-10 w-10 text-ink-soft/20 mx-auto mb-3" />
              <p className="text-sm text-ink-soft font-light">No results found</p>
              <p className="text-xs text-ink-soft/50 mt-1">
                Try searching by name, colour, weave, or collection.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-0.5">
              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={result.type === "collection" ? `/collections/${result.slug}` : `/product/${result.id}`}
                  onClick={onClose}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={`flex items-center gap-4 p-3 rounded-md transition-colors ${
                    index === activeIndex
                      ? "bg-teal-deep/10 text-ink"
                      : "hover:bg-jasmine-deep text-ink"
                  }`}
                >
                  <div className="w-12 h-16 shrink-0 rounded bg-jasmine-deep overflow-hidden">
                    {result.image ? (
                      <img src={result.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-ink-soft/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{result.name}</p>
                    <p className="text-xs text-ink-soft/70 mt-0.5 capitalize">{result.type}</p>
                  </div>
                  {result.price !== undefined && (
                    <p className="text-sm text-ink-soft font-light shrink-0">
                      {formatPrice(result.price)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}

          {!loading && !searched && !query.trim() && (
            <div className="text-center py-12">
              <Search className="h-10 w-10 text-ink-soft/20 mx-auto mb-3" />
              <p className="text-sm text-ink-soft font-light">
                Search by name, colour, weave, fabric, collection, or SKU.
              </p>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="border-t border-border/60 px-4 py-2.5 text-center">
            <span className="text-xs text-ink-soft/50">
              {results.length} result{results.length !== 1 ? "s" : ""} · Use ↑↓ to navigate, Enter to select
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
