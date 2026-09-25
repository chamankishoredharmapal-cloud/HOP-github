import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import PageLayout from "@/components/layout/PageLayout";
import { useMetadata } from "@/hooks/useMetadata";

const PrivacyPolicy = () => {
  usePrerenderReady(true);
  useMetadata({
    title: "Privacy · House of Padmavati",
    description: "Privacy policy for House of Padmavati — how we collect, use, and protect your personal information.",
  });

  return (
    <PageLayout>
      <main>
         <div className="hop-page__room hop-page__section max-w-3xl">
          <header className="mb-12 text-center">
             <h1 className="hop-page__title hop-page__title--small">Privacy</h1>
            <p className="text-sm text-ink-soft">Last updated · July 2026</p>
          </header>

          <div className="space-y-10 text-ink-soft font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">1. Introduction</h2>
              <p>House of Padmavati respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website or make a purchase.</p>
              <p className="mt-3">By using our website, you agree to the collection and use of information as described in this policy.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">2. Information We Collect</h2>
              <h3 className="font-serif text-xl text-ink mt-4 mb-2">2.1 Personal Information You Provide</h3>
              <p>When you place an order or create an account, we may collect:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Shipping address</li>
                <li>Billing address</li>
                <li>Order details</li>
              </ul>
              <h3 className="font-serif text-xl text-ink mt-4 mb-2">2.2 Information Collected Automatically</h3>
              <p>When you visit our website, we may automatically collect:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Device information (browser type, operating system, IP address)</li>
                <li>Usage data (pages visited, time spent, referring URLs)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">3. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Processing and fulfilling orders</li>
                <li>Communicating with you about your order</li>
                <li>Providing customer support</li>
                <li>Sending order updates and shipping confirmations</li>
                <li>Improving our website and services</li>
                <li>Analysing website usage and trends</li>
                <li>Complying with legal obligations</li>
                <li>Preventing fraud and ensuring security</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">4. Analytics and Tracking</h2>
              <p>We use the following analytics and tracking services:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong className="text-ink">Google Analytics</strong> – to understand website traffic and user behaviour</li>
                <li><strong className="text-ink">Microsoft Clarity</strong> – to understand user interactions and improve user experience</li>
                <li><strong className="text-ink">Meta Pixel</strong> – for advertising and conversion tracking (when enabled)</li>
              </ul>
              <p className="mt-3">These services may use cookies and similar technologies to collect information about your browsing activities.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">5. Third-Party Services We Use</h2>
              <p>We rely on the following third-party services to operate our website:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong className="text-ink">Supabase</strong> – hosting, database, and authentication</li>
                <li><strong className="text-ink">Razorpay</strong> – payment processing</li>
                <li><strong className="text-ink">Resend</strong> – email delivery</li>
                <li><strong className="text-ink">Vercel</strong> – website hosting and deployment</li>
              </ul>
              <p className="mt-3">These third-party services have their own privacy policies governing the use of your data. We encourage you to review their policies.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">6. Cookies</h2>
              <p>Our website uses cookies and similar tracking technologies. Cookies are small text files stored on your device that help us improve your browsing experience. You can control cookie preferences through your browser settings. Disabling cookies may affect the functionality of certain features on our website.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">7. Data Sharing and Disclosure</h2>
              <p>We do not sell your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>With service providers who help us operate our business (payment processing, shipping, email delivery, analytics)</li>
                <li>To comply with legal obligations or respond to lawful requests</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>In connection with a business transfer (merger, acquisition, or sale of assets)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">8. Data Security</h2>
              <p>We implement reasonable security measures to protect your personal information from unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">9. Data Retention</h2>
              <p>We retain your personal information for as long as necessary to fulfil the purposes described in this policy, or as required by applicable law. When no longer needed, your data will be securely deleted or anonymised.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">10. Your Rights</h2>
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong className="text-ink">Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong className="text-ink">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong className="text-ink">Deletion:</strong> Request deletion of your account and personal information</li>
                <li><strong className="text-ink">Email Change:</strong> Request a change to the email address associated with your account</li>
                <li><strong className="text-ink">Opt-Out:</strong> Opt out of marketing communications at any time</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, contact us at houseofpadmavati@gmail.com.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">11. Children's Privacy</h2>
              <p>Our website is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete it.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">12. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">13. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
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

export default PrivacyPolicy;

