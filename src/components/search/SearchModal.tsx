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
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQuery("");
    setResults([]);
    setSearched(false);
    setActiveIndex(-1);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      window.clearTimeout(focusTimer);
      previouslyFocusedRef.current?.focus();
    };
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled])"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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
         ref={dialogRef}
         className="hop-search-dialog relative mx-4 animate-fade-in"
        onKeyDown={handleKeyDown}
      >
        <div className="hop-search-dialog__input-row">
          <Search className="h-5 w-5 text-ink-soft/70 shrink-0" />
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

        <div ref={listRef} className="hop-search-dialog__results" role="listbox">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-10 w-10 text-ink-soft/20 mx-auto mb-3" />
              <p className="text-sm text-ink-soft font-light">No results found</p>
              <p className="text-xs text-ink-soft mt-1">
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
                   className={`hop-search-dialog__result flex items-center gap-4 p-3 transition-colors ${
                    index === activeIndex
                      ? "bg-ink/10 text-ink"
                      : "hover:bg-jasmine-deep text-ink"
                  }`}
                >
                   <div className="hop-search-dialog__result-image">
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
                     <p className="hop-search-dialog__result-type">{result.type}</p>
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
             <div className="hop-search-dialog__footer">
              <span className="text-xs text-ink-soft">
              {results.length} result{results.length !== 1 ? "s" : ""} · Use ↑↓ to navigate, Enter to select
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
