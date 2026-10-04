import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Shield, Loader2, AlertTriangle, MapPin, Check, Plus, Eye, EyeOff, User as UserIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCart } from "@/contexts/CartContext";
import { createRazorpayOrder } from "@/services/paymentService";
import { usePayment } from "@/hooks/usePayment";
import { validateCheckout } from "@/services/checkoutService";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCurrentCustomerProfile,
  normalizePhone,
  CustomerProfile,
} from "@/services/customerProfileService";
import {
  saveCustomerAddress,
  CustomerAddress,
  SaveAddressInput,
} from "@/services/customerAddressService";
import { useMetadata } from "@/hooks/useMetadata";
import { getSupabaseOptimizedUrl } from "@/lib/supabaseImage";
import { StickyCta } from "@/components/hop/StickyCta";
import { formatPaise, formatRupees } from "@/lib/formatPrice";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  landmark?: string;
  addressType?: string;
}

interface FormErrors {
  [key: string]: string;
}

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!form.email.includes("@")) errors.email = "Enter a valid email";
  if (!form.firstName.trim()) errors.firstName = "First name is required";
  if (!form.lastName.trim()) errors.lastName = "Last name is required";
  if (!form.address.trim()) errors.address = "Address is required";
  if (!form.city.trim()) errors.city = "City is required";
  if (!form.state.trim()) errors.state = "State is required";
  if (!form.postalCode.trim()) errors.postalCode = "Postal code is required";
  if (!form.country.trim()) errors.country = "Country is required";
  if (!form.phone.trim()) errors.phone = "Phone number is required";
  return errors;
}

const EMPTY_FORM: FormData = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  phone: "",
  landmark: "",
  addressType: "HOME",
};

function formatPhone(phone: string): string {
  return normalizePhone(phone);
}

const formatLinePrice = formatPaise;

