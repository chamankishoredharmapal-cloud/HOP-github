import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Monogram from "@/components/hop/Monogram";
import { useMetadata } from "@/hooks/useMetadata";

const NotFound = () => {
  useMetadata({
    title: "404 — House of Padmavati",
    description: "The page you are looking for does not exist.",
    noIndex: true,
  });

  return (
    <PageLayout>
      <main className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="text-center max-w-md">
          <Monogram variant="signature" className="h-20 mx-auto mb-8 opacity-70" />
          <h1 className="font-serif text-5xl md:text-6xl text-ink mb-6">404</h1>
          <p className="text-ink-soft font-light leading-relaxed mb-10">
            The page you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-teal-deep text-jasmine px-7 py-3.5 text-[0.7rem] tracking-[0.32em] uppercase rounded-full hover:bg-teal transition-colors"
          >
            Return
          </Link>
        </div>
      </main>
    </PageLayout>
  );
};

export default NotFound;
