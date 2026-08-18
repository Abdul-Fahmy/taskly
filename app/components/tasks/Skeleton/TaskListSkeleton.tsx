const TaskListSkeleton = () => {
    return (
      <div className="w-full overflow-hidden mt-8 animate-pulse">
        {/* Header */}
        <div className="grid grid-cols-[120px_1fr_160px_140px_180px] items-center bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500">
          <span className="h-4 w-16 rounded bg-gray-200" />
          <span className="h-4 w-12 rounded bg-gray-200" />
          <span className="h-4 w-14 rounded bg-gray-200" />
          <span className="h-4 w-16 rounded bg-gray-200" />
          <span className="h-4 w-16 rounded bg-gray-200" />
        </div>
  
        {/* Rows */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className={`grid grid-cols-[120px_1fr_160px_140px_180px] items-center gap-2 bg-white px-4 py-4 ${
              index !== 7 ? "border-b border-[#F1F3FF]" : ""
            }`}
          >
            {/* Task ID */}
            <span className="h-3 w-16 rounded bg-gray-200" />
  
            {/* Title */}
            <span className="h-4 w-3/4 rounded bg-gray-200" />
  
            {/* Status */}
            <span className="h-6 w-20 rounded-md bg-gray-200" />
  
            {/* Due Date */}
            <span className="h-4 w-24 rounded bg-gray-200" />
  
            {/* Assignee */}
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-full bg-gray-200" />
              <span className="h-4 w-24 rounded bg-gray-200" />
            </div>
          </div>
        ))}
  
        {/* Pagination */}
        <div className="flex items-center justify-end bg-white rounded-md border-b border-[#F1F3FF] p-4">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded bg-gray-200" />
            <span className="h-8 w-8 rounded bg-gray-200" />
            <span className="h-8 w-8 rounded bg-gray-200" />
            <span className="h-8 w-8 rounded bg-gray-200" />
            <span className="h-8 w-8 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  };
  
  export default TaskListSkeleton;