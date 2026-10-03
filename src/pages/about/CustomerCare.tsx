import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import AboutSidebar from "../../components/about/AboutSidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { submitContactForm } from "@/services/contactService";
import { useMetadata } from "@/hooks/useMetadata";

const SareeCare = () => {
  usePrerenderReady(true);
  useMetadata({
    title: "Customer Care · House of Padmavati",
    description: "Customer care and correspondence.",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors: Record<string, string> = {};
  if (touched.firstName && !firstName.trim()) errors.firstName = "First name is required";
  if (touched.lastName && !lastName.trim()) errors.lastName = "Last name is required";
  if (touched.email) {
    if (!email.trim()) errors.email = "Email is required";
    else if (!email.includes("@")) errors.email = "Enter a valid email";
  }
  if (touched.message && !message.trim()) errors.message = "Message is required";

  usePrerenderReady(true);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, message: true, consent: true });
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !email.includes("@") || !message.trim() || !consent) return;

    setLoading(true);
    setError("");
    const result = await submitContactForm({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      orderNumber: orderNumber.trim(),
      message: message.trim(),
    });
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error ?? "Something went wrong.");
    }
  };

  return (
    <PageLayout>
      <div className="flex">
        <div className="hidden lg:block"><AboutSidebar /></div>

        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
          <PageHeader
            title="Customer Care."
            subtitle="We are here to assist you."
          />

          <ContentSection title="Write to the House">
            <p className="text-ink-soft font-light mb-8 max-w-md">
              We welcome your thoughts and questions. Please leave a message below, and we will respond with care.
            </p>
            {success ? (
               <div className="hop-page__panel max-w-2xl p-8 text-center">
                <CheckCircle className="h-12 w-12 text-ink mx-auto mb-4" />
                <p className="font-serif text-xl text-ink mb-2">Thank you for writing to us.</p>
                <p className="text-sm text-ink-soft font-light">
                  We have received your message and will reply within two business days.
                </p>
              </div>
            ) : (
               <form onSubmit={handleSubmit} className="hop-form-shell space-y-6 max-w-2xl" noValidate>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="care-first-name" className="hop-form-label mb-1.5">First name</Label>
                    <Input
                      id="care-first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={() => handleBlur("firstName")}
                       className="hop-form-control"
                      placeholder="First name"
                      autoComplete="given-name"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? "care-first-name-error" : undefined}
                    />
                    {errors.firstName && <p id="care-first-name-error" role="alert" className="text-[0.7rem] text-destructive mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="care-last-name" className="hop-form-label mb-1.5">Last name</Label>
                    <Input
                      id="care-last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={() => handleBlur("lastName")}
                       className="hop-form-control"
                      placeholder="Last name"
                      autoComplete="family-name"
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? "care-last-name-error" : undefined}
                    />
                    {errors.lastName && <p id="care-last-name-error" role="alert" className="text-[0.7rem] text-destructive mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="care-email" className="hop-form-label mb-1.5">Email</Label>
                  <Input
                    id="care-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className="rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0 min-h-[44px] text-base"
                    placeholder="Email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "care-email-error" : undefined}
                  />
                  {errors.email && <p id="care-email-error" role="alert" className="text-[0.7rem] text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="care-order" className="hop-form-label mb-1.5">Order number <span className="font-light">(optional)</span></Label>
                  <Input
                    id="care-order"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0 min-h-[44px] text-base"
                    placeholder="Order number (optional)"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <Label htmlFor="care-message" className="hop-form-label mb-1.5">Message</Label>
                  <Textarea
                    id="care-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onBlur={() => handleBlur("message")}
                     className="hop-form-control min-h-[140px] text-base"
                    placeholder="How may we help you."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "care-message-error" : undefined}
                  />
                  {errors.message && <p id="care-message-error" role="alert" className="text-[0.7rem] text-destructive mt-1">{errors.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                      className="mt-0.5 w-5 h-5 rounded border-border accent-ink shrink-0"
                    />
                    <span className="text-xs text-ink-soft font-light leading-relaxed">
                      I agree to the{" "}
                      <a href="/privacy-policy" className="text-rasa-mulberry hover:text-ink underline underline-offset-4 decoration-1">Privacy Policy</a>
                      {" and consent to my message being stored for customer support purposes."}
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive" role="alert">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                   className="hop-cta-primary"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-3.5 w-3.5" />
                      Send message
                    </span>
                  )}
                </Button>
              </form>
            )}
          </ContentSection>
        </main>
      </div>
    </PageLayout>
  );
};

export default SareeCare;