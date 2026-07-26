import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMetadata } from "@/hooks/useMetadata";

export default function ForgotPassword() {
  useMetadata({
    title: "Reset Password — House of Padmavati",
    description: "Reset your House of Padmavati account password.",
    noIndex: true,
  });
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPasswordForEmail(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container max-w-lg py-20 md:py-32">
        <div className="mx-auto max-w-sm">
          <div className="mb-10 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-px w-16 bg-teal/40" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-ink tracking-tight">
              Reset password
            </h1>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
              Enter your email to receive a reset link.
            </p>
          </div>

          {sent ? (
            <div className="space-y-6">
              <Alert className="border-teal/20 bg-teal/5">
                <AlertDescription className="text-sm text-teal-deep">
                  A reset link has been sent to <strong className="text-ink">{email}</strong>.
                </AlertDescription>
              </Alert>
              <Button variant="outline" asChild className="h-12 w-full border-ink/10 text-sm tracking-wider uppercase transition-all duration-300 hover:bg-ink/5">
                <Link to="/account/login">Back to sign in</Link>
              </Button>
            </div>
          ) : (
            <>
              {error && (
                <Alert variant="destructive" className="mb-8">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium text-ink tracking-wider uppercase">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 border-ink/10 bg-white/50 px-4 text-base transition-all duration-300 placeholder:text-ink-soft/40 focus-visible:border-teal/40 focus-visible:ring-1 focus-visible:ring-teal/20"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 w-full bg-teal-deep text-sm tracking-widest uppercase text-jasmine transition-all duration-300 hover:bg-teal"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border border-jasmine border-t-transparent" />
                      Sending…
                    </span>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-ink-soft">
                <Link to="/account/login" className="font-medium text-teal-deep transition-colors hover:text-teal">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
