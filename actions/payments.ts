'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createOrderDraft, requireUserId } from '@/actions/cart';
import { checkoutSchema } from '@/types/order';

export async function submitManualPaymentAction(formData: FormData) {
  const userId = await requireUserId();

  console.group('[payments] submitManualPaymentAction');

  const parsed = checkoutSchema.safeParse({
    recipient: formData.get('recipient'),
    phone: formData.get('phone'),
    postcode: formData.get('postcode'),
    addressLine1: formData.get('addressLine1'),
    addressLine2: formData.get('addressLine2') ?? undefined,
    orderNote: formData.get('orderNote') ?? undefined,
  });

  if (!parsed.success) {
    console.error('주문 정보 검증 실패', parsed.error.flatten());
    console.groupEnd();
    throw new Error('주문 정보가 올바르지 않습니다.');
  }

  const orderDraft = await createOrderDraft({
    userId,
    shipping: parsed.data,
    orderNote: parsed.data.orderNote,
    clearCart: true,
  });

  revalidatePath('/cart');
  revalidatePath('/mypage');
  console.log('orderId', orderDraft.orderId);
  console.groupEnd();

  redirect(`/payments/manual?orderId=${orderDraft.orderId}`);
}

