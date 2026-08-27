export default function loading() {
  return (
    <div className="animate-pulse">
      <div className="w-full rounded-xl border border-[#E5E7EB] bg-white p-5 animate-pulse">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* Epic icon */}
            <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-200" />

            <div className="min-w-0 flex-1 space-y-2">
              {/* Epic title */}
              <div className="h-5 w-3/5 rounded bg-gray-200" />

              {/* Epic ID */}
              <div className="h-3 w-1/4 rounded bg-gray-200" />
            </div>
          </div>

          {/* More icon */}
          <div className="h-6 w-6 rounded bg-gray-200" />
        </div>

        {/* Description */}
        <div className="mt-5 space-y-2">
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-5/6 rounded bg-gray-200" />
        </div>

        {/* Bottom section */}
        <div className="mt-6 flex items-center justify-between">
          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200" />

            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-gray-200" />
              <div className="h-2 w-28 rounded bg-gray-200" />
            </div>
          </div>

          {/* Status */}
          <div className="h-7 w-20 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
