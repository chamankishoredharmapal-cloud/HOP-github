import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";

const ShippingPolicy = () => {
  usePrerenderReady(true);
  useMetadata({
    title: "Shipping · House of Padmavati",
    description: "Shipping policy for House of Padmavati — delivery timelines, charges, courier partners, and coverage areas.",
  });

  return (
    <PageLayout>
      <main>
        <div className="hop-page__room hop-page__section max-w-3xl">
          <header className="mb-12 text-center">
            <h1 className="hop-page__title hop-page__title--small">Shipping</h1>
            <p className="text-sm text-ink-soft">Last updated · October 2026</p>
          </header>

          <div className="space-y-10 text-ink-soft font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">1. Shipping Coverage</h2>
              <p>We ship to all locations within India. We do not currently offer international shipping.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">2. Shipping Charges</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-ink">Free Shipping:</strong> Your first qualifying successful order ships free.</li>
                <li><strong className="text-ink">Standard Shipping:</strong> A flat ₹99 is charged for all other orders.</li>
              </ul>
              <p className="mt-3">The first-order free delivery benefit is applied automatically at checkout for eligible customers based on normalised phone number and email address. The benefit is consumed by the first qualifying successful order.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">3. Dispatch Timeline</h2>
              <p>Orders are dispatched within 1 business day of order confirmation and payment verification.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">4. Delivery Timelines</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-ink">Domestic (India):</strong> 3 – 5 business days from the date of dispatch.</li>
              </ul>
              <p className="mt-4">Delivery timelines are estimates and are not guaranteed. Delays may occur due to unforeseen circumstances such as weather conditions, courier partner operational issues, or customs processing.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">5. Courier Partners</h2>
              <p>We ship through the following courier partners:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-ink">Domestic:</strong> Delhivery, Blue Dart, DTDC</li>
              </ul>
              <p className="mt-4">The courier partner for your order will be determined based on the delivery location and service availability. Tracking information will be shared with you once the order is dispatched.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">6. Delivery Instructions</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>A signature is required only for high-value orders to ensure secure delivery.</li>
                <li>Deliveries are not made to PO Box addresses.</li>
                <li>All shipments are insured against loss and transit damage.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">7. Order Tracking</h2>
              <p>Once your order is dispatched, you will receive a shipping confirmation email containing a tracking number and a link to track your shipment.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">8. Undeliverable Packages</h2>
              <p>If a package is returned to us due to an incorrect address provided by you, failed delivery attempts, or refusal to accept delivery, we will contact you to arrange re-shipment. Additional shipping charges may apply.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">9. Contact</h2>
              <p>For shipping-related inquiries, please contact us:</p>
              <div className="mt-4 text-sm">
                <p><strong className="text-ink">Email:</strong> houseofpadmavati@gmail.com</p>
                <p><strong className="text-ink">Business:</strong> House of Padmavati, Bangalore, India</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default ShippingPolicy;