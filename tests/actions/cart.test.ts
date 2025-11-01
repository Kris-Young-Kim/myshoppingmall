import { describe, expect, it } from "vitest";
import { checkoutSchema } from "@/types/order";

describe("checkoutSchema", () => {
  it("should validate minimal payload", () => {
    const result = checkoutSchema.safeParse({
      recipient: "홍길동",
      phone: "01012341234",
      postcode: "12345",
      addressLine1: "서울시 강남구 테헤란로",
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid payload", () => {
    const result = checkoutSchema.safeParse({
      recipient: "",
      phone: "",
      postcode: "",
      addressLine1: "",
    });

    expect(result.success).toBe(false);
  });
});
