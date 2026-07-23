import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { authService } from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .getAuthState()
      .then(({ user, isAdmin }) => {
        setUser(user);
        setIsAdmin(isAdmin);
      })
      .finally(() => setLoading(false));

    const { data: subscription } = authService.onAuthChange((user, isAdmin) => {
      setUser(user);
      setIsAdmin(isAdmin);
    });

    return () => subscription?.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
  };

  const signOut = async () => {
    await authService.signOut();
  };

  return { user, isAdmin, loading, signIn, signOut };
}
