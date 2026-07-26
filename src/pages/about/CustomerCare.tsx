import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import AboutSidebar from "../../components/about/AboutSidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { submitContactForm } from "@/services/contactService";
import { useMetadata } from "@/hooks/useMetadata";

const SareeCare = () => {
  useMetadata({
    title: "Customer Care · House of Padmavati",
    description: "Customer care and correspondence.",
  });
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
            title="Customer Care."
            subtitle="We are here to assist you."
          />

          <ContentSection title="Write to the House">
            <p className="text-ink-soft font-light mb-8 max-w-md">
              We welcome your thoughts and questions. Please leave a message below, and we will respond with care.
            </p>
            {success ? (
              <div className="max-w-2xl p-8 border border-teal-deep/20 rounded-lg bg-teal-deep/5 text-center">
                <CheckCircle className="h-12 w-12 text-teal-deep mx-auto mb-4" />
                <p className="font-serif text-xl text-ink mb-2">Thank you for writing to us.</p>
                <p className="text-sm text-ink-soft font-light">
                  We have received your message and will reply within two business days.
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
                    placeholder="How may we help you."
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
