import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";

const ShippingPolicy = () => {
  useMetadata({
    title: "Shipping · House of Padmavati",
    description: "Shipping policy for House of Padmavati — delivery timelines, charges, courier partners, and coverage areas.",
  });

  return (
    <PageLayout>
      <main>
        <div className="max-w-3xl mx-auto px-6 py-20">
          <header className="mb-12 text-center">
            <h1 className="font-serif text-5xl text-ink mb-3">Shipping</h1>
            <p className="text-sm text-ink-soft">Last updated · July 2026</p>
          </header>

          <div className="space-y-10 text-ink-soft font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">1. Shipping Coverage</h2>
              <p>We ship to all locations within India and to select international destinations.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">2. Shipping Charges</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-ink">Free Shipping:</strong> Your first order ships free. Additionally, all orders above ₹2,499 qualify for free shipping.</li>
                <li><strong className="text-ink">Standard Shipping:</strong> A flat ₹99 is charged for orders below ₹2,499.</li>
                <li><strong className="text-ink">International Shipping:</strong> Charges vary by destination and are calculated at checkout.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">3. Dispatch Timeline</h2>
              <p>Orders are dispatched within 1 business day of order confirmation and payment verification.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">4. Delivery Timelines</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-ink">Domestic (India):</strong> 3 – 5 business days from the date of dispatch.</li>
                <li><strong className="text-ink">International:</strong> 7 – 8 business days from the date of dispatch, subject to customs clearance in the destination country.</li>
              </ul>
              <p className="mt-4">Delivery timelines are estimates and are not guaranteed. Delays may occur due to unforeseen circumstances such as weather conditions, courier partner operational issues, or customs processing.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">5. Courier Partners</h2>
              <p>We ship through the following courier partners:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-ink">Domestic:</strong> Delhivery, Blue Dart, DTDC</li>
                <li><strong className="text-ink">International:</strong> DHL</li>
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
              <h2 className="font-serif text-2xl text-ink mb-3">7. International Shipping – Customs and Duties</h2>
              <p>For international orders, all customs duties, taxes, and import fees are the responsibility of the customer. House of Padmavati is not responsible for delays caused by customs clearance in the destination country. Please check with your local customs office for applicable charges before placing an order.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">8. Order Tracking</h2>
              <p>Once your order is dispatched, you will receive a shipping confirmation email containing a tracking number and a link to track your shipment.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">9. Undeliverable Packages</h2>
              <p>If a package is returned to us due to an incorrect address provided by you, failed delivery attempts, or refusal to accept delivery, we will contact you to arrange re-shipment. Additional shipping charges may apply.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">10. Contact</h2>
              <p>For shipping-related inquiries, please contact us:</p>
              <div className="mt-4 text-sm">
                <p><strong className="text-ink">Email:</strong> houseofpadmavati@gmail.com</p>
                <p><strong className="text-ink">Phone:</strong> 7975335312</p>
                <p><strong className="text-ink">Address:</strong> Near Kongidiyappa College, Doddaballapur, Bangalore Rural, Karnataka – 561203, India</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default ShippingPolicy;
