import HopHeader from "@/components/hop/HopHeader";
import HopFooter from "@/components/hop/HopFooter";

interface PageLayoutProps {
  children: React.ReactNode;
  transparent?: boolean;
}

const PageLayout = ({ children, transparent = false }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-ink focus:text-jasmine focus:text-sm focus:rounded focus:outline-none focus:ring-2 focus:ring-signature-crimson"
      >
        Skip to main content
      </a>
      <HopHeader transparent={transparent} />
      <div id="main-content" className="pt-header">
        {children}
      </div>
      <HopFooter />
    </div>
  );
};

export default PageLayout;
