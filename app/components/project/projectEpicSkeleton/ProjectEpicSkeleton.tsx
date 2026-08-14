const ProjectEpicsSkeleton = () => {
  return (
    <div className="pt-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between px-3">
        <div className="flex flex-col gap-2">
          <div className="h-9 w-56 rounded bg-gray-200" />
        </div>

        <div className="hidden h-11 w-44 rounded-md bg-gray-200 md:block" />
      </div>

      {/* Epic Cards */}
      <div className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            {/* Title */}
            <div className="mb-4 h-6 w-3/4 rounded bg-gray-200" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="h-8 w-24 rounded-md bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectEpicsSkeleton;
