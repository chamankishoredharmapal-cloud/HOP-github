export interface OrderConfirmation {
  orderNumber: string
  orderId: string
}

export interface OrderConfirmationItem {
  productName: string
  quantity: number
  price: number
  imageUrl: string | null
  estimatedDeliveryDays: number | null
}

export interface OrderConfirmationDetail {
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  subtotal: number
  shippingCost: number
  shipping: {
    city: string
    state: string
    postalCode: string
  } | null
  items: OrderConfirmationItem[]
}
