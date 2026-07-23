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
      <div className="container max-w-md py-16 md:py-24">
        <h1 className="font-serif text-2xl md:text-3xl text-ink mb-2">Reset password</h1>
        <p className="text-sm text-ink-soft mb-8">Enter your email and we will send you a reset link</p>

        {sent ? (
          <>
            <Alert className="mb-6 bg-teal-deep/10 border-teal-deep/20">
              <AlertDescription className="text-sm text-teal-deep">
                If an account exists for <strong>{email}</strong>, a reset link has been sent.
              </AlertDescription>
            </Alert>
            <Button variant="outline" asChild className="w-full">
              <Link to="/account/login">Back to sign in</Link>
            </Button>
          </>
        ) : (
          <>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending…" : "Send reset link"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-ink-soft">
              <Link to="/account/login" className="text-teal-deep hover:underline">
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </PageLayout>
  );
}
