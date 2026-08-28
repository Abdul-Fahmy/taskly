import BackArrow from "@/app/assets/icons/backArrow.svg";
import ForwardArrow from "@/app/assets/icons/forwardArrow.svg";
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
  const totalPages = Math.ceil(totalCount / limit);
  const showing = Math.min(currentPage * limit, totalCount);
  const buttonClass =
    "flex items-center justify-center w-8 h-8 shrink-0 rounded-sm";
  return (
    <div className="flex items-center justify-between text-[#434654] w-full pb-10">
      <div className="font-medium">
        <p>
          Showing {showing} of {totalCount} {itemLabel}
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className={`${buttonClass}  border border-[#C3C6D64D] disabled:cursor-not-allowed`}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <BackArrow />
        </button>
        {getPagination(currentPage, totalPages).map((item, index) =>
          item === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="flex items-center justify-center w-8 h-8 shrink-0"
            >
              ...
            </span>
          ) : (
            <button
              type="button"
              key={item}
              onClick={() => onPageChange(item)}
              className={`${buttonClass} ${currentPage === item ? "bg-primary text-white" : "bg-[#C3C6D64D] text-black"}`}
            >
              {item}
            </button>
          ),
        )}{" "}
        <button
          type="button"
          className={`${buttonClass} border border-[#C3C6D64D] disabled:cursor-not-allowed`}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ForwardArrow />
        </button>
      </div>
    </div>
  );
}
