import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { upsertCustomerProfile, normalizePhone } from "./customerProfileService";
export { normalizePhone };

export function formatAuthError(error: unknown): string {
  if (!error) return "An unexpected error occurred. Please try again.";
  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();

  if (lower.includes("already registered") || lower.includes("already exists") || lower.includes("unique constraint")) {
    return "An account already exists with this email. Sign in instead.";
  }
  if (lower.includes("invalid login credentials") || lower.includes("invalid_grant") || lower.includes("invalid credentials")) {
    return "That email or password doesn't look right. Please try again.";
  }
  if (lower.includes("email not confirmed") || lower.includes("not confirmed")) {
    return "Please verify your email address to continue.";
  }
  if (lower.includes("password should be at least")) {
    return "Password must be at least 8 characters long.";
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Unable to connect. Please check your internet connection and try again.";
  }
  return msg;
}

export const customerAuthService = {
  async signUp(email: string, password: string, fullName: string, phone?: string) {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone ? normalizePhone(phone) : undefined;

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          phone: cleanPhone,
        },
        emailRedirectTo: `${baseUrl}/account/login?verified=true`,
      },
    });
    if (error) throw new Error(formatAuthError(error));

    if (data.user) {
      try {
        await upsertCustomerProfile(cleanEmail, cleanName, cleanPhone);
      } catch (profileErr) {
        console.warn("Failed to sync customer profile on signup:", profileErr);
      }
    }
    return data;
  },

  async signIn(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    if (error) throw new Error(formatAuthError(error));
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getUser(): Promise<User | null> {
    const session = await this.getSession();
    if (!session) return null;
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  async resetPasswordForEmail(email: string) {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const redirectTo = `${baseUrl}/account/reset-password`;
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo });
    if (error) throw new Error(formatAuthError(error));
    return data;
  },

  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(formatAuthError(error));
    return data;
  },

  onAuthChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  },
};
