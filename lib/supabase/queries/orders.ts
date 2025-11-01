import type { SupabaseClient, PostgrestError } from "@supabase/supabase-js";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type { OrderListResult, OrderStatus, OrderSummary, OrderWithItems, ShippingAddress } from "@/types/order";

interface FetchOrdersParams {
  clerkId: string;
  status?: OrderStatus;
  limit?: number;
  cursor?: {
    createdAt: string;
    id: string;
  };
  supabase?: SupabaseClient;
}

interface FetchOrderDetailParams {
  clerkId: string;
  orderId: string;
  supabase?: SupabaseClient;
}

type OrdersRow = {
  id: string;
  total_amount: number | null;
  status: OrderStatus;
  created_at: string;
  shipping_address: Record<string, unknown> | null;
  order_items: Array<{
    order_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }> | null;
};

type OrderDetailRow = {
  id: string;
  clerk_id: string;
  total_amount: number | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  shipping_address: Record<string, unknown> | null;
  order_note: string | null;
  order_items: Array<{
    id: string;
    product_id: string | null;
    product_name: string;
    quantity: number;
    price: number;
    created_at: string;
  }> | null;
};

function resolveSupabaseClient(custom?: SupabaseClient) {
  return custom ?? createClerkSupabaseClient();
}

function handleOrdersError(error: PostgrestError): OrderListResult {
  if (error.code === "PGRST205") {
    console.warn("[orders] orders 테이블이 존재하지 않습니다. 빈 목록을 반환합니다.", error);
    return { orders: [], hasMore: false };
  }

  console.error("[orders] 주문 목록 조회 실패", error);
  throw error;
}

export async function fetchOrdersByUser(params: FetchOrdersParams): Promise<OrderListResult> {
  const { clerkId, status, limit = 10, cursor, supabase: customClient } = params;
  const supabase = resolveSupabaseClient(customClient);

  console.group("[orders] fetchOrdersByUser");
  console.log("params", { clerkId, status, limit, cursor });

  let query = supabase
    .from("orders")
    .select(
      `id, total_amount, status, created_at, shipping_address, order_items(order_id, product_name, quantity, price)`
    )
    .eq("clerk_id", clerkId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit + 1);

  if (status) {
    query = query.eq("status", status);
  }

  if (cursor) {
    query = query.lt("created_at", cursor.createdAt);
  }

  const { data, error } = await query;

  if (error) {
    console.groupEnd();
    return handleOrdersError(error);
  }

  const rows = (data ?? []) as OrdersRow[];

  const hasMore = rows.length > limit;
  const trimmedRows = hasMore ? rows.slice(0, limit) : rows;

  const orders: OrderSummary[] = trimmedRows.map((row) => {
    const rawAddress = (row.shipping_address ?? {}) as Record<string, unknown>;
    const recipient = typeof rawAddress.recipient === "string" ? rawAddress.recipient : undefined;
    const itemCount = row.order_items?.length ?? 0;
    const headline = row.order_items?.[0]?.product_name;

    return {
      id: row.id,
      totalAmount: Number(row.total_amount ?? 0),
      status: row.status,
      createdAt: row.created_at,
      recipient,
      headlineProduct: headline ?? undefined,
      itemCount,
    };
  });

  const nextCursor = hasMore
    ? {
        createdAt: trimmedRows[trimmedRows.length - 1]?.created_at ?? "",
        id: trimmedRows[trimmedRows.length - 1]?.id ?? "",
      }
    : undefined;

  console.log("ordersCount", orders.length, "hasMore", hasMore);
  console.groupEnd();

  return { orders, hasMore, nextCursor };
}

export async function fetchOrderDetailForUser(params: FetchOrderDetailParams): Promise<OrderWithItems | null> {
  const { clerkId, orderId, supabase: customClient } = params;
  const supabase = resolveSupabaseClient(customClient);

  console.group("[orders] fetchOrderDetailForUser");
  console.log("params", { clerkId, orderId });

  const { data, error } = await supabase
    .from("orders")
    .select(
      `id, clerk_id, total_amount, status, created_at, updated_at, shipping_address, order_note, order_items(id, product_id, product_name, quantity, price, created_at)`
    )
    .eq("id", orderId)
    .eq("clerk_id", clerkId)
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST205") {
      console.warn("[orders] orders 테이블 없음. null 반환", error);
      console.groupEnd();
      return null;
    }

    console.error("[orders] 주문 상세 조회 실패", error);
    console.groupEnd();
    throw error;
  }

  if (!data) {
    console.warn("[orders] 주문을 찾지 못했습니다.", { orderId, clerkId });
    console.groupEnd();
    return null;
  }

  const row = data as OrderDetailRow;

  const items = (row.order_items ?? []).map((item) => ({
    id: item.id,
    orderId: row.id,
    productId: item.product_id,
    productName: item.product_name,
    quantity: item.quantity,
    price: Number(item.price ?? 0),
    createdAt: item.created_at,
  }));

  const rawAddress = (row.shipping_address ?? {}) as Record<string, unknown>;
  const shippingAddress: ShippingAddress = {
    recipient: typeof rawAddress.recipient === "string" ? rawAddress.recipient : "",
    phone: typeof rawAddress.phone === "string" ? rawAddress.phone : "",
    postcode: typeof rawAddress.postcode === "string" ? rawAddress.postcode : "",
    addressLine1: typeof rawAddress.addressLine1 === "string" ? rawAddress.addressLine1 : "",
    addressLine2: typeof rawAddress.addressLine2 === "string" ? rawAddress.addressLine2 : undefined,
  };

  const order: OrderWithItems = {
    id: row.id,
    clerkId: row.clerk_id,
    totalAmount: Number(row.total_amount ?? 0),
    status: row.status,
    shippingAddress,
    orderNote: row.order_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items,
  };

  console.groupEnd();
  return order;
}

