import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMetadata } from "@/hooks/useMetadata";

export default function ResetPassword() {
  useMetadata({
    title: "Set New Password — House of Padmavati",
    description: "Set a new password for your House of Padmavati account.",
    noIndex: true,
  });
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate("/account/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password");
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
              Set new password
            </h1>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
              Enter a new password.
            </p>
          </div>

          {success ? (
            <Alert className="border-teal/20 bg-teal/5">
              <AlertDescription className="text-sm text-teal-deep">
                Password updated successfully. Redirecting to sign in…
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {error && (
                <Alert variant="destructive" className="mb-8">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-medium text-ink tracking-wider uppercase">
                    New password
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
                <Button
                  type="submit"
                  className="h-12 w-full bg-teal-deep text-sm tracking-widest uppercase text-jasmine transition-all duration-300 hover:bg-teal"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border border-jasmine border-t-transparent" />
                      Updating…
                    </span>
                  ) : (
                    "Update password"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
