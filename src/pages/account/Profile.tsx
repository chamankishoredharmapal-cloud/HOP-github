import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProfile, upsertProfile } from "@/services/customerProfileService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetadata } from "@/hooks/useMetadata";

export default function Profile() {
  useMetadata({
    title: "Profile — House of Padmavati",
    description: "Manage your House of Padmavati profile.",
    noIndex: true,
  });
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["customer-profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
  });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: () =>
      upsertProfile({ id: user!.id, email: user!.email!, full_name: fullName, phone: phone || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile", user?.id] });
    },
  });

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
        <div className="w-12 h-12 rounded-full bg-teal-deep/10 flex items-center justify-center">
          <User className="w-6 h-6 text-teal-deep" />
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
        <Alert className="mb-4 bg-teal-deep/10 border-teal-deep/20">
          <AlertDescription className="text-sm text-teal-deep">
            Profile updated successfully.
          </AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="space-y-5 max-w-sm"
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
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={user?.email ?? ""} disabled className="text-ink-soft" />
          <p className="text-xs text-ink-soft">
            Email cannot be changed. Contact support if needed.
          </p>
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {mutation.isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
