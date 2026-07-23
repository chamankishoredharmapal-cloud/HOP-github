import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import AboutSidebar from "../../components/about/AboutSidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { submitContactForm } from "@/services/contactService";

const SareeCare = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [message, setMessage] = useState("");
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

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, message: true });
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !email.includes("@") || !message.trim()) return;

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
            title="Saree Care"
            subtitle="On living with a Padmavati — questions, answered slowly."
          />

          <ContentSection title="Quiet correspondence">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h3 className="font-serif text-xl text-ink">Whisper</h3>
                <p className="text-ink-soft font-light">care@houseofpadmavati.com</p>
                <p className="text-sm text-ink-soft/70">A reply within two days, never automated.</p>
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-xl text-ink">WhatsApp</h3>
                <p className="text-ink-soft font-light">+91 99999 99999</p>
                <p className="text-sm text-ink-soft/70">Mon–Sat, 10 am to 6 pm IST.</p>
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-xl text-ink">Atelier visit</h3>
                <Button variant="outline" className="rounded-full">Request appointment</Button>
                <p className="text-sm text-ink-soft/70">Pondicherry, by appointment only.</p>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="Frequently, gently asked">
            <Accordion type="single" collapsible className="space-y-3">
              {[
                { k: "ship", q: "How is my saree wrapped and shipped?", a: "Every Padmavati saree is folded in muslin, wrapped in jasmine paper, and tucked into a hand-finished box. Worldwide shipping is fully insured." },
                { k: "ret", q: "Do you accept returns?", a: "Yes — within 14 days of delivery, in unworn condition. Custom blouses and bridal pieces are final sale." },
                { k: "care", q: "How should I care for my saree?", a: "Dry clean only with a trusted, gentle dry-cleaner. Store folded in muslin, refolded each season to prevent crease wear. Air the pallu rather than ironing it." },
                { k: "alter", q: "Can my blouse be tailored?", a: "Yes — first-fit blouse tailoring is included with every saree. Send us your measurements after purchase." },
                { k: "loom", q: "Where is each saree woven?", a: "Each saree carries a small card naming the weaver, the loom, and the month it was finished." },
              ].map((f) => (
                <AccordionItem key={f.k} value={f.k} className="border border-border rounded-md px-6">
                  <AccordionTrigger className="text-left hover:no-underline font-serif text-lg text-ink">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-ink-soft font-light">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ContentSection>

          <ContentSection title="Write to the house">
            {success ? (
              <div className="max-w-2xl p-8 border border-teal-deep/20 rounded-lg bg-teal-deep/5 text-center">
                <CheckCircle className="h-12 w-12 text-teal-deep mx-auto mb-4" />
                <p className="font-serif text-xl text-ink mb-2">Your whisper has been received.</p>
                <p className="text-sm text-ink-soft font-light">
                  We reply within two days, never automated. A quiet answer for a quiet question.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl" noValidate>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={() => handleBlur("firstName")}
                      className="rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0"
                      placeholder="First name"
                      aria-label="First name"
                      aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && <p className="text-[0.7rem] text-sakura mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={() => handleBlur("lastName")}
                      className="rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0"
                      placeholder="Last name"
                      aria-label="Last name"
                      aria-invalid={!!errors.lastName}
                    />
                    {errors.lastName && <p className="text-[0.7rem] text-sakura mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className="rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0"
                    placeholder="Email"
                    aria-label="Email"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-[0.7rem] text-sakura mt-1">{errors.email}</p>}
                </div>
                <Input
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0"
                  placeholder="Order number (optional)"
                  aria-label="Order number"
                />
                <div>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onBlur={() => handleBlur("message")}
                    className="rounded-md min-h-[140px]"
                    placeholder="A note from you"
                    aria-label="Message"
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <p className="text-[0.7rem] text-sakura mt-1">{errors.message}</p>}
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-sakura">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-teal-deep hover:bg-teal text-jasmine tracking-[0.3em] uppercase text-xs px-8 py-6"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-3.5 w-3.5" />
                      Send a whisper
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
