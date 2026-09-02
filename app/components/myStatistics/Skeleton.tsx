export default function MyStatisticsSkeleton() {
    return (
      <div className="flex flex-col gap-8 p-8 animate-pulse">
        {/* Header */}
        <div className="flex w-full flex-col items-start gap-2">
          <div className="h-9 w-48 rounded-md bg-gray-200" />
          <div className="h-5 w-80 rounded-md bg-gray-200" />
        </div>
  
        {/* Filters */}
        <div className="flex w-full justify-between rounded-md bg-surface-highest p-2">
          {/* Date range picker */}
          <div className="h-10 w-56 rounded-md bg-gray-200" />
  
          {/* Project + Status */}
          <div className="flex w-1/2 items-center gap-2">
            <div className="h-10 w-full rounded-md bg-gray-200" />
            <div className="h-10 w-full rounded-md bg-gray-200" />
          </div>
        </div>
  
        {/* Statistics cards */}
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex h-24 items-center justify-between rounded-md bg-white p-4"
            >
              <div className="flex flex-col gap-3">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-8 w-12 rounded bg-gray-200" />
              </div>
  
              <div className="h-10 w-10 rounded-md bg-gray-200" />
            </div>
          ))}
        </div>
  
        {/* Days cards */}
        <div className="grid h-[420px] grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col rounded-md bg-white p-4"
            >
              <div className="h-4 w-10 rounded bg-gray-200" />
              <div className="mt-2 h-6 w-16 rounded bg-gray-200" />
  
              <div className="mt-auto h-10 w-12 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }