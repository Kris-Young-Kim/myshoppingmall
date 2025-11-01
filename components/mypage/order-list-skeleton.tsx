export function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex justify-between">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-6 w-20 rounded-full bg-gray-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-4 w-1/4 rounded bg-gray-200" />
          </div>
          <div className="flex justify-end">
            <div className="h-9 w-24 rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

