import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authService } from "../services/authService";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DialogView = "email" | "sent";

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [view, setView] = useState<DialogView>("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.resetPasswordForEmail(email);
      setView("sent");
    } catch {
      setView("sent");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setView("email");
      setEmail("");
      setError("");
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="sm:max-w-md border-border/50 bg-card">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="font-serif text-xl font-light text-foreground tracking-[0.02em]">
            Reset your password
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-sans text-sm">
            {view === "email"
              ? "Enter your email address and we'll send you a reset link."
              : "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."}
          </DialogDescription>
        </DialogHeader>

        {view === "email" ? (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="reset-email"
                className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]"
              >
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@houseofpadmavati.com"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 sm:flex-none"
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