export default function Checkout() {
  useMetadata({
    title: "Checkout — House of Padmavati",
    description: "Where this drape will arrive — House of Padmavati checkout.",
    noIndex: true,
  });

  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state: paymentState, startPayment, reset: resetPayment } = usePayment();
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();

  // Auth sub-step state for unauthenticated users
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authAgreed, setAuthAgreed] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Customer and addresses data
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressMode, setAddressMode] = useState<"saved" | "new">("saved");
  const [saveNewAddress, setSaveNewAddress] = useState(true);

  // Delivery and order form state
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [inventoryErrors, setInventoryErrors] = useState<string[]>([]);
  const [firstOrderEligible, setFirstOrderEligible] = useState(false);
  const [firstOrderReason, setFirstOrderReason] = useState<string>("");
  const [serverShippingCost, setServerShippingCost] = useState(0);
  const [returnPolicyAccepted, setReturnPolicyAccepted] = useState(false);

  const validatedRef = useRef(false);
  const payButtonRef = useRef<HTMLDivElement>(null);

  const shippingCost = serverShippingCost > 0 ? serverShippingCost : 0;
  const totalRupees = totalPrice + shippingCost;
  const DEPOSIT_AMOUNT = 20000; // ₹200 in paise

  const [paymentOption, setPaymentOption] = useState<"full" | "deposit">("full");
  const isDeposit = paymentOption === "deposit";
  const depositAmountRupees = DEPOSIT_AMOUNT / 100;
  const remainingAmountRupees = isDeposit ? totalRupees - depositAmountRupees : 0;

  // Hydrate profile and address information when user changes
  const loadCustomerData = useCallback(async () => {
    if (!user) {
      setAddressesLoading(false);
      return;
    }

    setAddressesLoading(true);
    try {
      const fullProfile = await getCurrentCustomerProfile();
      setCustomerProfile(fullProfile.customer);
      setSavedAddresses(fullProfile.addresses);

      const email = user.email || fullProfile.customer?.email || "";
      const fullName = fullProfile.customer?.full_name || (user.user_metadata?.full_name as string) || "";
      const phone = fullProfile.customer?.phone || (user.user_metadata?.phone as string) || "";

      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      if (fullProfile.addresses.length > 0) {
        // Automatic pre-selection of default address
        const chosen = fullProfile.defaultAddress || fullProfile.addresses[0];
        setSelectedAddressId(chosen.id);
        setAddressMode("saved");

        const addrNameParts = chosen.recipient_name.split(" ");
        setForm({
          email,
          firstName: addrNameParts[0] || firstName,
          lastName: addrNameParts.slice(1).join(" ") || lastName,
          address: chosen.address,
          city: chosen.city,
          state: chosen.state || "",
          postalCode: chosen.postal_code,
          country: chosen.country || "India",
          phone: chosen.phone || phone,
          landmark: chosen.landmark || "",
          addressType: chosen.address_type || "HOME",
        });
      } else {
        // No saved address yet: prefill identity fields, prompt for delivery location
        setAddressMode("new");
        setSelectedAddressId(null);
        setForm((prev) => ({
          ...prev,
          email,
          firstName: prev.firstName || firstName,
          lastName: prev.lastName || lastName,
          phone: prev.phone || phone,
          country: "India",
        }));
      }
    } catch (err) {
      console.error("Failed to load customer profile for checkout:", err);
    } finally {
      setAddressesLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCustomerData();
  }, [loadCustomerData]);

  // Handle inline account creation at checkout
  const handleInlineSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!authName.trim()) {
      setAuthError("Please enter your full name.");
      return;
    }
    if (!authEmail.trim() || !authEmail.includes("@")) {
      setAuthError("Please enter a valid email address.");
      return;
    }
    if (!authPhone.trim()) {
      setAuthError("Please enter your contact phone number.");
      return;
    }
    if (authPassword.length < 8) {
      setAuthError("Password must be at least 8 characters long.");
      return;
    }

    setAuthSubmitting(true);
    try {
      await signUp(authEmail, authPassword, authName, authPhone);
      // Ensure local form has the identity immediately
      const nameParts = authName.trim().split(" ");
      setForm((prev) => ({
        ...prev,
        email: authEmail.trim(),
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        phone: authPhone.trim(),
      }));
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Failed to create account. Please try again.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle inline sign-in at checkout
  const handleInlineSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!authEmail.trim() || !authEmail.includes("@")) {
      setAuthError("Please enter a valid email address.");
      return;
    }
    if (!authPassword) {
      setAuthError("Please enter your password.");
      return;
    }

    setAuthSubmitting(true);
    try {
      await signIn(authEmail, authPassword);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "That email or password doesn't look right. Please try again.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleAddressSelect = (addr: CustomerAddress) => {
    setSelectedAddressId(addr.id);
    setAddressMode("saved");
    const nameParts = addr.recipient_name.split(" ");
    setForm((prev) => ({
      ...prev,
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      address: addr.address,
      city: addr.city,
      state: addr.state || "",
      postalCode: addr.postal_code,
      country: addr.country,
      phone: addr.phone || prev.phone,
      landmark: addr.landmark || "",
      addressType: addr.address_type || "HOME",
    }));
  };

  const handleNewAddress = () => {
    setAddressMode("new");
    setSelectedAddressId(null);
    const fullName = customerProfile?.full_name || (user?.user_metadata?.full_name as string) || "";
    const phone = customerProfile?.phone || (user?.user_metadata?.phone as string) || "";
    const nameParts = fullName.trim().split(" ");

    setForm((prev) => ({
      ...prev,
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      phone: phone || "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      landmark: "",
      addressType: "HOME",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError(null);
    setInventoryErrors([]);

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!returnPolicyAccepted) {
      setError("Please accept the Return & Replacement Policy to proceed.");
      return;
    }

    if (!validatedRef.current) {
      const check = await validateCheckout(items, "standard");
      if (!check.valid) {
        setInventoryErrors(check.errors);
        setError("Please fix the issues below before proceeding.");
        return;
      }
      validatedRef.current = true;
    }

    setIsProcessing(true);
    try {
      // If entering a new address and customer wants it saved
      if (addressMode === "new" && saveNewAddress && user) {
        try {
          const addressInput: SaveAddressInput = {
            recipient_name: `${form.firstName} ${form.lastName}`.trim(),
            phone: form.phone,
            address: form.address,
            city: form.city,
            state: form.state,
            postal_code: form.postalCode,
            country: form.country,
            landmark: form.landmark || null,
            address_type: form.addressType || "HOME",
            is_default: savedAddresses.length === 0, // auto default if first address
          };
          await saveCustomerAddress(addressInput, customerProfile?.id);
        } catch (saveErr) {
          console.warn("Could not save address to account:", saveErr);
        }
      }

      let currentOrderId = orderId;
      let currentOrderNumber = orderNumber;

      if (!currentOrderId) {
        const result = await createRazorpayOrder({
          customer_email: form.email,
          customer_full_name: `${form.firstName} ${form.lastName}`.trim(),
          customer_phone: form.phone,
          shipping_recipient_name: `${form.firstName} ${form.lastName}`.trim(),
          shipping_phone: form.phone,
          shipping_address: form.address,
          shipping_city: form.city,
          shipping_state: form.state,
          shipping_postal_code: form.postalCode,
          shipping_country: form.country,
          shipping_landmark: form.landmark || undefined,
          shipping_option: "standard",
          notes: isGift ? `Gift for ${giftRecipient}: ${giftMessage}`.replace(/: $/, "") : undefined,
          items: items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
          amount: isDeposit ? DEPOSIT_AMOUNT : undefined,
          payment_model: isDeposit ? "deposit" : "full",
        });
        currentOrderId = result.order_id;
        currentOrderNumber = result.order_number;
        setOrderId(currentOrderId);
        setOrderNumber(currentOrderNumber);
        setFirstOrderEligible(result.first_order_eligible ?? false);
        setFirstOrderReason(result.first_order_reason ?? "");
        setServerShippingCost(result.shipping_cost ?? 0);
      }

      await startPayment(
        { order_id: currentOrderId },
        isDeposit ? DEPOSIT_AMOUNT : totalRupees,
        form.email,
        formatPhone(form.phone),
        `${form.firstName} ${form.lastName}`.trim()
      );
    } catch (err) {
      validatedRef.current = false;
      const msg = err instanceof Error ? err.message : "";
      let code = "";
      try {
        const parsed = JSON.parse(msg);
        code = parsed.error ?? "";
      } catch {
        code = "";
      }
      const errorMessages: Record<string, string> = {
        product_not_found: "A product in your bag is not found. Please remove it and try again.",
        product_not_available: "One of your selected sarees is currently not available. Please adjust your bag.",
        insufficient_stock: "One of your selected sarees is out of stock. Please adjust your bag.",
        invalid_quantity: "One of your selected sarees has an invalid quantity. Please adjust your bag.",
        order_not_found: "We couldn't process your order. Please try again.",
        order_already_paid: "This order has already been paid.",
        order_cancelled: "This order was cancelled.",
        order_zero_total: "The order amount could not be verified. Please try again.",
        missing_required_fields: "Please fill in all required fields.",
        customer_creation_failed: "We couldn't create your account. Please try again.",
        address_creation_failed: "We couldn't save your address. Please try again.",
        order_creation_failed: "We couldn't create your order. Please try again.",
        order_number_failed: "We couldn't generate an order number. Please try again.",
        order_items_failed: "We couldn't save your order items. Please try again.",
        payment_creation_failed: "We couldn't initiate payment. Please try again.",
        unauthorized: "Please sign in to complete your checkout.",
        internal_error: "Something went wrong on our end. Please try again.",
      };
      setError(errorMessages[code] ?? (msg || "An error occurred. Please try again."));
      setIsProcessing(false);
    }
  };

  const handlePaymentRetry = useCallback(() => {
    resetPayment();
    setError(null);
    setIsProcessing(false);
    validatedRef.current = false;
  }, [resetPayment]);

  useEffect(() => {
    if (paymentState.status !== "paid" || !orderNumber) return;

    clearCart();
    queryClient.invalidateQueries({ queryKey: ["storefront"] });
    navigate(`/order/confirmation/${orderNumber}`, { replace: true });
  }, [paymentState.status, orderNumber, clearCart, queryClient, navigate]);

  if (items.length === 0) {
    return (
      <PageLayout>
        <main className="hop-page hop-page__room hop-page__section pt-28 pb-24">
          <div className="max-w-md mx-auto text-center py-16">
            <ShoppingBag className="w-12 h-12 mx-auto text-ink-soft/40 stroke-1 mb-6" />
            <h1 className="font-serif font-light text-2xl text-ink mb-3">Your bag is empty.</h1>
            <p className="text-sm text-ink-soft mb-8 font-light leading-relaxed">
              Explore our collections to choose a saree for your quiet moments.
            </p>
            <Button asChild className="rounded-full bg-ink text-jasmine hover:bg-ink-soft px-8 py-3 text-xs tracking-[0.2em] uppercase">
              <Link to="/collections">Explore collections</Link>
            </Button>
          </div>
        </main>
      </PageLayout>
    );
  }

  const isPaymentProcessing =
    paymentState.status === "creating_order" ||
    paymentState.status === "verifying";

  return (
    <PageLayout>
      <main className="hop-page hop-page__room hop-page__section pt-28 pb-24 overflow-x-hidden w-full max-w-full">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-ink-soft hover:text-ink transition-colors mb-8"
        >
          <ArrowLeft className="h-3 w-3" />
          Return to bag
        </Link>

        <h1 className="font-serif font-light text-3xl md:text-4xl text-ink mb-3">Checkout.</h1>
        <ol className="flex items-center gap-2 text-[0.65rem] tracking-[0.25em] uppercase text-ink-soft mb-12" aria-label="Checkout steps">
          <li><Link to="/cart" className="hover:text-ink transition-colors">Bag</Link></li>
          <li aria-hidden="true" className="text-ink/30">/</li>
          <li aria-current="step" className="text-ink">Details</li>
          <li aria-hidden="true" className="text-ink/30">/</li>
          <li className="text-ink-soft">Confirm</li>
        </ol>

        {/* STEP 1: Account Gate if not authenticated */}
        {!user && !authLoading ? (
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3 space-y-8">
              <div className="hop-page__panel p-6 sm:p-8 max-w-xl">
                <div className="flex border-b border-border/60 mb-6">
                  <button
                    type="button"
                    onClick={() => { setAuthMode("signup"); setAuthError(""); }}
                    className={`pb-3 text-xs tracking-[0.2em] uppercase transition-colors relative font-medium ${
                      authMode === "signup"
                        ? "text-ink border-b-2 border-ink -mb-px"
                        : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    Create HOP Account
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("signin"); setAuthError(""); }}
                    className={`pb-3 ml-8 text-xs tracking-[0.2em] uppercase transition-colors relative font-medium ${
                      authMode === "signin"
                        ? "text-ink border-b-2 border-ink -mb-px"
                        : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    Sign In
                  </button>
                </div>

                {authError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription className="text-sm">{authError}</AlertDescription>
                  </Alert>
                )}

                {authMode === "signup" ? (
                  <form onSubmit={handleInlineSignUp} className="space-y-5">
                    <div>
                      <h2 className="font-serif text-xl text-ink mb-1">Create your HOP account.</h2>
                      <p className="text-xs text-ink-soft font-light leading-relaxed">
                        Enter your contact details once. We will remember them for all future drapes.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="accountFullName" className="text-xs font-medium text-ink tracking-wider uppercase">
                          Full Name
                        </Label>
                        <Input
                          id="accountFullName"
                          autoComplete="name"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="Your full name"
                          required
                          className="mt-1.5 h-11 border-ink/15 text-base"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-xs font-medium text-ink tracking-wider uppercase">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="mt-1.5 h-11 border-ink/15 text-base"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-xs font-medium text-ink tracking-wider uppercase">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          value={authPhone}
                          onChange={(e) => setAuthPhone(e.target.value)}
                          placeholder="98765 43210"
                          required
                          className="mt-1.5 h-11 border-ink/15 text-base"
                        />
                        <p className="text-[0.68rem] text-ink-soft mt-1">Used exclusively for courier delivery updates.</p>
                      </div>

                      <div>
                        <Label htmlFor="accountPassword" className="text-xs font-medium text-ink tracking-wider uppercase">
                          Password
                        </Label>
                        <div className="relative mt-1.5">
                          <Input
                            id="accountPassword"
                            type={showAuthPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            minLength={8}
                            required
                            className="h-11 border-ink/15 pr-12 text-base"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAuthPassword(!showAuthPassword)}
                            aria-label={showAuthPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-ink-soft hover:text-ink focus:outline-none"
                          >
                            {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={authAgreed}
                          onChange={(e) => setAuthAgreed(e.target.checked)}
                          required
                          className="mt-0.5 w-4 h-4 rounded border-border accent-ink shrink-0"
                        />
                        <span className="text-[0.72rem] text-ink-soft leading-relaxed font-light">
                          I agree to HOP's{" "}
                          <Link to="/terms-of-service" className="text-ink underline">Terms</Link> and{" "}
                          <Link to="/privacy-policy" className="text-ink underline">Privacy Policy</Link>.
                        </span>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full h-12 rounded-full bg-ink text-jasmine hover:bg-ink-soft text-xs tracking-[0.2em] uppercase transition-colors"
                    >
                      {authSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating account…
                        </span>
                      ) : (
                        "Continue to Delivery"
                      )}
                    </Button>

                    <p className="text-center text-xs text-ink-soft">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => { setAuthMode("signin"); setAuthError(""); }}
                        className="text-ink underline hover:text-signature-crimson font-medium"
                      >
                        Sign in instead
                      </button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleInlineSignIn} className="space-y-5">
                    <div>
                      <h2 className="font-serif text-xl text-ink mb-1">Sign in to your account.</h2>
                      <p className="text-xs text-ink-soft font-light leading-relaxed">
                        Welcome back. We will load your saved delivery details.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="text-xs font-medium text-ink tracking-wider uppercase">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="mt-1.5 h-11 border-ink/15 text-base"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-xs font-medium text-ink tracking-wider uppercase">
                            Password
                          </Label>
                          <Link to="/account/forgot-password" className="text-xs text-ink-soft hover:text-ink">
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative mt-1.5">
                          <Input
                            id="password"
                            type={showAuthPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="h-11 border-ink/15 pr-12 text-base"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAuthPassword(!showAuthPassword)}
                            aria-label={showAuthPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-ink-soft hover:text-ink focus:outline-none"
                          >
                            {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full h-12 rounded-full bg-ink text-jasmine hover:bg-ink-soft text-xs tracking-[0.2em] uppercase transition-colors"
                    >
                      {authSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Signing in…
                        </span>
                      ) : (
                        "Sign In & Continue"
                      )}
                    </Button>

                    <p className="text-center text-xs text-ink-soft">
                      Need an account?{" "}
                      <button
                        type="button"
                        onClick={() => { setAuthMode("signup"); setAuthError(""); }}
                        className="text-ink underline hover:text-signature-crimson font-medium"
                      >
                        Create an account
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </div>

            <aside className="lg:col-span-2">
              <div className="border border-border/60 p-6 md:p-8">
                <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-14 h-18 shrink-0 bg-jasmine-deep rounded overflow-hidden">
                        <img
                          src={getSupabaseOptimizedUrl(item.image, { width: 120, height: 160, resize: "cover" })}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ink truncate">{item.name}</p>
                        <p className="text-xs text-ink-soft mt-0.5">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm text-ink font-light whitespace-nowrap">
                        {formatLinePrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border/60 space-y-2">
                  <div className="flex justify-between text-sm text-ink-soft font-light">
                    <span>Subtotal</span>
                    <span className="text-ink">{formatRupees(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-base border-t border-border/60 pt-3 mt-3">
                    <span className="text-ink font-medium">Estimated Total</span>
                    <span className="font-serif text-xl text-ink">{formatRupees(totalRupees)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          /* STEP 2: Authenticated Delivery Details & Order Review */
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3 space-y-10">
              {/* Customer Account Identity Bar */}
              <section className="hop-page__panel p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center text-ink">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-ink">
                      {customerProfile?.full_name || user?.user_metadata?.full_name || form.firstName || "HOP Customer"}
                    </p>
                    <p className="text-[0.7rem] text-ink-soft">{user?.email || form.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="text-[0.65rem] tracking-[0.15em] uppercase text-ink-soft hover:text-ink transition-colors"
                >
                  Sign Out
                </button>
              </section>

              {/* Contact Email */}
              <section className="hop-form-section">
                <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium mb-3">
                  Contact
                </h2>
                <div className="max-w-xl">
                  <Label htmlFor="email" className="text-xs text-ink-soft font-light">
                    Email address for order confirmation & updates
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="mt-1.5 h-11 text-base bg-white"
                  />
                  {errors.email && (
                    <p id="email-error" className="text-[0.7rem] text-destructive mt-1">{errors.email}</p>
                  )}
                </div>
              </section>

              {/* Delivery Address Section */}
              <section className="hop-form-section">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium">
                    Delivery Address
                  </h2>
                  {savedAddresses.length > 0 && addressMode === "saved" && (
                    <button
                      type="button"
                      onClick={handleNewAddress}
                      className="text-xs tracking-[0.15em] uppercase text-rasa-mulberry hover:text-ink transition-colors inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add new address
                    </button>
                  )}
                </div>

                {/* Saved Address Cards - Ask Once, Remember Forever */}
                {savedAddresses.length > 0 && addressMode === "saved" && (
                  <div className="space-y-3 max-w-xl">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => handleAddressSelect(addr)}
                          className={`p-4 rounded-md border-2 transition-all cursor-pointer relative ${
                            isSelected
                              ? "border-ink bg-ink/[0.02] shadow-sm"
                              : "border-border/60 hover:border-ink/40 bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-ink">{addr.recipient_name}</span>
                                {addr.address_type && (
                                  <span className="text-[0.6rem] tracking-[0.15em] uppercase bg-ink/5 text-ink-soft px-1.5 py-0.5 rounded">
                                    {addr.address_type}
                                  </span>
                                )}
                                {addr.is_default && (
                                  <span className="text-[0.6rem] tracking-[0.15em] uppercase bg-jasmine-deep/20 text-rasa-gold font-medium px-1.5 py-0.5 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-ink-soft leading-relaxed">{addr.address}</p>
                              {addr.landmark && (
                                <p className="text-xs text-ink-soft font-light">Near: {addr.landmark}</p>
                              )}
                              <p className="text-xs text-ink font-light">
                                {addr.city}, {addr.state} &ndash; {addr.postal_code}, {addr.country}
                              </p>
                              {addr.phone && (
                                <p className="text-xs text-ink-soft pt-1">Phone: {addr.phone}</p>
                              )}
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? "border-ink bg-ink text-jasmine" : "border-border"
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleNewAddress}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-md border border-dashed border-border/80 text-ink-soft hover:border-ink hover:text-ink transition-colors text-xs tracking-wider uppercase"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Deliver to a different address</span>
                    </button>
                  </div>
                )}

                {/* New Address Form - Progressive Collection */}
                {(addressMode === "new" || savedAddresses.length === 0) && (
                  <div className="space-y-4 max-w-xl bg-white p-5 sm:p-6 border border-border/60 rounded-md">
                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                      <span className="text-xs tracking-[0.15em] uppercase font-medium text-ink">
                        {savedAddresses.length > 0 ? "New Address Details" : "Where should we deliver?"}
                      </span>
                      {savedAddresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const def = savedAddresses.find((a) => a.is_default) || savedAddresses[0];
                            if (def) handleAddressSelect(def);
                          }}
                          className="text-xs text-ink-soft hover:text-ink underline"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="firstName" className="text-xs font-medium text-ink tracking-wider uppercase">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          autoComplete="given-name"
                          value={form.firstName}
                          onChange={(e) => handleChange("firstName", e.target.value)}
                          className={`mt-1.5 h-11 text-base ${errors.firstName ? "border-destructive" : ""}`}
                        />
                        {errors.firstName && (
                          <p id="first-name-error" className="text-[0.7rem] text-destructive mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-xs font-medium text-ink tracking-wider uppercase">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          autoComplete="family-name"
                          value={form.lastName}
                          onChange={(e) => handleChange("lastName", e.target.value)}
                          className={`mt-1.5 h-11 text-base ${errors.lastName ? "border-destructive" : ""}`}
                        />
                        {errors.lastName && (
                          <p id="last-name-error" className="text-[0.7rem] text-destructive mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-xs font-medium text-ink tracking-wider uppercase">
                        Phone Number (for Courier Dispatch)
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="98765 43210"
                        className={`mt-1.5 h-11 text-base ${errors.phone ? "border-destructive" : ""}`}
                      />
                      {errors.phone && (
                        <p id="phone-error" className="text-[0.7rem] text-destructive mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-xs font-medium text-ink tracking-wider uppercase">
                        Flat / House / Street Address
                      </Label>
                      <Input
                        id="address"
                        autoComplete="street-address"
                        value={form.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Flat 204, Padmavati Nilayam, 4th Cross"
                        className={`mt-1.5 h-11 text-base ${errors.address ? "border-destructive" : ""}`}
                      />
                      {errors.address && (
                        <p id="address-error" className="text-[0.7rem] text-destructive mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="landmark" className="text-xs font-medium text-ink tracking-wider uppercase">
                        Landmark <span className="text-ink-soft font-light">(Optional)</span>
                      </Label>
                      <Input
                        id="landmark"
                        value={form.landmark || ""}
                        onChange={(e) => handleChange("landmark", e.target.value)}
                        placeholder="Near Temple / Metro Station"
                        className="mt-1.5 h-11 text-base"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="city" className="text-xs font-medium text-ink tracking-wider uppercase">
                          City
                        </Label>
                        <Input
                          id="city"
                          autoComplete="address-level2"
                          value={form.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          placeholder="Bengaluru"
                          className={`mt-1.5 h-11 text-base ${errors.city ? "border-destructive" : ""}`}
                        />
                        {errors.city && (
                          <p id="city-error" className="text-[0.7rem] text-destructive mt-1">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-xs font-medium text-ink tracking-wider uppercase">
                          State
                        </Label>
                        <Input
                          id="state"
                          autoComplete="address-level1"
                          value={form.state}
                          onChange={(e) => handleChange("state", e.target.value)}
                          placeholder="Karnataka"
                          className={`mt-1.5 h-11 text-base ${errors.state ? "border-destructive" : ""}`}
                        />
                        {errors.state && (
                          <p id="state-error" className="text-[0.7rem] text-destructive mt-1">{errors.state}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="postalCode" className="text-xs font-medium text-ink tracking-wider uppercase">
                          PIN Code
                        </Label>
                        <Input
                          id="postalCode"
                          autoComplete="postal-code"
                          inputMode="numeric"
                          value={form.postalCode}
                          onChange={(e) => handleChange("postalCode", e.target.value)}
                          placeholder="560001"
                          className={`mt-1.5 h-11 text-base ${errors.postalCode ? "border-destructive" : ""}`}
                        />
                        {errors.postalCode && (
                          <p id="postal-code-error" className="text-[0.7rem] text-destructive mt-1">{errors.postalCode}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-xs font-medium text-ink tracking-wider uppercase">
                          Country
                        </Label>
                        <Input
                          id="country"
                          autoComplete="country-name"
                          value={form.country}
                          onChange={(e) => handleChange("country", e.target.value)}
                          className={`mt-1.5 h-11 text-base ${errors.country ? "border-destructive" : ""}`}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Label className="text-xs text-ink-soft">Label:</Label>
                        {(["HOME", "WORK", "OTHER"] as const).map((type) => (
                          <label key={type} className="flex items-center gap-1.5 cursor-pointer text-xs text-ink font-light">
                            <input
                              type="radio"
                              name="addressType"
                              value={type}
                              checked={(form.addressType || "HOME") === type}
                              onChange={() => handleChange("addressType", type)}
                              className="w-3.5 h-3.5 accent-ink"
                            />
                            {type}
                          </label>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={saveNewAddress}
                        onChange={(e) => setSaveNewAddress(e.target.checked)}
                        className="w-4 h-4 rounded border-border accent-ink"
                      />
                      <span className="text-xs text-ink-soft font-light">
                        Save this address to your account for future purchases
                      </span>
                    </label>
                  </div>
                )}
              </section>

              {/* Gift Drape Option */}
              <section className="hop-form-section">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium">
                    Gift Presentation
                  </h2>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-ink font-light">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="w-4 h-4 rounded border-border accent-ink"
                    />
                    Send as a gift
                  </label>
                </div>
                {isGift && (
                  <div className="space-y-4 max-w-xl bg-jasmine-deep/[0.04] p-5 border border-jasmine-deep/20 rounded-md">
                    <div>
                      <Label htmlFor="giftRecipient" className="text-xs font-medium text-ink uppercase tracking-wider">
                        Recipient Name
                      </Label>
                      <Input
                        id="giftRecipient"
                        value={giftRecipient}
                        onChange={(e) => setGiftRecipient(e.target.value)}
                        placeholder="Recipient's name"
                        className="mt-1.5 h-11 text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="giftMessage" className="text-xs font-medium text-ink uppercase tracking-wider">
                        Gift Note
                      </Label>
                      <Textarea
                        id="giftMessage"
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="A personal keepsake message to be printed with the drape…"
                        className="mt-1.5 min-h-[90px] text-base"
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Payment Section */}
              <section className="hop-form-section">
                <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium mb-5">
                  Payment Option
                </h2>
                <div className="max-w-xl p-5 border border-border/60 rounded-md space-y-4 bg-white">
                  <p className="text-xs text-ink-soft leading-relaxed font-light">
                    Processed securely via Razorpay. We support UPI, major Credit/Debit Cards, and Net Banking.
                  </p>

                  <div className="space-y-3 pt-1">
                    <label className="flex items-start gap-3 p-3 rounded border border-border/60 hover:border-ink/40 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="paymentOption"
                        value="full"
                        checked={paymentOption === "full"}
                        onChange={() => setPaymentOption("full")}
                        className="mt-0.5 w-4 h-4 border-border accent-ink shrink-0"
                      />
                      <div className="space-y-0.5">
                        <span className="text-sm font-medium text-ink">Pay {formatRupees(totalRupees)} in full online</span>
                        <p className="text-xs text-ink-soft font-light">Fastest order processing and doorstep dispatch.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded border border-border/60 hover:border-ink/40 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="paymentOption"
                        value="deposit"
                        checked={paymentOption === "deposit"}
                        onChange={() => setPaymentOption("deposit")}
                        className="mt-0.5 w-4 h-4 border-border accent-ink shrink-0"
                      />
                      <div className="space-y-0.5">
                        <span className="text-sm font-medium text-ink">
                          Pay ₹200 advance deposit now, remaining {formatRupees(remainingAmountRupees)} at delivery
                        </span>
                        <p className="text-xs text-ink-soft font-light">Secure your drape with minimal upfront payment.</p>
                      </div>
                    </label>
                  </div>

                  <div className="pt-3 border-t border-border/40 flex items-center gap-2 text-xs text-ink-soft">
                    <Shield className="h-3.5 w-3.5 shrink-0 text-ink-soft" />
                    <span>256-bit Bank Grade Encryption by Razorpay</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Sticky Order Review Aside */}
            <aside className="order-first lg:order-last lg:col-span-2 lg:sticky lg:top-32 lg:self-start">
              <div className="border border-border/60 p-6 md:p-8 bg-white rounded-md">
                <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium mb-6">
                  Review Bag ({items.length} {items.length === 1 ? "drape" : "drapes"})
                </h2>

                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-20 shrink-0 bg-jasmine-deep/10 rounded overflow-hidden">
                        <img
                          src={getSupabaseOptimizedUrl(item.image, { width: 160, height: 200, resize: "cover" })}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ink truncate font-medium">{item.name}</p>
                        {item.size && <p className="text-xs text-ink-soft">{item.size}</p>}
                        <p className="text-xs text-ink-soft">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-ink font-light whitespace-nowrap">
                        {formatLinePrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border/60 space-y-2">
                  <div className="flex justify-between text-sm text-ink-soft font-light">
                    <span>Subtotal</span>
                    <span className="text-ink">{formatRupees(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-ink-soft font-light">
                    <span>Shipping</span>
                    <span className="text-ink flex items-center gap-2">
                      {shippingCost === 0 ? "Free" : formatRupees(shippingCost)}
                      {firstOrderEligible && firstOrderReason === "first_order" && (
                        <span className="text-[0.6rem] tracking-[0.2em] uppercase text-rasa-gold bg-jasmine-deep/20 px-2 py-0.5 rounded">
                          First order free
                        </span>
                      )}
                    </span>
                  </div>

                  {isDeposit ? (
                    <>
                      <div className="flex justify-between text-sm text-ink-soft font-light border-t border-border/60 pt-2 mt-2">
                        <span>Pay now (deposit)</span>
                        <span className="text-ink font-medium">{formatRupees(depositAmountRupees)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-ink-soft font-light">
                        <span>Remaining (at delivery)</span>
                        <span className="text-ink">{formatRupees(remainingAmountRupees)}</span>
                      </div>
                      <div className="flex justify-between text-base border-t border-border/60 pt-2 mt-2">
                        <span className="text-ink font-medium">Order Total</span>
                        <span className="font-serif text-xl text-ink">{formatRupees(totalRupees)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-base border-t border-border/60 pt-2 mt-2">
                      <span className="text-ink font-medium">Total</span>
                      <span className="font-serif text-xl text-ink">{formatRupees(totalRupees)}</span>
                    </div>
                  )}
                </div>

                {inventoryErrors.length > 0 && (
                  <div className="mt-6 p-3 rounded-md bg-amber-50 border border-amber-200" role="alert">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-medium text-amber-800">Inventory update needed</span>
                    </div>
                    <ul className="space-y-1">
                      {inventoryErrors.map((e, i) => (
                        <li key={i} className="text-xs text-amber-700">{e}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {error && inventoryErrors.length === 0 && (
                  <p className="mt-6 text-sm text-destructive text-center" role="alert">{error}</p>
                )}

                {paymentState.status === "failed" && !isProcessing && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-ink-soft mb-2">
                      {paymentState.phase === "creation"
                        ? "We had trouble starting your payment."
                        : paymentState.phase === "checkout"
                        ? "Payment window closed."
                        : "Your payment could not be verified."}
                    </p>
                    <p className="text-[0.68rem] text-destructive mb-3">{paymentState.error}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handlePaymentRetry}
                      className="border-border/50 text-xs"
                    >
                      {paymentState.phase === "checkout" ? "Open Payment Again" : "Try Again"}
                    </Button>
                  </div>
                )}

                <div className="mt-6">
                  <label className="flex items-start gap-3 cursor-pointer" htmlFor="returnPolicyAccepted">
                    <input
                      id="returnPolicyAccepted"
                      type="checkbox"
                      checked={returnPolicyAccepted}
                      onChange={(e) => setReturnPolicyAccepted(e.target.checked)}
                      required
                      className="mt-0.5 w-5 h-5 rounded border-border accent-ink shrink-0"
                    />
                    <span className="text-xs text-ink-soft font-light leading-relaxed">
                      I accept the{" "}
                      <Link to="/returns-policy" className="text-ink border-b border-ink/30 hover:border-ink transition-colors">
                        Return & Replacement Policy
                      </Link>.
                    </span>
                  </label>
                </div>

                <div ref={payButtonRef}>
                  <Button
                    type="submit"
                    disabled={isProcessing || isPaymentProcessing}
                    className="w-full mt-5 rounded-full bg-ink text-jasmine hover:bg-ink-soft active:bg-ink-soft transition-colors min-h-[48px] h-12 text-xs tracking-[0.2em] uppercase font-medium"
                  >
                    {isPaymentProcessing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {paymentState.status === "creating_order" ? "Preparing payment…" : "Verifying payment…"}
                      </span>
                    ) : isDeposit ? (
                      `Pay ₹${depositAmountRupees} Deposit`
                    ) : (
                      `Pay ₹${totalRupees.toLocaleString("en-IN")}`
                    )}
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-[0.65rem] text-ink-soft">
                  <Shield className="h-3 w-3" />
                  <span>Secured by Razorpay · Authentic Indian Handlooms</span>
                </div>
              </div>
            </aside>

            {/* Mobile Sticky CTA */}
            <StickyCta inlineRef={payButtonRef} label="Proceed to pay">
              <div className="min-w-0">
                <p className="text-[0.6rem] tracking-[0.2em] uppercase text-ink-soft">Amount to pay</p>
                <p className="text-base text-ink font-medium tnum">
                  {formatRupees(isDeposit ? depositAmountRupees : totalRupees)}
                </p>
              </div>
              <Button
                type="submit"
                disabled={isProcessing || isPaymentProcessing}
                className="shrink-0 rounded-full bg-ink text-jasmine hover:bg-ink-soft active:bg-ink-soft min-h-[48px] px-6 text-xs tracking-[0.2em] uppercase"
              >
                {isPaymentProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </span>
                ) : (
                  "Pay Securely"
                )}
              </Button>
            </StickyCta>
          </form>
        )}

        <div className="h-20 lg:hidden" aria-hidden="true" />
      </main>
    </PageLayout>
  );
}
