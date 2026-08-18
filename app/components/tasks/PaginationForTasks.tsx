"use client";

import Image from "next/image";
import Back from '@/app/assets/icons/backPagination.svg'
import Forward from '@/app/assets/icons/forwardPagination.svg'

interface PaginationForTasksProps {
  limit: number;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function PaginationForTasks({
  limit,
  totalCount,
  currentPage,
  onPageChange,
}: PaginationForTasksProps) {
  const totalPages = Math.ceil(totalCount / limit);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-end gap-3 text-[#434654]">
      {/* Previous */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-8 w-8 items-center justify-center  disabled:cursor-not-allowed "
      >
       <Back />
      </button>

      {/* Page X of Y */}
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-8 w-8 items-center justify-center   disabled:cursor-not-allowed "
      >
       <Forward/>
      </button>
    </div>
  );
}