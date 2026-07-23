import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { syncRoleFromMetadata } from "./permissionService";

function hasAdminRole(user: User | null): boolean {
  const metadata = user?.app_metadata ?? {};
  const role = metadata.role;
  const roles = metadata.roles;

  if (user) {
    syncRoleFromMetadata(metadata as Record<string, unknown>);
  }

  return role === "admin" || (Array.isArray(roles) && roles.includes("admin"));
}

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
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

  async getAuthState(): Promise<{ user: User | null; isAdmin: boolean }> {
    const user = await this.getUser();
    return { user, isAdmin: hasAdminRole(user) };
  },

  isAdmin(user: User | null): boolean {
    return hasAdminRole(user);
  },

  async resetPasswordForEmail(email: string) {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const redirectTo = `${baseUrl}/studio/reset-password`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
    return data;
  },

  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  },

  onAuthChange(callback: (user: User | null, isAdmin: boolean) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      callback(user, hasAdminRole(user));
    });
  },
};
