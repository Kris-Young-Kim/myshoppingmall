export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function LegacyPaymentSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderId = params.orderId;

  if (orderId) {
    redirect(`/payments/manual?orderId=${orderId}`);
  }

  redirect("/orders");
}

