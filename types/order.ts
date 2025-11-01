import { z } from "zod";
import type { ProductSummary } from "@/types/product";

export interface CartItemRecord {
  id: string;
  clerkId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemWithProduct extends CartItemRecord {
  product: ProductSummary;
}

export interface OrderRecord {
  id: string;
  clerkId: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: ShippingAddress;
  orderNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemRecord {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  createdAt: string;
}

export interface OrderWithItems extends OrderRecord {
  items: OrderItemRecord[];
}

export interface ShippingAddress {
  recipient: string;
  phone: string;
  postcode: string;
  addressLine1: string;
  addressLine2?: string;
}

export const checkoutSchema = z.object({
  recipient: z.string().min(2, "받는 분 이름을 입력해주세요."),
  phone: z.string().min(8, "연락처를 입력해주세요."),
  postcode: z.string().min(3, "우편번호를 입력해주세요."),
  addressLine1: z.string().min(3, "기본 주소를 입력해주세요."),
  addressLine2: z.string().optional(),
  orderNote: z.string().optional(),
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;

