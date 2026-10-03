import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Shield, Loader2, AlertTriangle, MapPin } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { createRazorpayOrder } from "@/services/paymentService";
import { usePayment } from "@/hooks/usePayment";
import { validateCheckout } from "@/services/checkoutService";
import { useAuth } from "@/studio/hooks/useAuth";
import { fetchAddresses } from "@/services/customerAddressService";
import type { Tables } from "@/integrations/supabase/types";
type CustomerAddress = Tables<"shipping_addresses">;
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
};

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return phone;
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
  const { user } = useAuth();
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
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressMode, setAddressMode] = useState<'saved' | 'new'>('saved');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [firstOrderEligible, setFirstOrderEligible] = useState(false);
  const [firstOrderReason, setFirstOrderReason] = useState<string>('');
  const [serverShippingCost, setServerShippingCost] = useState(0);
  const validatedRef = useRef(false);
  const payButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setAddressesLoading(true);
      fetchAddresses(user.id).then((addresses) => {
        setSavedAddresses(addresses);
        if (addresses.length > 0) {
          const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
          setSelectedAddressId(defaultAddr.id);
          setForm((prev) => ({
            ...prev,
            firstName: defaultAddr.recipient_name.split(" ")[0] || "",
            lastName: defaultAddr.recipient_name.split(" ").slice(1).join(" ") || "",
            address: defaultAddr.address,
            city: defaultAddr.city,
            state: defaultAddr.state || "",
            postalCode: defaultAddr.postal_code,
            country: defaultAddr.country,
            phone: defaultAddr.phone || "",
          }));
        }
        setAddressesLoading(false);
      });
    } else {
      setAddressesLoading(false);
    }
  }, [user]);
  const [returnPolicyAccepted, setReturnPolicyAccepted] = useState(false);

  const shippingCost = serverShippingCost > 0 ? serverShippingCost : 0;
  const totalRupees = totalPrice + shippingCost;
  const DEPOSIT_AMOUNT = 20000; // ₹200 in paise

  const [paymentOption, setPaymentOption] = useState<'full' | 'deposit'>('full');
  const isDeposit = paymentOption === 'deposit';
  const depositAmountRupees = DEPOSIT_AMOUNT / 100;
  const remainingAmountRupees = isDeposit ? (totalRupees - depositAmountRupees) : 0;

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
          shipping_option: "standard",
          notes: isGift ? `Gift for ${giftRecipient}: ${giftMessage}`.replace(/: $/, "") : undefined,
          items: items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
          amount: isDeposit ? DEPOSIT_AMOUNT : undefined,
          payment_model: isDeposit ? 'deposit' : 'full',
        });
        currentOrderId = result.order_id;
        currentOrderNumber = result.order_number;
        setOrderId(currentOrderId);
        setOrderNumber(currentOrderNumber);
        setFirstOrderEligible(result.first_order_eligible ?? false);
        setFirstOrderReason(result.first_order_reason ?? '');
        setServerShippingCost(result.shipping_cost ?? 0);
      }

      await startPayment(
        { order_id: currentOrderId },
        isDeposit ? DEPOSIT_AMOUNT : totalRupees,
        form.email,
        formatPhone(form.phone),
        `${form.firstName} ${form.lastName}`.trim(),
      );
    } catch (err) {
      validatedRef.current = false;
      const msg = err instanceof Error ? err.message : "";
      let code = "";
      try { const parsed = JSON.parse(msg); code = parsed.error ?? ""; } catch { code = ""; }
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
        internal_error: "Something went wrong on our end. Please try again.",
      };
      setError(errorMessages[code] ?? (msg || "An error occurred. Please try again."));
      setIsProcessing(false);
    }
  };

  // Handle payment state changes
  const handlePaymentRetry = useCallback(() => {
    resetPayment();
    setError(null);
    setIsProcessing(false);
    validatedRef.current = false;
  }, [resetPayment]);

  const handleAddressSelect = (addr: CustomerAddress) => {
    setSelectedAddressId(addr.id);
    setAddressMode("saved");
    setForm((prev) => ({
      ...prev,
      firstName: addr.recipient_name.split(" ")[0] || "",
      lastName: addr.recipient_name.split(" ").slice(1).join(" ") || "",
      address: addr.address,
      city: addr.city,
      state: addr.state || "",
      postalCode: addr.postal_code,
      country: addr.country,
      phone: addr.phone || "",
    }));
  };

  const handleNewAddress = () => {
    setAddressMode("new");
    setSelectedAddressId(null);
    setForm((prev) => ({
      ...prev,
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      phone: "",
    }));
  };

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
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="h-12 w-12 text-ink-soft/30 mb-6" strokeWidth={1} aria-hidden="true" />
            <h1 className="font-serif font-light text-3xl text-ink mb-4">Your bag is empty.</h1>
            <p className="text-sm text-ink-soft font-light mb-8">There is nothing to wrap yet.</p>
            <Link
              to="/collections"
              className="inline-flex items-center gap-3 text-[0.65rem] tracking-[0.32em] uppercase text-ink border-b border-ink/30 pb-1.5 hover:border-ink transition-colors"
            >
              View collections
            </Link>
          </div>
        </main>
      </PageLayout>
    );
  }

  const isPaymentProcessing =
    paymentState.status === "creating_order" ||
    paymentState.status === "checkout_open" ||
    paymentState.status === "verifying";

  return (
    <PageLayout>
      <main className="hop-page hop-page__room hop-page__section pt-16 pb-24">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.25em] uppercase text-ink-soft hover:text-ink transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
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

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-3 space-y-10">
            <section className="hop-form-section">
              <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium mb-5">
                Contact
              </h2>
              <div className="max-w-md">
                <Label htmlFor="email" className="text-sm text-ink-soft font-light">
                  Email address
                </Label>
                <Input
                   id="email"
                   aria-invalid={!!errors.email}
                   aria-describedby={errors.email ? "email-error" : undefined}
                   type="email"
                   autoComplete="email"
                   inputMode="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                  className={`mt-1.5 rounded-none ${errors.email ? "border-destructive" : ""}`}
                />
                {errors.email && (
                   <p id="email-error" className="text-[0.7rem] text-destructive mt-1">{errors.email}</p>
                )}
              </div>
            </section>

<section className="hop-form-section">
              <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium mb-5">
                Delivery address
              </h2>
              <div className="space-y-4 max-w-md">
                {/* Address selector for authenticated users with saved addresses */}
                {user && savedAddresses.length > 0 && !addressesLoading && (
                  <div className="space-y-4">
                    <Label className="text-sm text-ink-soft font-light">Saved addresses</Label>
                    <div className="space-y-2">
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`flex items-center gap-3 p-3 rounded-md border-2 transition-colors cursor-pointer ${
                            selectedAddressId === addr.id
                              ? "border-ink bg-ink/5"
                              : "border-border/60 hover:border-ink/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name="savedAddress"
                            value={addr.id}
                            checked={selectedAddressId === addr.id}
                            onChange={() => handleAddressSelect(addr)}
                            className="w-5 h-5 border-border accent-ink focus:ring-ink shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink">{addr.recipient_name}</p>
                            <p className="text-xs text-ink-soft truncate">{addr.address}</p>
                            <p className="text-xs text-ink-soft">
                              {addr.city}, {addr.state} &ndash; {addr.postal_code}
                            </p>
                            {addr.phone && (
                              <p className="text-xs text-ink-soft">Phone: {addr.phone}</p>
                            )}
                            {addr.is_default && (
                              <span className="text-[0.6rem] tracking-[0.2em] uppercase text-rasa-gold bg-jasmine-deep/20 px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                      <button
                        type="button"
                        onClick={handleNewAddress}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-md border-2 border-dashed border-border/60 text-ink-soft hover:border-ink hover:text-ink transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-light">Use a different address</span>
                      </button>
                    </div>
                  </div>
                )}
                {/* New address form - shown when no saved addresses or user chooses to enter new */}
                {(addressMode === 'new' || !user || savedAddresses.length === 0) && (
                  <div className="space-y-4 max-w-md">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="firstName" className="text-sm text-ink-soft font-light">
                          First name
                        </Label>
                        <Input
                           id="firstName"
                           aria-invalid={!!errors.firstName}
                           aria-describedby={errors.firstName ? "first-name-error" : undefined}
                           autoComplete="given-name"
                           value={form.firstName}
                           onChange={(e) => handleChange("firstName", e.target.value)}
                           className={`mt-1.5 rounded-none ${errors.firstName ? "border-destructive" : ""}`}
                         />
                         {errors.firstName && (
                            <p id="first-name-error" className="text-[0.7rem] text-destructive mt-1">{errors.firstName}</p>
                         )}
                       </div>
                       <div>
                         <Label htmlFor="lastName" className="text-sm text-ink-soft font-light">
                           Last name
                         </Label>
                          <Input
                             id="lastName"
                             aria-invalid={!!errors.lastName}
                             aria-describedby={errors.lastName ? "last-name-error" : undefined}
                             autoComplete="family-name"
                             value={form.lastName}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                            className={`mt-1.5 rounded-none ${errors.lastName ? "border-destructive" : ""}`}
                          />
                         {errors.lastName && (
                            <p id="last-name-error" className="text-[0.7rem] text-destructive mt-1">{errors.lastName}</p>
                         )}
                       </div>
                     </div>

                     <div>
                       <Label htmlFor="address" className="text-sm text-ink-soft font-light">
                         Address
                       </Label>
                        <Input
                           id="address"
                           aria-invalid={!!errors.address}
                           aria-describedby={errors.address ? "address-error" : undefined}
                           autoComplete="street-address"
                           value={form.address}
                          onChange={(e) => handleChange("address", e.target.value)}
                          placeholder="Street address"
                          className={`mt-1.5 rounded-none ${errors.address ? "border-destructive" : ""}`}
                        />
                        {errors.address && (
                           <p id="address-error" className="text-[0.7rem] text-destructive mt-1">{errors.address}</p>
                         )}
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                         <div>
                           <Label htmlFor="city" className="text-sm text-ink-soft font-light">
                             City
                           </Label>
                            <Input
                              id="city"
                              aria-invalid={!!errors.city}
                              aria-describedby={errors.city ? "city-error" : undefined}
                              autoComplete="address-level2"
                              value={form.city}
                              onChange={(e) => handleChange("city", e.target.value)}
                              className={`mt-1.5 rounded-none ${errors.city ? "border-destructive" : ""}`}
                            />
                            {errors.city && (
                               <p id="city-error" className="text-[0.7rem] text-destructive mt-1">{errors.city}</p>
                             )}
                           </div>
                           <div>
                             <Label htmlFor="state" className="text-sm text-ink-soft font-light">
                               State
                             </Label>
                              <Input
                                 id="state"
                                 aria-invalid={!!errors.state}
                                 aria-describedby={errors.state ? "state-error" : undefined}
                                 autoComplete="address-level1"
                                 value={form.state}
                                onChange={(e) => handleChange("state", e.target.value)}
                                placeholder="State / Province"
                                className={`mt-1.5 rounded-none ${errors.state ? "border-destructive" : ""}`}
                              />
                              {errors.state && (
                                 <p id="state-error" className="text-[0.7rem] text-destructive mt-1">{errors.state}</p>
                               )}
                           </div>
                         </div>

                         <div className="grid grid-cols-2 gap-3">
                           <div>
                             <Label htmlFor="postalCode" className="text-sm text-ink-soft font-light">
                               Postal code
                             </Label>
                              <Input
                                 id="postalCode"
                                 aria-invalid={!!errors.postalCode}
                                 aria-describedby={errors.postalCode ? "postal-code-error" : undefined}
                                 autoComplete="postal-code"
                                 inputMode="numeric"
                                 value={form.postalCode}
                                onChange={(e) => handleChange("postalCode", e.target.value)}
                                className={`mt-1.5 rounded-none ${errors.postalCode ? "border-destructive" : ""}`}
                              />
                             {errors.postalCode && (
                                <p id="postal-code-error" className="text-[0.7rem] text-destructive mt-1">{errors.postalCode}</p>
                              )}
                           </div>
                         </div>

                         <div>
                           <Label htmlFor="country" className="text-sm text-ink-soft font-light">
                             Country
                           </Label>
                            <Input
                              id="country"
                              aria-invalid={!!errors.country}
                              aria-describedby={errors.country ? "country-error" : undefined}
                              autoComplete="country-name"
                              value={form.country}
                              onChange={(e) => handleChange("country", e.target.value)}
                              placeholder="India"
                              className={`mt-1.5 rounded-none ${errors.country ? "border-destructive" : ""}`}
                            />
                           {errors.country && (
                              <p id="country-error" className="text-[0.7rem] text-destructive mt-1">{errors.country}</p>
                            )}
                         </div>

                         <div>
                           <Label htmlFor="phone" className="text-sm text-ink-soft font-light">
                             Phone
                           </Label>
                            <Input
                              id="phone"
                              type="tel"
                              required
                              autoComplete="tel"
                              inputMode="tel"
                              value={form.phone}
                              onChange={(e) => handleChange("phone", e.target.value)}
                              placeholder="+91"
                              className={`mt-1.5 rounded-none ${errors.phone ? "border-destructive" : ""}`}
                            />
                           {errors.phone && (
                              <p id="phone-error" className="text-[0.7rem] text-destructive mt-1">{errors.phone}</p>
                            )}
                         </div>
                       </div>
                     )}
                   </div>
             </section>

            <section className="hop-form-section">
              <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium mb-5">
                <label className="flex items-center gap-3 cursor-pointer" htmlFor="isGift">
                  <input
                    id="isGift"
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="w-5 h-5 rounded border-border accent-ink shrink-0"
                  />
                  <span>This is a gift</span>
                </label>
              </h2>
              {isGift && (
                <div className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="giftRecipient" className="text-sm text-ink-soft font-light">
                      Recipient name <span className="text-ink-soft">(optional)</span>
                    </Label>
                    <Input
                      id="giftRecipient"
                      value={giftRecipient}
                      onChange={(e) => setGiftRecipient(e.target.value)}
                      placeholder=""
                      className="mt-1.5 rounded-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="giftMessage" className="text-sm text-ink-soft font-light">
                      Note <span className="text-ink-soft">(optional)</span>
                    </Label>
                    <Textarea
                      id="giftMessage"
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder=""
                      className="mt-1.5 rounded-md min-h-[100px]"
                    />
                  </div>
                </div>
              )}
            </section>

            <section className="hop-form-section">
              <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium mb-5">
                Payment
              </h2>
              <div className="max-w-md p-6 border border-border/60 space-y-4">
                <p className="text-xs text-ink-soft leading-relaxed">
                  Processed securely through Razorpay. We accept all major cards, UPI, net banking, and wallets.
                </p>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="full"
                      checked={paymentOption === 'full'}
                      onChange={() => setPaymentOption('full')}
                      className="w-5 h-5 border-border accent-ink focus:ring-ink shrink-0"
                    />
                    <span className="text-sm text-ink font-light">Pay {formatRupees(totalRupees)} in full online</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="deposit"
                      checked={paymentOption === 'deposit'}
                      onChange={() => setPaymentOption('deposit')}
                      className="w-5 h-5 border-border accent-ink focus:ring-ink shrink-0"
                    />
                    <span className="text-sm text-ink font-light">Pay {formatRupees(depositAmountRupees)} now, remaining {formatRupees(remainingAmountRupees)} at delivery</span>
                  </label>
                </div>

                <div className="mt-4 pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2 text-xs text-ink-soft">
                    <Shield className="h-3 w-3 shrink-0" />
                    <span>Secured by Razorpay</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

           <aside className="order-first lg:order-last lg:col-span-2 lg:sticky lg:top-32 lg:self-start">
            <div className="border border-border/60 p-6 md:p-8">
              <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium mb-6">
                Summary
              </h2>

              <div className="space-y-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 shrink-0 bg-jasmine-deep rounded overflow-hidden">
                      <img
                        src={getSupabaseOptimizedUrl(item.image, { width: 160, height: 200, resize: "cover" })}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = "true";
                            target.src = item.image;
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">{item.name}</p>
                      {item.size && (
                        <p className="text-xs text-ink-soft mt-0.5">{item.size}</p>
                      )}
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
                <div className="flex justify-between text-sm text-ink-soft font-light">
                  <span>Shipping</span>
                  <span className="text-ink flex items-center gap-2">
                    {shippingCost === 0 ? "Free" : formatRupees(shippingCost)}
                    {firstOrderEligible && firstOrderReason === 'first_order' && (
                      <span className="text-[0.6rem] tracking-[0.2em] uppercase text-rasa-gold bg-jasmine-deep/20 px-2 py-0.5 rounded">
                        First order free
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-xs text-ink-soft font-light text-right">Estimated delivery: 3–5 business days</p>
                {isDeposit ? (
                  <>
                    <div className="flex justify-between text-sm text-ink-soft font-light border-t border-border/60 pt-2 mt-2">
                      <span>Pay now (deposit)</span>
                      <span className="text-ink">{formatRupees(depositAmountRupees)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-ink-soft font-light">
                      <span>Remaining (at delivery)</span>
                      <span className="text-ink">{formatRupees(remainingAmountRupees)}</span>
                    </div>
                    <div className="flex justify-between text-base border-t border-border/60 pt-2 mt-2">
                      <span className="text-ink font-medium">Total</span>
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
                 <div className="mt-6 p-3 rounded-md bg-amber-50 border border-amber-200" role="alert" aria-live="assertive">
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
                <p className="mt-6 text-sm text-red-500 text-center" role="alert" aria-live="assertive">{error}</p>
              )}

              {paymentState.status === "failed" && !isProcessing && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-ink-soft mb-2">
                    {paymentState.phase === "creation"
                      ? "We had trouble starting your payment."
                      : paymentState.phase === "checkout"
                      ? "You closed the payment window."
                      : "Your payment could not be verified."}
                  </p>
                  <p className="text-[0.65rem] text-ink mb-3">{paymentState.error}</p>
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
                    I acknowledge and accept the{" "}
                    <Link to="/returns-policy" className="text-ink border-b border-ink/30 hover:border-ink transition-colors">Return & Replacement Policy</Link>.
                  </span>
                </label>
              </div>
              <div ref={payButtonRef}>
              <Button
                type="submit"
                disabled={isProcessing || isPaymentProcessing}
                className="w-full mt-4 rounded-full bg-ink text-jasmine hover:bg-ink-soft active:bg-ink-soft transition-colors duration-300 min-h-[48px] h-12 text-[0.65rem] tracking-[0.25em] uppercase"
              >
                {isPaymentProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {paymentState.status === "creating_order" ? "Preparing payment..." : "Processing payment..."}
                  </span>
                ) : (
                  "Pay Securely"
                )}
              </Button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[0.65rem] text-ink-soft/90">
                <Shield className="h-3 w-3" />
                Secured by Razorpay
              </div>
            </div>
          </aside>
          <StickyCta inlineRef={payButtonRef} label="Pay for your order">
            <div className="min-w-0">
              <p className="text-[0.6rem] tracking-[0.25em] uppercase text-ink-soft">Total</p>
              <p className="text-base text-ink tnum">{formatRupees(totalRupees)}</p>
            </div>
            <Button
              type="submit"
              disabled={isProcessing || isPaymentProcessing}
              className="shrink-0 rounded-full bg-ink text-jasmine hover:bg-ink-soft active:bg-ink-soft min-h-[48px] px-6 text-[0.65rem] tracking-[0.25em] uppercase"
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
        {/* Spacer so the mobile sticky bar never covers trailing content. */}
        <div className="h-20 lg:hidden" aria-hidden="true" />
      </main>
    </PageLayout>
  );
}
