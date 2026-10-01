import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useMetadata } from "@/hooks/useMetadata";

const UnsubscribePage = () => {
  useMetadata({
    title: "Unsubscribe · House of Padmavati",
    description: "Unsubscribe from the House of Padmavati journal.",
    noIndex: true,
  });

  const [searchParams] = useSearchParams();
  const emailFromParams = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailFromParams);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(!emailFromParams);

  useEffect(() => {
    if (emailFromParams) {
      handleUnsubscribe(emailFromParams);
    }
  }, [emailFromParams]);

  const handleUnsubscribe = async (emailToUnsubscribe: string) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await supabase.functions.invoke("unsubscribe-newsletter", {
        body: { email: emailToUnsubscribe },
      });

      if (response.error || response.data?.success === false) {
        setStatus("error");
        setErrorMessage(response.data?.error ?? response.error?.message ?? "Unsubscription failed. Please try again.");
      } else {
        setStatus("success");
      }
    } catch {
      setStatus("error");
      setErrorMessage("We couldn't process your request right now. Please try again later.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    handleUnsubscribe(email.trim());
  };

  return (
    <PageLayout>
      <main>
        <div className="hop-page__room hop-page__section max-w-md">
          <header className="mb-12 text-center">
            <h1 className="hop-page__title hop-page__title--small">Unsubscribe</h1>
            <p className="text-sm text-ink-soft">Manage your journal subscription</p>
          </header>

          <div className="space-y-6">
            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium text-ink tracking-wider uppercase">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 border-ink/10 bg-white/50 px-4 text-base transition-all duration-300 placeholder:text-ink-soft/40 focus-visible:border-signature-crimson/40 focus-visible:ring-1 focus-visible:ring-signature-crimson/20"
                  />
                </div>
                {status === "error" && (
                  <Alert variant="destructive" className="mb-2">
                    <AlertDescription className="text-sm">{errorMessage}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="hop-cta-primary w-full"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    "Unsubscribe"
                  )}
                </Button>
              </form>
            )}

            {status === "success" && (
              <div className="hop-page__panel p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-ink/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-ink" />
                  </div>
                </div>
                <p className="font-serif text-xl text-ink mb-2">Unsubscribed</p>
                <p className="text-sm text-ink-soft font-light">
                  You have been removed from the House of Padmavati journal.
                  You will no longer receive marketing emails from us.
                </p>
                <p className="mt-4 text-xs text-ink-soft">
                  To resubscribe, visit the footer on our homepage.
                </p>
              </div>
            )}

            {status === "error" && !showForm && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">{errorMessage}</AlertDescription>
                </Alert>
                <p className="text-sm text-ink-soft text-center">
                  You can also unsubscribe by entering your email above.
                </p>
                <Button variant="outline" onClick={() => setShowForm(true)} className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Enter email manually
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default UnsubscribePage;