import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";

const ReturnsPolicy = () => {
  usePrerenderReady(true);
  useMetadata({
    title: "Returns & Refund · House of Padmavati",
    description: "Returns, refund, and replacement policy for House of Padmavati — eligibility windows by order size, conditions, and process.",
  });

  return (
    <PageLayout>
      <main>
         <div className="hop-page__room hop-page__section max-w-3xl">
          <header className="mb-12 text-center">
             <h1 className="hop-page__title hop-page__title--small">Returns & Refund</h1>
            <p className="text-sm text-ink-soft">Last updated · July 2026</p>
          </header>

          <div className="space-y-10 text-ink-soft font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">1. Return and Replacement Eligibility</h2>
              <p>Return and replacement eligibility depends on the number of sarees in your order. The eligibility window is calculated from the date of delivery.</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-ink-soft/20">
                      <th className="text-left py-2 pr-4 font-serif text-ink">Order Size</th>
                      <th className="text-left py-2 pr-4 font-serif text-ink">Eligibility Window</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-ink-soft/10">
                      <td className="py-2 pr-4">1 – 3 sarees per order</td>
                      <td className="py-2 pr-4">3 calendar days from delivery</td>
                    </tr>
                    <tr className="border-b border-ink-soft/10">
                      <td className="py-2 pr-4">4 or more sarees per order</td>
                      <td className="py-2 pr-4">7 calendar days from delivery</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">Requests submitted after the eligibility window will not be accepted.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">2. Eligible Reasons for Return or Replacement</h2>
              <p>Returns and replacements are accepted only for the following reasons:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Wrong product shipped (different from what was ordered)</li>
                <li>Product damaged in transit</li>
                <li>Manufacturing defect in the product</li>
                <li>Incorrect measurements (applicable only if measurements were taken by House of Padmavati for stitched products)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">3. Not Eligible for Return or Replacement</h2>
              <p>The following situations are not eligible for return or replacement:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Change of mind</li>
                <li>Colour variation (actual product colour may differ from screen representation)</li>
                <li>Ordered by mistake</li>
                <li>Personal preference or liking</li>
                <li>Product has been draped once</li>
                <li>Product has been used, washed, or altered</li>
                <li>Product damaged after delivery</li>
                <li>Missing tags or original packaging</li>
                <li>Clearance or sale items (unless defective)</li>
                <li>Customised or personalised products (unless defective)</li>
                <li>Gift cards</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">4. Inspection Condition</h2>
              <p>You may open the package and inspect the product. Unfolding the saree for inspection is permitted and does not void your return eligibility. However, the product must not be worn, draped, washed, altered, or damaged in any way. All original tags and packaging must be intact for the return to be accepted.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">5. How to Initiate a Return or Replacement</h2>
              <p>To initiate a return or replacement request:</p>
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li>Email us at houseofpadmavati@gmail.com with your order number and reason for return</li>
                <li>Share clear photographs or a video showing the issue (for wrong product, damage, or defect)</li>
                <li>Include your order number in the subject line</li>
              </ol>
              <p className="mt-4">We will review your request and provide instructions for the return process.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">6. Return Shipping</h2>
              <p>Return shipping costs will be covered by House of Padmavati for eligible returns (wrong product, transit damage, manufacturing defect, or incorrect measurements).</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">7. Exchange Policy</h2>
              <p>Exchanges are offered as an alternative to returns at your discretion. The following terms apply:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>One exchange per product is allowed</li>
                <li>Shipping charges for voluntary exchanges are borne by the customer</li>
                <li>Any price difference between the original product and the exchanged product will be payable by you (if higher) or refunded to you (if lower)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">8. Refund Process</h2>
              <p>Once we receive and inspect the returned product, we will process your refund. The following terms apply:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Refunds are processed via bank transfer to your registered bank account (not the original payment method)</li>
                <li>You will need to provide your bank account details (account number, IFSC code) for the refund</li>
                <li>Refunds are processed within 5 – 7 business days after the returned product passes inspection</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">9. Cancellation Policy</h2>
              <p>Orders can be cancelled any time before dispatch. No cancellation fee applies. To cancel an order, email us at houseofpadmavati@gmail.com with your order number. Orders that have already been dispatched cannot be cancelled.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">10. Contact</h2>
              <p>For any questions about returns, refunds, or exchanges, please contact us:</p>
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

export default ReturnsPolicy;

