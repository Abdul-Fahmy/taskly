const MemberSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_120px_64px] items-center gap-4 border-b border-black/5 px-4 py-4 last:border-b-0 animate-pulse"
        >
          <div className="flex min-w-0 items-center gap-3">
            {/* Avatar */}
            <div className="h-10 w-10 shrink-0 rounded-md bg-gray-200" />

            {/* Name & Email */}
            <div className="flex min-w-0 flex-col gap-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-3 w-48 rounded bg-gray-200" />
            </div>
          </div>

          {/* Role */}
          <div className="h-4 w-16 rounded bg-gray-200" />

          {/* Action Button */}
          <div className="flex justify-end">
            <div className="h-8 w-8 rounded-md bg-gray-200" />
          </div>
        </div>
      ))}
    </>
  );
};

export default MemberSkeleton;
