import * as React from "react";
import type { User } from "@supabase/supabase-js";
import { customerAuthService } from "@/services/customerAuthService";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    customerAuthService
      .getUser()
      .then(setUser)
      .finally(() => setLoading(false));

    const { data: subscription } = customerAuthService.onAuthChange((user) => {
      setUser(user);
    });

    return () => subscription?.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await customerAuthService.signIn(email, password);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    await customerAuthService.signUp(email, password, fullName);
  };

  const signOut = async () => {
    await customerAuthService.signOut();
  };

  const resetPasswordForEmail = async (email: string) => {
    await customerAuthService.resetPasswordForEmail(email);
  };

  const updatePassword = async (password: string) => {
    await customerAuthService.updatePassword(password);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, resetPasswordForEmail, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- Context pattern: exports Provider + hook for public API
export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
