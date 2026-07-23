import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";

const PrivacyPolicy = () => {
  useMetadata({
    title: "Privacy · House of Padmavati",
    description: "House of Padmavati respects the privacy of every visitor and customer.",
  });

  return (
    <PageLayout>
      <main>
        <div className="max-w-3xl mx-auto px-6 py-20">
          <header className="mb-12 text-center">
            <p className="text-xs tracking-[0.42em] uppercase text-teal mb-4">The House</p>
            <h1 className="font-serif text-5xl text-ink mb-3">Privacy</h1>
            <p className="text-sm text-ink-soft">Last updated · January 2026</p>
          </header>

          <div className="space-y-10 text-ink-soft font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">Quietly kept</h2>
              <p>
                House of Padmavati respects the privacy of every visitor and customer. This page describes
                the small amount of information we collect, why we collect it, and how we keep it safe.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">What we collect</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Name, email, postal address — for shipping and correspondence.</li>
                <li>Order and payment details — handled by our payment partners, never stored by us.</li>
                <li>Anonymous browsing data — to make the website calmer and faster.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">How we use it</h2>
              <p>
                To fulfil your orders, to write to you when you ask us to, and to gently improve the house.
                We do not sell, rent, or trade your information to anyone.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">Your rights</h2>
              <p>
                You may ask us, at any time, to show you what we hold, correct it, or delete it. Write to
                <span className="text-ink"> privacy@houseofpadmavati.com</span> and we will reply within a week.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">Write to the house</h2>
              <p>
                House of Padmavati · 14 Rue Suffren, White Town, Pondicherry 605001, India
                <br />privacy@houseofpadmavati.com
              </p>
            </section>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default PrivacyPolicy;
