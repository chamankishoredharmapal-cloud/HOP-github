import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMetadata } from "@/hooks/useMetadata";

export default function Login() {
  useMetadata({
    title: "Sign In — House of Padmavati",
    description: "Sign in to your House of Padmavati account.",
    noIndex: true,
  });
  const { user, loading: authLoading, signIn } = useAuth();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get("redirect");
  const stateFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;
  const destination = redirectParam || stateFrom || "/account";

  const verified = searchParams.get("verified") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) return null;
  if (user) return <Navigate to={destination} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That email or password doesn't look right. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <main className="hop-auth-shell">
        <div className="hop-auth-card">
          <div className="mb-10 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-px w-16 bg-signature-crimson/40" />
            </div>
            <h1 className="hop-page__title hop-page__title--small">
              Sign In
            </h1>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
              Welcome back to House of Padmavati.
            </p>
          </div>

          {verified && (
            <Alert className="mb-8 border-signature-crimson/20 bg-signature-crimson/5">
              <AlertDescription className="text-sm text-ink">
                Email verified successfully. You can now sign in.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="hop-form-shell space-y-6">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-ink tracking-wider uppercase">
                  Password
                </Label>
                <Link
                  to="/account/forgot-password"
                  className="text-xs text-ink-soft transition-colors hover:text-signature-crimson"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
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
            <Button
              type="submit"
              className="hop-cta-primary w-full min-h-[48px] h-12 text-sm"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border border-jasmine border-t-transparent" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-ink/5" />
            <span className="text-xs text-ink-soft">or</span>
            <div className="h-px flex-1 bg-ink/5" />
          </div>

          <p className="mt-6 text-center text-sm text-ink-soft">
            New to House of Padmavati?{" "}
            <Link
              to={destination !== "/account" ? `/account/signup?redirect=${encodeURIComponent(destination)}` : "/account/signup"}
              className="font-medium text-ink transition-colors hover:text-signature-crimson underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </PageLayout>
  );
}
