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
       <main className="hop-page__state">
        <div className="text-center max-w-md">
          <Monogram variant="signature" className="h-20 mx-auto mb-8 opacity-70" />
           <h1 className="hop-page__state-title">404</h1>
           <p className="hop-page__state-copy">
            The page you are looking for does not exist.
          </p>
          <Link
            to="/"
             className="hop-cta-primary mt-8"
          >
            Return
          </Link>
        </div>
      </main>
    </PageLayout>
  );
};

export default NotFound;
