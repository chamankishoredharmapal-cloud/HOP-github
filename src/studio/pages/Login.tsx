import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordDialog } from "../components/ForgotPasswordDialog";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [forgotOpen, setForgotOpen] = useState(false);

  useEffect(() => {
    authService.getAuthState().then(({ user, isAdmin }) => {
      if (user && isAdmin) {
        navigate("/studio", { replace: true });
        return;
      }

      if (user && !isAdmin) {
        setError("This account does not have Studio access.");
      }

      setLoading(false);
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { user } = await authService.signIn(email, password);
      if (!authService.isAdmin(user)) {
        await authService.signOut();
        setError("This account does not have Studio access.");
        return;
      }
      navigate("/studio", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
            Studio Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@houseofpadmavati.com"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div className="flex items-center justify-end -mt-1">
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-[0.04em]"
              >
                Forgot password?
              </button>
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
      <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} />
    </div>
  );
}
