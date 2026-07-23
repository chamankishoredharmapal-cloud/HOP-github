import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";

const TermsOfService = () => {
  useMetadata({
    title: "Terms · House of Padmavati",
    description: "Terms and conditions for House of Padmavati.",
  });

  return (
    <PageLayout>
      <main>
        <div className="max-w-3xl mx-auto px-6 py-20">
          <header className="mb-12 text-center">
            <p className="text-xs tracking-[0.42em] uppercase text-teal mb-4">The House</p>
            <h1 className="font-serif text-5xl text-ink mb-3">Terms</h1>
            <p className="text-sm text-ink-soft">Last updated · January 2026</p>
          </header>

          <div className="space-y-10 text-ink-soft font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">A small house, a simple agreement</h2>
              <p>
                By using the House of Padmavati website you accept the gentle terms below. They are kept
                short because we believe in fewer words.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">Sarees, orders & care</h2>
              <p>
                Each saree is hand-woven and one of one. We work to describe colour and weave honestly, but
                screens vary; the cloth in your hands may be very slightly different from the cloth on screen,
                and that variance is part of the work.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">Returns</h2>
              <p>
                Returns are accepted within 14 days of delivery for sarees in unworn condition. Custom blouses,
                bridal pieces, and engraved keepsake cards are final sale.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">Intellectual property</h2>
              <p>
                Photography, words, and artwork on this site are the property of House of Padmavati. Please
                ask before reproducing them — we usually say yes, slowly.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">Quiet jurisdiction</h2>
              <p>
                These terms are governed by the laws of India. Any disputes will be addressed in good faith
                first, and in the courts of Pondicherry second.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">Write to the house</h2>
              <p>
                House of Padmavati · 14 Rue Suffren, White Town, Pondicherry 605001, India
                <br />care@houseofpadmavati.com
              </p>
            </section>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default TermsOfService;
