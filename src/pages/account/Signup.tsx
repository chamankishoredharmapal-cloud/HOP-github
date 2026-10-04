import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
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
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get("redirect");
  const stateFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;
  const destination = redirectParam || stateFrom || "/account";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);

  if (authLoading) return null;
  if (user) return <Navigate to={destination} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, fullName, phone);
      // If user was instantly authenticated (session created), navigate to destination
      if (destination) {
        navigate(destination, { replace: true });
        return;
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageLayout>
        <main className="hop-auth-shell">
          <div className="hop-auth-card text-center">
            <div className="mb-6 flex justify-center">
              <div className="h-px w-16 bg-signature-crimson/40" />
            </div>
            <h1 className="hop-page__title hop-page__title--small">
              Check your email
            </h1>
            <p className="mt-4 text-sm text-ink-soft leading-relaxed">
              We have sent a confirmation link to <strong className="text-ink">{email}</strong>.
              Please check your inbox to verify your email and activate your account.
            </p>
            <Button
              variant="outline"
              asChild
              className="mt-8 h-12 border-ink/10 px-8 text-xs tracking-wider uppercase transition-all duration-300 hover:bg-ink/5"
            >
              <Link to={destination !== "/account" ? `/account/login?redirect=${encodeURIComponent(destination)}` : "/account/login"}>
                Continue to sign in
              </Link>
            </Button>
          </div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="hop-auth-shell">
        <div className="hop-auth-card">
          <div className="mb-10 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-px w-16 bg-signature-crimson/40" />
            </div>
            <h1 className="hop-page__title hop-page__title--small">
              Create account
            </h1>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
              Join House of Padmavati for seamless orders and saved addresses.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="hop-form-shell space-y-6">
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
                placeholder="Padmini Devi"
                className="h-12 border-ink/10 bg-white/50 px-4 text-base transition-all duration-300 placeholder:text-ink-soft/40 focus-visible:border-signature-crimson/40 focus-visible:ring-1 focus-visible:ring-signature-crimson/20"
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
                inputMode="email"
                placeholder="you@example.com"
                className="h-12 border-ink/10 bg-white/50 px-4 text-base transition-all duration-300 placeholder:text-ink-soft/40 focus-visible:border-signature-crimson/40 focus-visible:ring-1 focus-visible:ring-signature-crimson/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-medium text-ink tracking-wider uppercase">
                Phone number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                inputMode="tel"
                placeholder="98765 43210"
                className="h-12 border-ink/10 bg-white/50 px-4 text-base transition-all duration-300 placeholder:text-ink-soft/40 focus-visible:border-signature-crimson/40 focus-visible:ring-1 focus-visible:ring-signature-crimson/20"
              />
              <p className="text-[0.7rem] text-ink-soft font-light">Used exclusively for delivery updates and courier dispatch.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-ink tracking-wider uppercase">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  className="h-12 border-ink/10 bg-white/50 px-4 pr-12 text-base transition-all duration-300 placeholder:text-ink-soft/40 focus-visible:border-signature-crimson/40 focus-visible:ring-1 focus-visible:ring-signature-crimson/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-ink-soft hover:text-ink transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                  className="mt-0.5 w-4 h-4 rounded border-border accent-ink shrink-0"
                />
                <span className="text-xs text-ink-soft font-light leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms-of-service" className="text-rasa-mulberry hover:text-ink underline underline-offset-4 decoration-1">Terms & Conditions</Link>,{" "}
                  <Link to="/privacy-policy" className="text-rasa-mulberry hover:text-ink underline underline-offset-4 decoration-1">Privacy Policy</Link>,{" "}
                  <Link to="/shipping-policy" className="text-rasa-mulberry hover:text-ink underline underline-offset-4 decoration-1">Shipping Policy</Link>, and{" "}
                  <Link to="/returns-policy" className="text-rasa-mulberry hover:text-ink underline underline-offset-4 decoration-1">Returns & Refund Policy</Link>.
                </span>
              </label>
            </div>
            <Button
              type="submit"
              className="hop-cta-primary w-full min-h-[48px] h-12 text-sm"
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
            <Link
              to={destination !== "/account" ? `/account/login?redirect=${encodeURIComponent(destination)}` : "/account/login"}
              className="font-medium text-ink transition-colors hover:text-signature-crimson underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </PageLayout>
  );
}
