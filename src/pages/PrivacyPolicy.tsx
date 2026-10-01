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
            <p className="text-sm text-ink-soft">Last updated · October 2026</p>
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
                <li>Order details</li>
              </ul>
              <h3 className="font-serif text-xl text-ink mt-4 mb-2">2.2 Information Collected Automatically</h3>
              <p>When you visit our website, we automatically collect only the following essential data:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Authentication tokens (stored in your browser via Supabase) to maintain your session</li>
                <li>Cart and wishlist contents (stored locally in your browser)</li>
              </ul>
              <p className="mt-2">We do not use Google Analytics, Microsoft Clarity, Meta Pixel, or any other third-party analytics or tracking services. We do not collect device information, IP addresses, or browsing behaviour for analytics purposes.</p>
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
                <li>Complying with legal obligations</li>
                <li>Preventing fraud and ensuring security</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">4. Third-Party Services We Use</h2>
              <p>We rely on the following third-party services to operate our website:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong className="text-ink">Supabase</strong> – hosting, database, and authentication</li>
                <li><strong className="text-ink">Razorpay</strong> – payment processing</li>
                <li><strong className="text-ink">Resend</strong> – email delivery</li>
                <li><strong className="text-ink">Cloudflare Pages</strong> – website hosting and deployment</li>
                <li><strong className="text-ink">Google Fonts</strong> – typography (fonts loaded from fonts.googleapis.com and fonts.gstatic.com)</li>
              </ul>
              <p className="mt-3">These third-party services have their own privacy policies governing the use of your data. We encourage you to review their policies.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">5. Cookies and Local Storage</h2>
              <p>Our website uses only essential cookies and local storage:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Authentication tokens</strong> (via Supabase) — stored in localStorage to keep you signed in</li>
                <li><strong>Cart contents</strong> — stored in localStorage to persist your bag across sessions</li>
                <li><strong>Wishlist contents</strong> — stored in localStorage to persist your saved items</li>
              </ul>
              <p className="mt-3">We do not use tracking cookies, advertising cookies, or analytics cookies. You can control or clear local storage and cookies through your browser settings. Disabling essential storage may affect the functionality of certain features (such as staying signed in, cart persistence, and wishlist).</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">6. Data Sharing and Disclosure</h2>
              <p>We do not sell your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>With service providers who help us operate our business (payment processing, shipping, email delivery, hosting)</li>
                <li>To comply with legal obligations or respond to lawful requests</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>In connection with a business transfer (merger, acquisition, or sale of assets)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">7. Data Security</h2>
              <p>We implement reasonable security measures to protect your personal information from unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">8. Data Retention</h2>
              <p>We retain your personal information for as long as necessary to fulfil the purposes described in this policy, or as required by applicable law. When no longer needed, your data will be securely deleted or anonymised.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">9. Your Rights</h2>
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong className="text-ink">Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong className="text-ink">Correction:</strong> Request correction of inaccurate or incomplete information (you can update your name and phone in your account profile)</li>
                <li><strong className="text-ink">Deletion:</strong> Request deletion of your account and personal information by contacting us</li>
                <li><strong className="text-ink">Email Change:</strong> Request a change to the email address associated with your account by contacting us</li>
                <li><strong className="text-ink">Opt-Out:</strong> Unsubscribe from marketing communications at any time using the unsubscribe link in emails</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, contact us at houseofpadmavati@gmail.com.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">10. Children's Privacy</h2>
              <p>Our website is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete it.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">11. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-ink mb-3">12. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
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

export default PrivacyPolicy;