import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";

const TermsOfService = () => {
  useMetadata({
    title: "Terms · House of Padmavati",
    description: "Terms and conditions for using House of Padmavati and purchasing our products.",
  });

  return (
    <PageLayout>
      <main>
        <div className="max-w-3xl mx-auto px-6 py-20">
          <header className="mb-12 text-center">
            <h1 className="font-serif text-5xl text-ink mb-3">Terms</h1>
            <p className="text-sm text-ink-soft">Last updated · July 2026</p>
          </header>

          <div className="space-y-10 text-ink-soft font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">1. Introduction</h2>
              <p>These Terms & Conditions govern your use of the House of Padmavati website and your purchase of products from House of Padmavati. By accessing this website or placing an order, you agree to be bound by these terms.</p>
              <p className="mt-3">House of Padmavati is a sole proprietorship based in Karnataka, India.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">2. Business Information</h2>
              <div className="text-sm">
                <p><strong className="text-ink">Business Name:</strong> House of Padmavati</p>
                <p><strong className="text-ink">Business Type:</strong> Sole Proprietorship</p>
                <p><strong className="text-ink">Country:</strong> India</p>
                <p><strong className="text-ink">State:</strong> Karnataka</p>
                <p><strong className="text-ink">Address:</strong> Near Kongidiyappa College, Doddaballapur, Bangalore Rural, Karnataka – 561203, India</p>
                <p><strong className="text-ink">Email:</strong> houseofpadmavati@gmail.com</p>
                <p><strong className="text-ink">Phone:</strong> 7975335312</p>
                <p><strong className="text-ink">GST:</strong> Not Registered</p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">3. Definitions</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-ink">"House of Padmavati," "we," "us," "our"</strong> refers to the business named House of Padmavati.</li>
                <li><strong className="text-ink">"Website"</strong> refers to the online store and all its pages.</li>
                <li><strong className="text-ink">"Products"</strong> refers to handwoven sarees, designer sarees, and machine-assisted sarees listed for sale.</li>
                <li><strong className="text-ink">"Customer," "you," "your"</strong> refers to any person who visits the website or purchases products from us.</li>
                <li><strong className="text-ink">"Order"</strong> refers to a request to purchase products placed through the website.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">4. Eligibility</h2>
              <p>By placing an order, you confirm that:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>You are at least 18 years of age.</li>
                <li>You are legally capable of entering into binding contracts.</li>
                <li>You have provided accurate and complete information.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">5. Products</h2>
              <p>House of Padmavati sells sarees. Each product is described to the best of our ability. We make every effort to accurately represent colours, weaves, and materials. However, colours may vary slightly depending on your screen settings and ambient lighting. Handwoven products may have minor variations that are natural characteristics of handmade goods and are not considered defects.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">6. Orders</h2>
              <h3 className="font-serif text-xl text-ink mt-4 mb-2">6.1 Placing an Order</h3>
              <p>You may place an order through the website. Once submitted, you will receive an order confirmation email.</p>
              <h3 className="font-serif text-xl text-ink mt-4 mb-2">6.2 Order Acceptance</h3>
              <p>We reserve the right to accept or decline any order for any reason, including but not limited to stock unavailability, pricing errors, or payment verification issues.</p>
              <h3 className="font-serif text-xl text-ink mt-4 mb-2">6.3 Order Cancellation</h3>
              <p>You may cancel an order any time before dispatch at no charge. No cancellation fee applies. Orders cannot be cancelled after dispatch. To request cancellation, contact us at houseofpadmavati@gmail.com with your order number.</p>
              <h3 className="font-serif text-xl text-ink mt-4 mb-2">6.4 Pricing</h3>
              <p>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices at any time without prior notice. Prices at the time of order placement will apply to that order.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">7. Payments</h2>
              <p>We accept the following payment methods:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>UPI</li>
                <li>Credit Cards</li>
                <li>Debit Cards</li>
                <li>Net Banking</li>
                <li>Wallets</li>
                <li>Razorpay</li>
              </ul>
              <p className="mt-3">Cash on Delivery is not available. Payment is processed at the time of order placement. If payment is not successfully processed, the order will not be fulfilled.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">8. Shipping</h2>
              <p>Shipping and delivery terms are outlined in our <a href="/shipping-policy" className="text-teal hover:text-teal-deep underline underline-offset-4 decoration-1">Shipping Policy</a>, which is incorporated by reference into these terms.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">9. Returns and Refunds</h2>
              <p>Return and refund terms are outlined in our <a href="/returns-policy" className="text-teal hover:text-teal-deep underline underline-offset-4 decoration-1">Returns & Refund Policy</a>, which is incorporated by reference into these terms.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">10. Account Responsibility</h2>
              <p>If you create an account on our website, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised use of your account.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">11. Intellectual Property</h2>
              <p>All intellectual property on this website is owned by House of Padmavati, including but not limited to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Logo and brand identity</li>
                <li>Website design and layout</li>
                <li>Editorial content and journal articles</li>
                <li>Photography and videos</li>
                <li>Graphics and design assets</li>
                <li>Product descriptions and images</li>
              </ul>
              <p className="mt-3">You may not reproduce, distribute, modify, or use any of our intellectual property without prior written permission.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">12. Privacy</h2>
              <p>Our <a href="/privacy-policy" className="text-teal hover:text-teal-deep underline underline-offset-4 decoration-1">Privacy Policy</a> governs how we collect, use, and protect your personal information. By using this website, you agree to the practices described in the Privacy Policy.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">13. Third-Party Services</h2>
              <p>We use third-party service providers for the following functions:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong className="text-ink">Payment Processing:</strong> Razorpay</li>
                <li><strong className="text-ink">Hosting and Database:</strong> Supabase</li>
                <li><strong className="text-ink">Email Services:</strong> Resend</li>
                <li><strong className="text-ink">Deployment:</strong> Vercel</li>
                <li><strong className="text-ink">Analytics:</strong> Google Analytics, Microsoft Clarity, Meta Pixel (when enabled)</li>
              </ul>
              <p className="mt-3">These third parties have their own privacy policies and terms of service. We are not responsible for their practices.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">14. Limitation of Liability</h2>
              <p>To the maximum extent permitted by applicable law, House of Padmavati shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the website or purchase of products. Our total liability for any claim arising from your purchase shall not exceed the amount paid by you for the product in question.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">15. Force Majeure</h2>
              <p>We shall not be liable for any delay or failure in performance caused by events beyond our reasonable control, including but not limited to acts of God, natural disasters, pandemics, government actions, strikes, labour disruptions, transportation interruptions, or supplier failures.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">16. Governing Law and Jurisdiction</h2>
              <p>These Terms & Conditions are governed by the laws of India. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">17. Changes to Terms</h2>
              <p>We reserve the right to update these Terms & Conditions at any time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the website after changes constitutes acceptance of the revised terms.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">18. Contact Information</h2>
              <p>For questions regarding these Terms & Conditions, please contact us.</p>
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

export default TermsOfService;
