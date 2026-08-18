export default function TaskColumnSkeleton() {
  return (
    <div className="flex min-w-72 shrink-0 animate-pulse flex-col">
      <div className="flex items-center justify-between p-3">
        <div className="h-5 w-28 rounded bg-gray-200" />
        <div className="h-7 w-7 rounded bg-gray-200" />
      </div>
      <div className="flex flex-col gap-2 p-3 pt-0">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 rounded-lg bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
