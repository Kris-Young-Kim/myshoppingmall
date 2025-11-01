'use server';

import { redirect } from 'next/navigation';

import { createOrderDraft, requireUserId } from '@/actions/cart';
import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { checkoutSchema } from '@/types/order';

const PAYMENT_LINK_ENDPOINT = 'https://api.tosspayments.com/v1/payment-links';

interface PaymentLinkResponse {
  checkoutUrl?: string;
  paymentLinkId?: string;
  status?: string;
}

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} 환경 변수가 설정되어 있지 않습니다.`);
  }
  return value;
}

async function requestPaymentLink(params: {
  orderId: string;
  orderName: string;
  amount: number;
  clerkId: string;
}): Promise<string> {
  const secretKey = getEnv('TOSS_PAYMENTS_SECRET_KEY');
  const appUrl = getEnv('NEXT_PUBLIC_APP_URL');

  const successUrl = new URL('/payments/success', appUrl);
  successUrl.searchParams.set('orderId', params.orderId);

  const failUrl = new URL('/payments/fail', appUrl);
  failUrl.searchParams.set('orderId', params.orderId);

  const body = {
    amount: Math.round(params.amount),
    orderId: params.orderId,
    orderName: params.orderName,
    successUrl: successUrl.toString(),
    failUrl: failUrl.toString(),
  };

  console.group('[payments] create payment link');
  console.log('request', body);

  const response = await fetch(PAYMENT_LINK_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    console.error('결제 링크 생성 실패', response.status, errorPayload);
    console.groupEnd();
    throw new Error('결제 링크 생성에 실패했습니다.');
  }

  const payload = (await response.json()) as PaymentLinkResponse;
  console.log('response', payload);
  console.groupEnd();

  if (payload.checkoutUrl) {
    return payload.checkoutUrl;
  }

  throw new Error('결제 링크 응답에서 checkoutUrl을 찾을 수 없습니다.');
}

export async function initiateTossPaymentAction(formData: FormData) {
  const userId = await requireUserId();

  console.group('[payments] initiateTossPaymentAction');

  const parsed = checkoutSchema.safeParse({
    recipient: formData.get('recipient'),
    phone: formData.get('phone'),
    postcode: formData.get('postcode'),
    addressLine1: formData.get('addressLine1'),
    addressLine2: formData.get('addressLine2') ?? undefined,
    orderNote: formData.get('orderNote') ?? undefined,
  });

  if (!parsed.success) {
    console.error('결제 요청 검증 실패', parsed.error.flatten());
    console.groupEnd();
    throw new Error('결제 요청 정보가 올바르지 않습니다.');
  }

  const orderDraft = await createOrderDraft({
    userId,
    shipping: parsed.data,
    orderNote: parsed.data.orderNote,
    clearCart: false,
  });

  const checkoutUrl = await requestPaymentLink({
    orderId: orderDraft.orderId,
    orderName: orderDraft.orderName,
    amount: orderDraft.totalAmount,
    clerkId: userId,
  });

  const supabase = createClerkSupabaseClient();
  await supabase
    .from('orders')
    .update({
      order_note: parsed.data.orderNote ?? null,
      status: 'pending',
    })
    .eq('id', orderDraft.orderId);

  console.groupEnd();
  redirect(checkoutUrl);
}

