export default function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl  p-5 animate-pulse">
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />

      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
      </div>

      <div className="h-4 w-24 bg-gray-200 rounded mt-6" />
    </div>
  );
}
