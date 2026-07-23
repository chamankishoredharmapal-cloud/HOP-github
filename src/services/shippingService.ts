export interface ShippingOption {
  value: string;
  label: string;
  detail: string;
  cost: number;
  estimatedDays: string;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { value: "standard", label: "Standard", detail: "3–5 business days", cost: 0, estimatedDays: "3-5" },
  { value: "express", label: "Express", detail: "1–2 business days", cost: 800, estimatedDays: "1-2" },
  { value: "overnight", label: "Overnight", detail: "Next business day", cost: 2400, estimatedDays: "1" },
];

const SHIPPING_COST_MAP = Object.fromEntries(SHIPPING_OPTIONS.map((o) => [o.value, o.cost]));

export function getShippingCost(option: string): number {
  return SHIPPING_COST_MAP[option] ?? 0;
}

export function validateShippingOption(option: string): boolean {
  return SHIPPING_OPTIONS.some((o) => o.value === option);
}

export function calculateShippingCost(
  subtotal: number,
  option: string
): { cost: number; freeShipping: boolean } {
  const cost = getShippingCost(option);
  return { cost, freeShipping: cost === 0 };
}
