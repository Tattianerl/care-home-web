interface DashboardSkeletonProps {
  cardCount?: number;
  listCount?: number;
}

export function DashboardSkeleton({
  cardCount = 8,
  listCount = 3,
}: DashboardSkeletonProps) {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Cabeçalho */}
      <div>
        <div className="h-8 w-64 rounded bg-slate-200" />

        <div className="mt-3 h-4 w-96 rounded bg-slate-200" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: cardCount }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 w-28 rounded bg-slate-200" />

                <div className="h-8 w-16 rounded bg-slate-200" />
              </div>

              <div className="h-10 w-10 rounded-lg bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Listas */}
      <div
        className={`grid grid-cols-1 gap-6 ${
          listCount === 1
            ? "lg:grid-cols-1"
            : "lg:grid-cols-3"
        }`}
      >
        {Array.from({ length: listCount }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs"
          >
            <div className="mb-5 h-5 w-40 rounded bg-slate-200" />

            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, row) => (
                <div
                  key={row}
                  className="border-b border-slate-100 pb-3 last:border-0"
                >
                  <div className="h-4 w-40 rounded bg-slate-200" />

                  <div className="mt-2 h-3 w-28 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}