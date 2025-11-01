
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { checkoutSchema, type CheckoutSchema } from '@/types/order';

export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }
  return userId;
}

export async function addCartItem(productId: string, quantity = 1) {
  const userId = await requireUserId();
  const supabase = createClerkSupabaseClient();

  console.group('[cart] addCartItem');
  console.log('input', { userId, productId, quantity });

  const { data: existing, error: fetchError } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('clerk_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (fetchError) {
    console.error('장바구니 조회 실패', fetchError);
    console.groupEnd();
    throw fetchError;
  }

  if (existing) {
    const nextQuantity = existing.quantity + quantity;
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: nextQuantity })
      .eq('id', existing.id);

    if (updateError) {
      console.error('장바구니 수량 업데이트 실패', updateError);
      console.groupEnd();
      throw updateError;
    }
  } else {
    const { error: insertError } = await supabase.from('cart_items').insert({
      clerk_id: userId,
      product_id: productId,
      quantity,
    });

    if (insertError) {
      console.error('장바구니 추가 실패', insertError);
      console.groupEnd();
      throw insertError;
    }
  }

  console.groupEnd();
  revalidatePath('/cart');
}

export async function addCartItemAction(formData: FormData) {
  const productId = formData.get('productId');
  const quantity = Number(formData.get('quantity') ?? 1);

  if (typeof productId !== 'string') {
    throw new Error('상품 정보가 올바르지 않습니다.');
  }

  await addCartItem(productId, Number.isFinite(quantity) && quantity > 0 ? quantity : 1);
}

export async function addToCartAction(input: { productId: string; quantity?: number }) {
  const { productId, quantity = 1 } = input;
  await addCartItem(productId, quantity);
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const userId = await requireUserId();
  const supabase = createClerkSupabaseClient();

  console.group('[cart] updateCartItemQuantity');
  console.log('input', { userId, cartItemId, quantity });

  if (quantity <= 0) {
    await removeCartItem(cartItemId);
    console.groupEnd();
    return;
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)
    .eq('clerk_id', userId);

  if (error) {
    console.error('장바구니 수량 변경 실패', error);
    console.groupEnd();
    throw error;
  }

  console.groupEnd();
  revalidatePath('/cart');
}

export async function updateCartItemQuantityAction(formData: FormData) {
  const cartItemId = formData.get('cartItemId');
  const quantity = Number(formData.get('quantity'));

  if (typeof cartItemId !== 'string' || !Number.isFinite(quantity)) {
    throw new Error('장바구니 데이터가 올바르지 않습니다.');
  }

  await updateCartItemQuantity(cartItemId, quantity);
}

export async function removeCartItem(cartItemId: string) {
  const userId = await requireUserId();
  const supabase = createClerkSupabaseClient();

  console.group('[cart] removeCartItem');
  console.log('input', { userId, cartItemId });

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
    .eq('clerk_id', userId);

  if (error) {
    console.error('장바구니 삭제 실패', error);
    console.groupEnd();
    throw error;
  }

  console.groupEnd();
  revalidatePath('/cart');
}

export async function removeCartItemAction(formData: FormData) {
  const cartItemId = formData.get('cartItemId');
  if (typeof cartItemId !== 'string') {
    throw new Error('장바구니 항목 정보가 올바르지 않습니다.');
  }

  await removeCartItem(cartItemId);
}

type RawCartProduct = {
  id: string;
  name: string;
  price: number | string;
};

type RawCartRow = {
  id: string;
  quantity: number;
  product: RawCartProduct | null;
};

export interface NormalizedCartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface CreateOrderDraftInput {
  userId: string;
  shipping: CheckoutSchema;
  orderNote?: string;
  clearCart?: boolean;
}

export interface CreateOrderDraftResult {
  orderId: string;
  totalAmount: number;
  orderName: string;
  items: NormalizedCartItem[];
}

export async function createOrderDraft({
  userId,
  shipping,
  orderNote,
  clearCart = true,
}: CreateOrderDraftInput): Promise<CreateOrderDraftResult> {
  const supabase = createClerkSupabaseClient();

  console.group('[order] createOrderDraft');

  const { data: cartRows, error: cartError } = await supabase
    .from('cart_items')
    .select('id, quantity, product:products(id, name, price)')
    .eq('clerk_id', userId);

  if (cartError) {
    console.error('장바구니 조회 실패', cartError);
    console.groupEnd();
    throw cartError;
  }

  const typedCart = (cartRows as unknown as RawCartRow[]) ?? [];

  if (typedCart.length === 0) {
    console.warn('장바구니가 비어 있습니다.');
    console.groupEnd();
    throw new Error('장바구니가 비어 있습니다.');
  }

  let totalAmount = 0;
  const normalizedItems: NormalizedCartItem[] = typedCart.map((item) => {
    if (!item.product) {
      throw new Error('상품 정보가 유효하지 않습니다.');
    }

    const price = Number(item.product.price ?? 0);
    if (!Number.isFinite(price)) {
      throw new Error('상품 가격이 올바르지 않습니다.');
    }

    totalAmount += price * item.quantity;

    return {
      cartItemId: item.id,
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price,
    };
  });

  const shippingAddress = {
    recipient: shipping.recipient,
    phone: shipping.phone,
    postcode: shipping.postcode,
    addressLine1: shipping.addressLine1,
    addressLine2: shipping.addressLine2 ?? null,
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      clerk_id: userId,
      total_amount: totalAmount,
      status: 'pending',
      shipping_address: shippingAddress,
      order_note: orderNote ?? null,
    })
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('주문 생성 실패', orderError);
    console.groupEnd();
    throw orderError ?? new Error('주문 생성에 실패했습니다.');
  }

  const orderItems = normalizedItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: insertItemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (insertItemsError) {
    console.error('주문 상세 저장 실패', insertItemsError);
    console.groupEnd();
    throw insertItemsError;
  }

  if (clearCart) {
    const { error: clearError } = await supabase
      .from('cart_items')
      .delete()
      .in('id', normalizedItems.map((item) => item.cartItemId));

    if (clearError) {
      console.error('장바구니 비우기 실패', clearError);
    }
  }

  const orderName = normalizedItems[0]?.productName ?? `주문 ${order.id}`;

  console.groupEnd();
  return {
    orderId: order.id,
    totalAmount,
    orderName,
    items: normalizedItems,
  };
}

export async function createOrderAction(formData: FormData) {
  const userId = await requireUserId();

  console.group('[order] createOrderAction');

  const parsed = checkoutSchema.safeParse({
    recipient: formData.get('recipient'),
    phone: formData.get('phone'),
    postcode: formData.get('postcode'),
    addressLine1: formData.get('addressLine1'),
    addressLine2: formData.get('addressLine2') ?? undefined,
    orderNote: formData.get('orderNote') ?? undefined,
  });

  if (!parsed.success) {
    console.error('주문 입력 검증 실패', parsed.error.flatten());
    console.groupEnd();
    throw new Error('주문 입력값이 올바르지 않습니다.');
  }

  const result = await createOrderDraft({
    userId,
    shipping: parsed.data,
    orderNote: parsed.data.orderNote,
    clearCart: true,
  });

  revalidatePath('/cart');
  revalidatePath(`/orders/${result.orderId}`);
  console.groupEnd();

  redirect(`/orders/${result.orderId}`);
}
