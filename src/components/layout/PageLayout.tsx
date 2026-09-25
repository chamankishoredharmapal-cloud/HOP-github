import HopHeader from "@/components/hop/HopHeader";
import HopFooter from "@/components/hop/HopFooter";
import "@/components/hop/HopPage.css";

interface PageLayoutProps {
  children: React.ReactNode;
  transparent?: boolean;
  darkHero?: boolean;
}

const PageLayout = ({ children, transparent = false, darkHero = false }: PageLayoutProps) => {
  return (
    <div className="hop-page min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-ink focus:text-jasmine focus:text-sm focus:rounded focus:outline-none focus:ring-2 focus:ring-signature-crimson"
      >
        Skip to main content
      </a>
      <HopHeader transparent={transparent} dark={darkHero} />
      <div id="main-content" className={darkHero ? "" : "pt-header"}>
        {children}
      </div>
      <HopFooter />
    </div>
  );
};

export default PageLayout;
