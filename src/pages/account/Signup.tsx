import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMetadata } from "@/hooks/useMetadata";

export default function Signup() {
  useMetadata({
    title: "Create Account — House of Padmavati",
    description: "Create your House of Padmavati account.",
    noIndex: true,
  });
  const { user, loading: authLoading, signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);

  if (authLoading) return null;
  if (user) return <Navigate to="/account" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageLayout>
        <div className="container max-w-lg py-20 md:py-32">
          <div className="mx-auto max-w-sm text-center">
            <div className="mb-6 flex justify-center">
              <div className="h-px w-16 bg-teal/40" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-ink tracking-tight">
              Check your email
            </h1>
            <p className="mt-4 text-sm text-ink-soft leading-relaxed">
              We have sent a verification link to <strong className="text-ink">{email}</strong>.
              Please check your inbox and verify your email to complete signup.
            </p>
            <Button variant="outline" asChild className="mt-8 h-12 border-ink/10 px-8 text-sm tracking-wider uppercase transition-all duration-300 hover:bg-ink/5">
              <Link to="/account/login">Back to sign in</Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container max-w-lg py-20 md:py-32">
        <div className="mx-auto max-w-sm">
          <div className="mb-10 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-px w-16 bg-teal/40" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-ink tracking-tight">
              Create account
            </h1>

          </div>

          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-xs font-medium text-ink tracking-wider uppercase">
                Full name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Your full name"
                className="h-12 border-ink/10 bg-white/50 px-4 text-base transition-all duration-300 placeholder:text-ink-soft/40 focus-visible:border-teal/40 focus-visible:ring-1 focus-visible:ring-teal/20"
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-ink tracking-wider uppercase">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="At least 8 characters"
                minLength={8}
                className="h-12 border-ink/10 bg-white/50 px-4 text-base transition-all duration-300 placeholder:text-ink-soft/40 focus-visible:border-teal/40 focus-visible:ring-1 focus-visible:ring-teal/20"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                  className="mt-0.5 w-4 h-4 rounded border-border accent-teal-deep shrink-0"
                />
                <span className="text-xs text-ink-soft font-light leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-teal hover:text-teal-deep underline underline-offset-4 decoration-1">Terms & Conditions</Link>,{" "}
                  <Link to="/privacy-policy" className="text-teal hover:text-teal-deep underline underline-offset-4 decoration-1">Privacy Policy</Link>,{" "}
                  <Link to="/shipping-policy" className="text-teal hover:text-teal-deep underline underline-offset-4 decoration-1">Shipping Policy</Link>, and{" "}
                  <Link to="/returns-policy" className="text-teal hover:text-teal-deep underline underline-offset-4 decoration-1">Returns & Refund Policy</Link>.
                </span>
              </label>
            </div>
            <Button
              type="submit"
              className="h-12 w-full bg-teal-deep text-sm tracking-widest uppercase text-jasmine transition-all duration-300 hover:bg-teal"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border border-jasmine border-t-transparent" />
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-ink/5" />
            <span className="text-xs text-ink-soft">or</span>
            <div className="h-px flex-1 bg-ink/5" />
          </div>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Already have an account?{" "}
            <Link to="/account/login" className="font-medium text-teal-deep transition-colors hover:text-teal">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
