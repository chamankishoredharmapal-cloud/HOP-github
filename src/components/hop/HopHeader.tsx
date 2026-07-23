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

const getLinkClassName = (href: string, pathname: string) => {
  const isActive = pathname === href || 
    (href === "/about" && pathname.startsWith("/about")) ||
    (href.includes("/collections") && pathname.includes("/collections"));
  return `hover:text-teal transition-colors duration-500 whitespace-nowrap font-medium ${isActive ? "text-teal-deep" : "text-ink-soft"}`;
};

const HopHeader = ({ transparent = false }: { transparent?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  const closeMenu = useCallback(() => {
    setOpen(false);
    menuTriggerRef.current?.focus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overlay = transparent && !scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        overlay
          ? "bg-transparent border-b border-transparent text-jasmine"
          : "bg-jasmine/85 backdrop-blur-md border-b border-border/60 text-ink"
      }`}
    >
      <div
        className={`text-[0.65rem] sm:text-[0.7rem] tracking-[0.32em] uppercase text-center py-2 font-light transition-colors duration-500 ${
          overlay ? "bg-ink/30 text-jasmine" : "bg-teal-deep text-jasmine"
        }`}
      >
        A house, not a shop · Every saree carries a story
      </div>

      <div className="container flex items-center justify-between h-20 md:h-24 lg:h-28 gap-4 md:gap-6">
        <nav
          className="hidden lg:flex items-center gap-8 xl:gap-10 text-[0.78rem] xl:text-[0.85rem] font-light tracking-[0.18em] uppercase w-1/3"
          role="navigation"
          aria-label="Main navigation"
        >
          {editorial.map((c) => (
            <Link
              key={c.href}
              to={c.href}
              className={getLinkClassName(c.href, pathname)}
                  aria-current={pathname === c.href || (c.href === "/about" && pathname.startsWith("/about")) ? "page" : undefined}
              aria-label={`${c.label} page${pathname === c.href ? " (current)" : ""}`}
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <button
          className="lg:hidden p-2 hover:text-teal transition-colors duration-300"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link
          to="/"
          className="flex-1 lg:flex-none flex flex-col items-center justify-center min-w-0 pl-2 pr-2 md:pl-4 md:pr-4"
          aria-label="House of Padmavati home"
        >
          <Monogram variant="signature" className="h-10 sm:h-12 md:h-14" />
          <span className="mt-1 font-serif text-[0.6rem] sm:text-[0.65rem] md:text-[0.72rem] tracking-[0.28em] sm:tracking-[0.32em] uppercase whitespace-nowrap font-light">
            House of Padmavati
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-[0.78rem] xl:text-[0.85rem] font-light tracking-[0.18em] uppercase w-1/3 justify-end">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="p-2 hover:text-teal transition-colors duration-300"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link
            to="/account"
            aria-label="Account"
            className="p-2 hover:text-teal transition-colors duration-300"
          >
            <User className="w-5 h-5" />
          </Link>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="p-2 hover:text-teal transition-colors duration-300 relative"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal-deep text-jasmine text-[0.55rem] font-medium rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            aria-label="Bag"
            className="p-2 hover:text-teal transition-colors duration-300 flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[0.75rem]">({totalItems})</span>
          </Link>
        </div>

        <Link
          to="/cart"
          className="lg:hidden p-2 hover:text-teal transition-colors duration-300 relative"
          aria-label="Bag"
        >
          <ShoppingBag className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal-deep text-jasmine text-[0.55rem] font-medium rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* Sub-nav: collections — homepage only */}
      {pathname === "/" && !overlay && (
        <div className="hidden lg:block border-t border-border/40">
          <nav className="container flex items-center justify-center gap-10 h-10 text-[0.7rem] font-light text-ink-soft tracking-[0.32em] uppercase">
            {collections.map((c) => (
              <Link key={c.href} to={c.href} className="hover:text-teal-deep transition-colors duration-500">
                {c.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Mobile drawer */}
      {open && (
        <div
          ref={menuRef}
          className="lg:hidden fixed inset-0 z-50 bg-jasmine text-ink animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          onKeyDown={(e) => { if (e.key === "Escape") closeMenu(); }}
        >
          <div className="container flex items-center justify-between h-16 border-b border-border">
            <div className="flex items-center gap-3">
              <Monogram variant="signature" className="h-9" />
              <span className="font-serif text-[0.65rem] tracking-[0.32em] uppercase">House of Padmavati</span>
            </div>
            <button onClick={closeMenu} aria-label="Close menu" ref={menuTriggerRef}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav
            className="container py-8 md:py-12 flex flex-col gap-6"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {pathname === "/" && (
              <div className="space-y-6">
                {collections.map((c) => (
                  <Link
                    key={c.href}
                    to={c.href}
                    onClick={closeMenu}
                    className="block text-2xl md:text-3xl font-serif hover:text-teal transition-colors duration-300"
                    aria-current={pathname === c.href || (c.href.includes("/collections") && pathname.includes("/collections")) ? "page" : undefined}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
            <div className="h-px bg-border/60 my-4" />
            <div className="space-y-4">
              {editorial.map((c) => (
                <Link
                  key={c.href}
                  to={c.href}
                  onClick={closeMenu}
                  className="block text-xl md:text-2xl font-sans font-light hover:text-teal transition-colors duration-300 tracking-wide"
              aria-current={pathname === c.href || (c.href === "/about" && pathname.startsWith("/about")) ? "page" : undefined}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};

export default HopHeader;
