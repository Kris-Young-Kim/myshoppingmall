import Link from "next/link";

import type { OrderStatus } from "@/types/order";
import { getOrderStatusLabel, orderStatusTabOptions } from "@/types/order";

interface OrderStatusTabsProps {
  selectedStatus?: OrderStatus;
  basePath?: string;
}

function buildHref(status: OrderStatus | undefined, basePath: string) {
  if (!status) return basePath;
  const search = new URLSearchParams({ status }).toString();
  return `${basePath}?${search}`;
}

export function OrderStatusTabs({ selectedStatus, basePath = "/mypage" }: OrderStatusTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={`rounded-full border px-4 py-2 text-sm transition ${
          selectedStatus ? "border-gray-200 text-muted-foreground hover:border-gray-300" : "border-blue-500 bg-blue-500/10 text-blue-600"
        }`}
      >
        전체
      </Link>
      {orderStatusTabOptions.map(({ value: status }) => {
        const isActive = status === selectedStatus;
        return (
          <Link
            key={status}
            href={buildHref(status, basePath)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              isActive
                ? "border-blue-500 bg-blue-500/10 text-blue-600"
                : "border-gray-200 text-muted-foreground hover:border-gray-300"
            }`}
          >
            {getOrderStatusLabel(status)}
          </Link>
        );
      })}
    </div>
  );
}

