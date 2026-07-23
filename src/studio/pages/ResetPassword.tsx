import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { authService } from "../services/authService";
import { Check, X } from "lucide-react";

type PageView = "loading" | "form" | "success" | "error";

interface StrengthRule {
  label: string;
  check: (password: string) => boolean;
}

const strengthRules: StrengthRule[] = [
  { label: "Minimum 8 characters", check: (p) => p.length >= 8 },
  { label: "Uppercase letter", check: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", check: (p) => /[a-z]/.test(p) },
  { label: "Number", check: (p) => /[0-9]/.test(p) },
];

function getStrength(password: string): { score: number; label: string } {
  const score = strengthRules.filter((r) => r.check(password)).length;
  const labels: Record<number, string> = {
    0: "",
    1: "Weak",
    2: "Fair",
    3: "Good",
    4: "Strong",
  };
  return { score, label: labels[score] };
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [view, setView] = useState<PageView>("loading");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setView("form");
      } else {
        setError(
          "This password reset link is invalid or has expired. Please request a new one."
        );
        setView("error");
      }
    });
  }, []);

  const strength = useMemo(() => getStrength(newPassword), [newPassword]);

  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit =
    strength.score >= 4 && passwordsMatch && confirmPassword.length > 0 && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setSubmitting(true);
    try {
      await authService.updatePassword(newPassword);
      setView("success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      if (message.toLowerCase().includes("expired") || message.toLowerCase().includes("invalid")) {
        setError(
          "This password reset link has expired. Please request a new one."
        );
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (view === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-muted-foreground font-sans text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border border-border/50 bg-card">
        <CardHeader className="text-center pb-6">
          <div className="mb-4">
            <span className="font-serif text-3xl font-light text-foreground tracking-[0.15em]">
              HOP
            </span>
          </div>
          <CardTitle className="font-serif text-xl font-light text-foreground">
            {view === "success" ? "Password updated" : "Reset your password"}
          </CardTitle>
          {view === "form" && (
            <CardDescription className="text-muted-foreground font-sans text-sm">
              Enter your new password below.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {view === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="new-password"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              {newPassword.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2">
                    <Progress value={(strength.score / 4) * 100} className="h-1.5" />
                    {strength.label && (
                      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                        {strength.label}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1.5">
                    {strengthRules.map((rule) => {
                      const passed = rule.check(newPassword);
                      return (
                        <li
                          key={rule.label}
                          className={`flex items-center gap-2 text-xs transition-colors ${
                            passed ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {passed ? (
                            <Check className="h-3 w-3 shrink-0" />
                          ) : (
                            <X className="h-3 w-3 shrink-0" />
                          )}
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive">Passwords do not match.</p>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {submitting ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}

          {view === "success" && (
            <div className="space-y-4 text-center">
              <p className="text-sm text-foreground">
                Password updated successfully.
              </p>
              <Button
                type="button"
                onClick={() => navigate("/studio/login", { replace: true })}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Return to Studio Login
              </Button>
            </div>
          )}

          {view === "error" && (
            <div className="space-y-4 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/studio/login", { replace: true })}
                className="w-full"
              >
                Return to Studio Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
