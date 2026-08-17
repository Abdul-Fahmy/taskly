import { getInitials } from "@/app/constant/getInitials";
import { Epic } from "@/app/types/epicResponse";
import Image from "next/image";

export function EpicCard({
  epic,
  children,
  onClick,
}: {
  epic: Epic;
  children?: React.ReactNode;
  onClick: () => void;
}) {
  const initials = getInitials(epic.assignee?.name ?? "");
  const formatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(epic.created_at));
  return (
    <div
      role="button"
      className="flex flex-col items-start gap-4 p-4 rounded-lg border-l-4 border-[#004E32] bg-white cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full">
        <p className="w-fit py-1 px-2.5 bg-[#82F9BE]">{epic.epic_id}</p>
        <Image
          src={"/icons/dots.svg"}
          alt="dots"
          width={4}
          height={16}
          style={{ width: "4px", height: "16px" }}
        />
      </div>
      <p className="font-semibold text-xl ">{epic.title}</p>
      <div className="flex items-start flex-col w-full">
        <div className="flex items-start gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-container text-white">
            <span className="text-lg font-bold uppercase">
              {initials || "U"}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <p>Assignee</p>
            <p>{epic.assignee?.name ?? "Unassigned"}</p>
          </div>
        </div>
        <div className="w-full pt-2 border-t border-surface-low flex items-center justify-between text-surface-highest">
          <div className="flex items-center gap-2">
            <Image
              src={"/icons/user.svg"}
              alt="user"
              width={11}
              height={10}
              style={{ width: "11px", height: "10px" }}
            />
            <p className="text-[#434654CC]">
              Created by:{" "}
              <span className="text-black">{epic.created_by.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={"/icons/date.svg"}
              alt="date icon"
              width={10}
              height={12}
              style={{ width: "10.5px", height: "12px" }}
            />
            <p className="text-[#434654CC]">{formatted}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
