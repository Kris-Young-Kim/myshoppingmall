import { describe, expect, it } from "vitest";

import {
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
  isOrderStatus,
  orderStatusLabels,
} from "@/types/order";

describe("order status helpers", () => {
  it("returns localized label for each status", () => {
    for (const [status, label] of Object.entries(orderStatusLabels)) {
      expect(getOrderStatusLabel(status as keyof typeof orderStatusLabels)).toBe(label);
    }
  });

  it("guards valid statuses", () => {
    expect(isOrderStatus("pending")).toBe(true);
    expect(isOrderStatus("invalid" as never)).toBe(false);
    expect(isOrderStatus(undefined)).toBe(false);
  });

  it("provides badge class for status", () => {
    expect(getOrderStatusBadgeClass("confirmed")).toContain("bg-emerald");
  });
});

