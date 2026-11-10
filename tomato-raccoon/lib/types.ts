export interface ProductVariant {
  id: string;
  name: string; // e.g. "Small / White", "XL / White"
  price: number; // in cents, e.g. 3200 for $32.00
  printifyVariantId: number;
  stock?: number;
  image?: string;
  size?: string;
  color?: string;
}

export interface ProductReview {
  id: string;
  authorName: string;
  authorTitle: string;
  location: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
}

export interface Product {
  id: string;
  printifyProductId: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: "apparel" | "signs" | "stickers";
  categoryLabel: string;
  price: number; // base price in cents
  compareAtPrice?: number;
  images: string[];
  variants: ProductVariant[];
  features: string[];
}

export interface CartItem {
  id: string; // unique item id in cart (usually `${productId}-${variantId}`)
  productId: string;
  variantId: string;
  productSlug: string;
  name: string;
  variantName: string;
  price: number; // in cents
  image: string;
  quantity: number;
  printifyProductId: string;
  printifyVariantId: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  region: string; // state e.g. "VA"
  zip: string;
  country: string;
}

export interface OrderItem {
  name: string;
  variantName?: string;
  quantity: number;
  price: number;
  image: string;
  printifyVariantId?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  paymentStatus: string;
  shippingStatus: "processing" | "in_transit" | "delivered";
  trackingNumber: string | null;
  printifyOrderId?: string;
  createdAt: string;
}
