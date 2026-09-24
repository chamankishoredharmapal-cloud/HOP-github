import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
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
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/account";
  const verified = new URLSearchParams(location.search).get("verified") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) return null;
  if (user) return <Navigate to={from} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
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
              <div className="h-px w-16 bg-signature-crimson/40" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-ink tracking-tight">
              Sign in
            </h1>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
              Welcome back.
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
                  className="text-xs text-ink transition-colors hover:text-signature-crimson"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-12 border-ink/10 bg-white/50 px-4 text-base transition-all duration-300 placeholder:text-ink-soft/40 focus-visible:border-signature-crimson/40 focus-visible:ring-1 focus-visible:ring-signature-crimson/20"
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full bg-ink text-sm tracking-widest uppercase text-jasmine transition-all duration-300 hover:bg-signature-crimson"
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
            No account?{" "}
            <Link to="/account/signup" className="font-medium text-ink transition-colors hover:text-signature-crimson">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
