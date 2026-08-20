export default function TaskDetailsPopupSkeleton() {
    return (
      <div className="flex w-full gap-4 bg-surface-low rounded-lg overflow-hidden animate-pulse">
        {/* Left side */}
        <div className="flex flex-col w-2/3 bg-white">
          {/* Header */}
          <div className="flex flex-col py-6 px-8 items-start gap-3 border-b border-[#E8EDFF]">
            <div className="flex items-center gap-2 w-full">
              {/* Task ID */}
              <div className="h-8 w-20 rounded-md bg-gray-200" />
  
              {/* Epic select */}
              <div className="h-9 w-[255px] rounded-md bg-gray-200" />
            </div>
  
            {/* Title */}
            <div className="h-9 w-3/4 rounded-md bg-gray-200" />
          </div>
  
          {/* Description */}
          <div className="py-8 px-8 flex flex-col gap-2">
            <div className="h-3 w-24 rounded bg-gray-200" />
  
            <div className="w-full h-[240px] rounded-md bg-gray-200" />
          </div>
  
          {/* Footer */}
          <div className="mt-auto bg-surface-low flex items-center justify-between py-6 px-8">
            {/* Copy link */}
            <div className="h-5 w-24 rounded bg-gray-200" />
  
            {/* Close button */}
            <div className="h-9 w-16 rounded-sm bg-gray-200" />
          </div>
        </div>
  
        {/* Right side */}
        <div className="w-1/3 px-8 py-6 flex flex-col items-start gap-10">
          {/* Status */}
          <div className="w-full flex flex-col gap-2">
            <div className="h-3 w-14 rounded bg-gray-200" />
            <div className="h-9 w-[255px] rounded-md bg-gray-200" />
          </div>
  
          {/* Assignee / Reporter */}
          <div className="w-full flex flex-col gap-6 border-b border-[#C3C6D633] pb-6">
            {/* Assignee */}
            <div className="w-full flex flex-col gap-2">
              <div className="h-3 w-16 rounded bg-gray-200" />
              <div className="h-9 w-[255px] rounded-md bg-gray-200" />
            </div>
  
            {/* Reporter */}
            <div className="w-full flex flex-col gap-2">
              <div className="h-3 w-16 rounded bg-gray-200" />
  
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200" />
                <div className="h-4 w-28 rounded bg-gray-200" />
              </div>
            </div>
          </div>
  
          {/* Due date */}
          <div className="flex flex-col w-full gap-4">
            <div className="h-3 w-16 rounded bg-gray-200" />
  
            {/* Date input */}
            <div className="w-full h-10 rounded-md bg-gray-200" />
  
            {/* Created at */}
            <div className="flex items-center justify-between w-full">
              <div className="h-3 w-20 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }