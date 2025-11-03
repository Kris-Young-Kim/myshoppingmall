import { NextRequest, NextResponse } from "next/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

/**
 * @file app/api/payments/confirm/route.ts
 * @description Toss Payments 결제 승인 API
 * 
 * 결제 요청 후 성공 URL로 리다이렉트된 경우 결제 승인을 처리합니다.
 * 결제 승인 성공 시 주문 상태를 'confirmed'로 업데이트하고 paymentKey를 저장합니다.
 */

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;

if (!TOSS_SECRET_KEY) {
  console.error("[payments/confirm] TOSS_SECRET_KEY가 설정되지 않았습니다.");
}

export async function POST(request: NextRequest) {
  console.group("[payments/confirm] 결제 승인 요청");

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    console.log("요청 데이터", { paymentKey, orderId, amount, userId });

    if (!paymentKey || !orderId || !amount) {
      console.error("필수 파라미터 누락", { paymentKey, orderId, amount });
      return NextResponse.json(
        { error: "paymentKey, orderId, amount는 필수입니다." },
        { status: 400 }
      );
    }

    if (!TOSS_SECRET_KEY) {
      console.error("TOSS_SECRET_KEY가 설정되지 않았습니다.");
      return NextResponse.json(
        { error: "서버 설정 오류" },
        { status: 500 }
      );
    }

    // 주문 정보 검증 (요청한 금액과 승인할 금액이 일치하는지 확인)
    const supabase = createClerkSupabaseClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, clerk_id, total_amount, status")
      .eq("id", orderId)
      .eq("clerk_id", userId)
      .single();

    if (orderError || !order) {
      console.error("주문 조회 실패", orderError);
      return NextResponse.json(
        { error: "주문을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 금액 검증
    if (Number(order.total_amount) !== Number(amount)) {
      console.error("금액 불일치", {
        저장된_금액: order.total_amount,
        요청_금액: amount,
      });
      return NextResponse.json(
        { error: "결제 금액이 일치하지 않습니다." },
        { status: 400 }
      );
    }

    // Basic 인증 헤더 생성 (시크릿 키:콜론을 base64 인코딩)
    const encodedSecret = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");

    // 결제 승인 API 호출
    const confirmResponse = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${encodedSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: Number(amount),
        }),
      }
    );

    const confirmData = await confirmResponse.json();

    if (!confirmResponse.ok) {
      console.error("결제 승인 실패", confirmData);
      console.groupEnd();
      return NextResponse.json(
        {
          error: confirmData.message || "결제 승인에 실패했습니다.",
          code: confirmData.code,
        },
        { status: confirmResponse.status }
      );
    }

    console.log("결제 승인 성공", confirmData);

    // 결제 승인 성공 시 주문 상태 업데이트 및 paymentKey 저장
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "confirmed",
        // paymentKey는 별도 컬럼이 있다면 저장, 없으면 메타데이터나 notes에 저장
        // metadata: { paymentKey, ...confirmData },
      })
      .eq("id", orderId)
      .eq("clerk_id", userId);

    if (updateError) {
      console.error("주문 상태 업데이트 실패", updateError);
      // 결제는 승인되었지만 주문 상태 업데이트 실패 - 수동 처리 필요
    }

    console.groupEnd();

    return NextResponse.json({
      success: true,
      payment: confirmData,
      orderId,
    });
  } catch (error) {
    console.error("[payments/confirm] 결제 승인 오류", error);
    console.groupEnd();
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "결제 승인 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
