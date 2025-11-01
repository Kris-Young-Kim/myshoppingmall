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

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderRecord {
  id: string;
  clerkId: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  orderNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemRecord {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  quantity: number;
  price: number;
  createdAt: string;
}

export interface OrderWithItems extends OrderRecord {
  items: OrderItemRecord[];
}

export interface OrderSummary {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  recipient?: string;
  headlineProduct?: string;
  itemCount: number;
}

export interface OrderListResult {
  orders: OrderSummary[];
  nextCursor?: {
    createdAt: string;
    id: string;
  };
  hasMore: boolean;
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

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "결제 대기",
  confirmed: "결제 완료",
  shipped: "배송 중",
  delivered: "배송 완료",
  cancelled: "취소됨",
};

export const orderStatusTabOptions: ReadonlyArray<{ value: OrderStatus; label: string }> = (
  Object.entries(orderStatusLabels) as Array<[OrderStatus, string]>
).map(([value, label]) => ({ value, label }));

export function getOrderStatusLabel(status: OrderStatus): string {
  return orderStatusLabels[status] ?? status;
}

const badgeVariants: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-700",
  shipped: "bg-sky-100 text-sky-700",
  delivered: "bg-indigo-100 text-indigo-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export function getOrderStatusBadgeClass(status: OrderStatus): string {
  return badgeVariants[status] ?? "bg-gray-100 text-gray-600";
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  if (typeof value !== "string") return false;
  return (Object.keys(orderStatusLabels) as OrderStatus[]).includes(value as OrderStatus);
}

