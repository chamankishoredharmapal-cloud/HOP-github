import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import Monogram from "./Monogram";
import { SearchModal } from "@/components/search/SearchModal";

const collections = [
  { label: "Kalyani", href: "/collections/kalyani" },
  { label: "Viara", href: "/collections/viara" },
  { label: "Arya", href: "/collections/megham" },
  { label: "Padma", href: "/collections/oosi-kattam" },
  { label: "Spandana", href: "/collections/designer-wear" },
];

const editorial = [
  { label: "Collections", href: "/collections" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
];

const getLinkClassName = () => {
  return `hover:text-[#8B1E2D] transition-colors duration-500 whitespace-nowrap font-medium text-[#1F1F1F]`;
};

const HopHeader = ({ transparent = false }: { transparent?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      if (y <= 4) {
        setHidden(false);
      } else if (y > lastScrollY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    menuTriggerRef.current?.focus();
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 text-[#1F1F1F] transition-transform duration-300 ease-in-out ${hidden && !open ? "-translate-y-full" : "translate-y-0"} ${transparent && !scrolled && !open ? "bg-transparent" : "bg-[#FBF5EB]/95 backdrop-blur-sm shadow-[0_1px_0_rgba(31,31,31,0.08)]"}`}>
      {/* Top banner removed due to brand guideline violation (No aggressive sales tactics/mass-market tropes) */}
      <div className="container flex items-center justify-between h-[72px] md:h-[80px] gap-4 md:gap-6">
        <nav
          className="hidden lg:flex items-center gap-8 xl:gap-10 text-[0.78rem] xl:text-[0.85rem] font-light tracking-[0.18em] uppercase w-1/3"
          role="navigation"
          aria-label="Main navigation"
        >
          {editorial.map((c) => (
            <Link
              key={c.href}
              to={c.href}
              className={getLinkClassName()}
              aria-current={pathname === c.href || (c.href === "/about" && pathname.startsWith("/about")) ? "page" : undefined}
              aria-label={`${c.label} page${pathname === c.href ? " (current)" : ""}`}
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <button
          className="lg:hidden p-2 text-[#1F1F1F] hover:text-[#8B1E2D] transition-colors duration-300"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <Link
          to="/"
          className="flex-1 lg:flex-none flex flex-col items-center justify-center min-w-0"
          aria-label="House of Padmavati home"
        >
          <Monogram variant="signature" className="h-8 md:h-10" />
          <span className="mt-1 font-serif text-[0.6rem] sm:text-[0.65rem] md:text-[0.72rem] tracking-[0.28em] sm:tracking-[0.32em] uppercase whitespace-nowrap text-[#8B1E2D]">
            HOUSE OF PADMAVATI
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-[#1F1F1F] w-1/3 justify-end">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-[#8B1E2D] transition-colors duration-300"
          >
            <Search className="w-4 h-4 xl:w-5 xl:h-5" strokeWidth={1.5} />
          </button>
          <Link
            to="/account"
            aria-label="Account"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-[#8B1E2D] transition-colors duration-300"
          >
            <User className="w-4 h-4 xl:w-5 xl:h-5" strokeWidth={1.5} />
          </Link>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-[#8B1E2D] transition-colors duration-300 relative"
          >
            <Heart className="w-4 h-4 xl:w-5 xl:h-5" strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#8B1E2D] text-[#FBF5EB] text-[0.55rem] font-medium rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            aria-label="Bag"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-[#8B1E2D] transition-colors duration-300 gap-2"
          >
            <ShoppingBag className="w-4 h-4 xl:w-5 xl:h-5" strokeWidth={1.5} />
            <span className="text-[0.75rem] font-light tnum">({totalItems})</span>
          </Link>
        </div>

        <Link
          to="/cart"
          className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-[#1F1F1F] hover:text-[#8B1E2D] transition-colors duration-300 relative"
          aria-label="Bag"
        >
          <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#8B1E2D] text-[#FBF5EB] text-[0.55rem] font-medium rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          ref={menuRef}
          className="lg:hidden fixed inset-0 z-50 bg-[#FBF5EB] text-[#1F1F1F] animate-fade-in overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          onKeyDown={(e) => { if (e.key === "Escape") closeMenu(); }}
        >
          <div className="container flex items-center justify-between h-16 border-b border-[#87817A]/15">
            <div className="flex items-center gap-3">
              <Monogram variant="signature" className="h-9" />
              <span className="font-serif text-[0.65rem] tracking-[0.32em] uppercase text-[#8B1E2D]">HOUSE OF PADMAVATI</span>
            </div>
            <button onClick={closeMenu} aria-label="Close menu" ref={menuTriggerRef}>
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
          <nav
            className="container py-8 md:py-12 flex flex-col gap-10"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="space-y-4">
              <p className="text-[0.6rem] tracking-[0.32em] uppercase text-[#1F1F1F]/50">The House</p>
              {editorial.map((c) => (
                <Link
                  key={c.href}
                  to={c.href}
                  onClick={closeMenu}
                  className="block text-xl md:text-2xl font-sans font-light hover:text-[#8B1E2D] transition-colors duration-300 tracking-wide"
                  aria-current={pathname === c.href || (c.href === "/about" && pathname.startsWith("/about")) ? "page" : undefined}
                >
                  {c.label}
                </Link>
              ))}
            </div>
            <div className="space-y-4">
              <p className="text-[0.6rem] tracking-[0.32em] uppercase text-[#1F1F1F]/50">Collections</p>
              {collections.map((c) => (
                <Link
                  key={c.href}
                  to={c.href}
                  onClick={closeMenu}
                  className="block text-xl md:text-2xl font-serif font-light hover:text-[#8B1E2D] transition-colors duration-300"
                >
                  {c.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-[#87817A]/15">
              <button
                onClick={() => { closeMenu(); setSearchOpen(true); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-[0.2em] uppercase hover:text-[#8B1E2D] transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" strokeWidth={1.5} /> Search
              </button>
              <Link
                to="/account"
                onClick={closeMenu}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-[0.2em] uppercase hover:text-[#8B1E2D] transition-colors"
                aria-label="Account"
              >
                <User className="w-4 h-4" strokeWidth={1.5} /> Account
              </Link>
              <Link
                to="/wishlist"
                onClick={closeMenu}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-[0.2em] uppercase hover:text-[#8B1E2D] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" strokeWidth={1.5} /> Saved
              </Link>
            </div>
          </nav>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      {!transparent && (
        <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-px bg-[#87817A]/15" />
      )}
    </header>
  );
};

export default HopHeader;
