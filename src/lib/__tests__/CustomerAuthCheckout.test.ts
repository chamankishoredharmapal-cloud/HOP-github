import { describe, it, expect, vi, beforeEach } from "vitest";
import { normalizePhone, formatAuthError } from "@/services/customerAuthService";
import { getCurrentCustomerProfile } from "@/services/customerProfileService";
import { saveCustomerAddress } from "@/services/customerAddressService";

// Mock supabase
vi.mock("@/integrations/supabase/client", () => {
  return {
    supabase: {
      auth: {
        getUser: vi.fn(),
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
      },
      rpc: vi.fn(),
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn(),
        maybeSingle: vi.fn(),
        upsert: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
      })),
    },
  };
});

describe("HOP Customer Auth & Contact Data Normalization", () => {
  describe("normalizePhone", () => {
    it("normalizes 10-digit Indian numbers to E.164 (+91)", () => {
      expect(normalizePhone("9876543210")).toBe("+919876543210");
      expect(normalizePhone("98765 43210")).toBe("+919876543210");
      expect(normalizePhone("9876-543-210")).toBe("+919876543210");
    });

    it("normalizes 11-digit numbers with leading 0 to +91", () => {
      expect(normalizePhone("09876543210")).toBe("+919876543210");
    });

    it("normalizes 12-digit numbers starting with 91 to +91", () => {
      expect(normalizePhone("919876543210")).toBe("+919876543210");
    });

    it("preserves already normalized +91 numbers", () => {
      expect(normalizePhone("+919876543210")).toBe("+919876543210");
    });

    it("handles empty or falsy phone inputs gracefully", () => {
      expect(normalizePhone("")).toBe("");
    });
  });

  describe("formatAuthError", () => {
    it("converts user already registered to friendly customer guidance", () => {
      const err = new Error("User already registered");
      expect(formatAuthError(err)).toBe("An account already exists with this email. Sign in instead.");
    });

    it("converts invalid credentials to polite feedback", () => {
      const err = new Error("Invalid login credentials");
      expect(formatAuthError(err)).toBe("That email or password doesn't look right. Please try again.");
    });

    it("converts email confirmation errors to clear next steps", () => {
      const err = new Error("Email not confirmed");
      expect(formatAuthError(err)).toBe("Please verify your email address to continue.");
    });

    it("handles password length validation clearly", () => {
      const err = new Error("Password should be at least 6 characters");
      expect(formatAuthError(err)).toBe("Password must be at least 8 characters long.");
    });

    it("handles network errors with calm guidance", () => {
      const err = new Error("Failed to fetch");
      expect(formatAuthError(err)).toBe("Unable to connect. Please check your internet connection and try again.");
    });
  });
});

describe("HOP Customer Profile & Address Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCurrentCustomerProfile", () => {
    it("hydrates customer profile, addresses, and default address in a single RPC roundtrip", async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const mockCustomer = {
        id: "cust-uuid-1",
        email: "padmini@example.com",
        full_name: "Padmini Devi",
        phone: "+919876543210",
        created_at: "2026-10-04T12:00:00Z",
      };
      const mockAddress = {
        id: "addr-uuid-1",
        customer_id: "cust-uuid-1",
        recipient_name: "Padmini Devi",
        phone: "+919876543210",
        address: "Flat 204, Padmavati Nilayam",
        city: "Bengaluru",
        state: "Karnataka",
        postal_code: "560001",
        country: "India",
        landmark: "Near Temple",
        is_default: true,
        address_type: "HOME",
        created_at: "2026-10-04T12:00:00Z",
      };

      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: {
          success: true,
          customer: mockCustomer,
          addresses: [mockAddress],
          default_address: mockAddress,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getCurrentCustomerProfile();
      expect(result.customer?.email).toBe("padmini@example.com");
      expect(result.addresses).toHaveLength(1);
      expect(result.defaultAddress?.id).toBe("addr-uuid-1");
      expect(result.defaultAddress?.is_default).toBe(true);
    });
  });

  describe("saveCustomerAddress", () => {
    it("calls save_customer_address RPC with normalized phone and defaults", async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: {
          success: true,
          address_id: "addr-new-123",
          is_default: true,
        },
        error: null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await saveCustomerAddress({
        recipient_name: "Chaman Kishore",
        phone: "9876543210",
        address: "House 12, Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        postal_code: "560038",
        country: "India",
        address_type: "HOME",
        is_default: true,
      });

      expect(result.success).toBe(true);
      expect(result.address_id).toBe("addr-new-123");
      expect(result.is_default).toBe(true);
      expect(supabase.rpc).toHaveBeenCalledWith("save_customer_address", expect.objectContaining({
        p_recipient_name: "Chaman Kishore",
        p_phone: "+919876543210",
        p_address: "House 12, Indiranagar",
        p_city: "Bengaluru",
        p_set_as_default: true,
      }));
    });
  });
});
