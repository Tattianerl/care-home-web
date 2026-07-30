export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Cabeçalho */}
      <div>
        <div className="h-8 w-64 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-96 rounded bg-slate-200" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white p-6 shadow"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 w-28 rounded bg-slate-200" />
                <div className="h-8 w-16 rounded bg-slate-200" />
              </div>

              <div className="h-12 w-12 rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Listas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white p-6 shadow"
          >
            <div className="mb-5 h-5 w-40 rounded bg-slate-200" />

            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, row) => (
                <div
                  key={row}
                  className="border-b pb-3 last:border-0"
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