import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Loader2, Mail, AlertCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProfile, upsertCustomerProfile, updateProfile, updateEmail } from "@/services/customerProfileService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetadata } from "@/hooks/useMetadata";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Profile() {
  useMetadata({
    title: "Profile — House of Padmavati",
    description: "Manage your House of Padmavati profile.",
    noIndex: true,
  });
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["customer-profile", user?.email],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
  });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailChangeRequested, setEmailChangeRequested] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: () =>
      upsertCustomerProfile(user!.email!, fullName, phone || null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile", user?.email] });
    },
  });

  const emailChangeMutation = useMutation({
    mutationFn: (email: string) => updateEmail(user!.id, email),
    onSuccess: () => {
      setEmailChangeRequested(false);
      setNewEmail("");
      setEmailError("");
      queryClient.invalidateQueries({ queryKey: ["customer-profile", user?.email] });
    },
    onError: (err) => {
      setEmailError(err instanceof Error ? err.message : "Failed to request email change");
    },
  });

  const handleEmailChangeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    if (!newEmail.trim() || !newEmail.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (newEmail === user?.email) {
      setEmailError("This is already your current email");
      return;
    }
    emailChangeMutation.mutate(newEmail.trim());
  };

  const handleDeleteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError("");
    if (deleteConfirmText !== "DELETE") {
      setDeleteError("Please type DELETE to confirm");
      return;
    }
    // For now, send a contact form request for account deletion
    // A full automated deletion would require an Edge Function with service role
    try {
      const { submitContactForm } = await import("@/services/contactService");
      const result = await submitContactForm({
        firstName: profile?.full_name.split(" ")[0] || "",
        lastName: profile?.full_name.split(" ").slice(1).join(" ") || "",
        email: user?.email || "",
        orderNumber: "",
        message: "REQUEST: Please delete my account and all associated personal data.",
      });
      if (result.success) {
        setDeleteSuccess(true);
        setDeleteDialogOpen(false);
        setDeleteConfirmText("");
      } else {
        setDeleteError(result.error || "Failed to submit deletion request");
      }
    } catch {
      setDeleteError("Failed to submit request. Please email houseofpadmavati@gmail.com directly.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="hop-service-icon">
          <User className="w-6 h-6 text-ink" />
        </div>
        <div>
          <h2 className="font-serif text-xl text-ink">Profile</h2>
          <p className="text-xs text-ink-soft">{user?.email}</p>
        </div>
      </div>

      {mutation.isError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="text-sm">
            {mutation.error instanceof Error ? mutation.error.message : "Update failed"}
          </AlertDescription>
        </Alert>
      )}

      {mutation.isSuccess && (
        <Alert className="mb-4 bg-ink/10 border-ink/20">
          <AlertDescription className="text-sm text-ink">
            Profile updated successfully.
          </AlertDescription>
        </Alert>
      )}

      {emailChangeMutation.isError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="text-sm">
            {emailChangeMutation.error instanceof Error ? emailChangeMutation.error.message : "Email change request failed"}
          </AlertDescription>
        </Alert>
      )}

      {emailChangeMutation.isSuccess && (
        <Alert className="mb-4 bg-ink/10 border-ink/20">
          <AlertDescription className="text-sm text-ink">
            Email change requested. Please check your new email for a confirmation link.
          </AlertDescription>
        </Alert>
      )}

      {deleteSuccess && (
        <Alert className="mb-4 bg-ink/10 border-ink/20">
          <AlertDescription className="text-sm text-ink">
            Account deletion request submitted. We will process your request and confirm via email.
          </AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="hop-form-shell space-y-5 max-w-sm"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="flex items-center gap-3">
            <Input value={user?.email ?? ""} disabled className="text-ink-soft flex-1" />
            {emailChangeRequested ? (
              <form onSubmit={handleEmailChangeRequest} className="flex items-center gap-2">
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="New email"
                  className="w-64"
                  autoFocus
                />
                {emailError && <span className="text-xs text-destructive">{emailError}</span>}
                <Button type="submit" size="sm" disabled={emailChangeMutation.isPending}>
                  {emailChangeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setEmailChangeRequested(false); setNewEmail(""); setEmailError(""); }}>
                  <AlertCircle className="w-4 h-4" />
                </Button>
              </form>
            ) : (
              <Dialog open={emailChangeRequested} onOpenChange={(v) => { if (!v) setEmailChangeRequested(false); }}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setEmailChangeRequested(true)}>
                    <Mail className="w-4 h-4 mr-1" />
                    Change
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Change email address</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEmailChangeRequest} className="hop-form-shell space-y-4">
                    <p className="text-sm text-ink-soft">Enter your new email address. A confirmation link will be sent to the new address.</p>
                    <div className="space-y-2">
                      <Label htmlFor="newEmail">New email</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                        autoComplete="email"
                        placeholder="you@newdomain.com"
                      />
                      {emailError && <p className="text-xs text-destructive">{emailError}</p>}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={() => { setEmailChangeRequested(false); setNewEmail(""); setEmailError(""); }}>Cancel</Button>
                      <Button type="submit" disabled={emailChangeMutation.isPending}>
                        {emailChangeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request change"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <p className="text-xs text-ink-soft">
            Changing your email requires confirmation via a link sent to the new address.
          </p>
        </div>
        <Button type="submit" className="hop-cta-primary" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {mutation.isPending ? "Saving…" : "Save"}
        </Button>
      </form>

      {/* Account Deletion Section */}
      <div className="mt-10 pt-6 border-t border-border/40">
        <h3 className="font-serif text-lg text-ink mb-4">Delete Account</h3>
        <p className="text-sm text-ink-soft mb-4 max-w-sm">
          Request permanent deletion of your account and all associated personal data. This action cannot be undone.
        </p>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Request Account Deletion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                This will permanently delete your account and all personal data. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleDeleteRequest} className="hop-form-shell space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deleteConfirm">Type DELETE to confirm</Label>
                <Input
                  id="deleteConfirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  required
                  placeholder="DELETE"
                />
                {deleteError && <p className="text-xs text-destructive">{deleteError}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeleteConfirmText(""); setDeleteError(""); }}>Cancel</Button>
                <Button type="submit" variant="destructive" disabled={deleteConfirmText !== "DELETE"}>
                  Request Deletion
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}