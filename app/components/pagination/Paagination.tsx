"use client";
import Image from "next/image";

function getPagination(currentPage: number, totalPages: number) {
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

export default function Pagination({
  limit,
  totalCount,
  currentPage,
  onPageChange,
  itemLabel = "active Projects",
}: {
  limit: number;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const showing = Math.min(limit, Math.max(totalCount - (currentPage - 1) * limit, 0));

  return (
    <div className="flex items-center justify-between text-[#434654] w-full">
      <div className="font-medium ">
        <p>
          Showing {showing} of {totalCount} {itemLabel}
        </p>
      </div>
      <div className="flex items-center gap-2.5 justify-between">
        <button
          className=" flex items-center justify-center border border-[#C3C6D64D] px-1 py-2.5 w-full h-8 disabled:cursor-not-allowed "
          disabled={currentPage === 1}
          onClick={() => {
            onPageChange(currentPage - 1);
          }}
        >
          <Image
            src={"/icons/backArrow.svg"}
            alt="back arrow"
            width={20}
            height={20}
            style={{ width: "10px", height: "10px" }}
          />
        </button>
        {getPagination(currentPage, totalPages).map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}`}>...</span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={
                currentPage === item
                  ? "bg-primary text-white w-full h-8 px-1 py-1.5"
                  : "bg-[#C3C6D64D] w-full px-1 py-1.5 h-8 text-black"
              }
            >
              {item}
            </button>
          ),
        )}
        <button
          className="flex items-center justify-center border border-[#C3C6D64D] px-1 py-2.5 w-full h-8  disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
          onClick={() => {
            onPageChange(currentPage + 1);
          }}
        >
          <Image
            src={"/icons/forwardArrow.svg"}
            alt="forward arrow"
            width={10}
            height={10}
            style={{ width: "10px", height: "10px" }}
          />
        </button>
      </div>
    </div>
  );
}
