import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getServiceRoleClient } from '@/lib/supabase/service-role';

interface TossWebhookPayload {
  orderId?: string;
  status?: string;
  data?: {
    orderId?: string;
    status?: string;
  };
}

const STATUS_MAP: Record<string, string> = {
  DONE: 'confirmed',
  PAYMENT_STATUS_DONE: 'confirmed',
  CANCELED: 'cancelled',
  PAYMENT_STATUS_CANCELED: 'cancelled',
  PAYMENT_STATUS_CANCELLED: 'cancelled',
};

export async function POST(req: NextRequest) {
  const secret = process.env.TOSS_PAYMENTS_WEBHOOK_SECRET;

  if (secret) {
    const headerSecret = req.headers.get('x-toss-payments-secret');
    if (headerSecret !== secret) {
      return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
    }
  }

  const payload = (await req.json()) as TossWebhookPayload;
  const orderId = payload.orderId ?? payload.data?.orderId;
  const status = payload.status ?? payload.data?.status;

  if (!orderId || !status) {
    return NextResponse.json({ ok: false, message: 'invalid payload' }, { status: 400 });
  }

  const normalizedStatus = STATUS_MAP[status];
  if (!normalizedStatus) {
    return NextResponse.json({ ok: true, message: 'ignored' });
  }

  const supabase = getServiceRoleClient();

  const { data: order } = await supabase
    .from('orders')
    .select('id, clerk_id')
    .eq('id', orderId)
    .maybeSingle();

  if (!order) {
    return NextResponse.json({ ok: false, message: 'order not found' }, { status: 404 });
  }

  await supabase
    .from('orders')
    .update({ status: normalizedStatus })
    .eq('id', orderId);

  if (normalizedStatus === 'confirmed') {
    await supabase.from('cart_items').delete().eq('clerk_id', order.clerk_id);
  }

  return NextResponse.json({ ok: true });
}

