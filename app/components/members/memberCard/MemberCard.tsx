import { Member } from "@/app/types/members";
import DotsIcon from '@/app/assets/icons/dots.svg'

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function MemberCard({ members }: { members: Member[] }) {
  return (
    <>
      {members.map((member) => {
        const name = member.metadata?.name || member.email;
        const initials = getInitials(name);

        return (
          <div
            key={member.member_id}
            className="flex md:grid grid-cols-[1fr_120px_64px] items-center gap-4 border-b border-black/5 px-4 py-4 last:border-b-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-container text-white">
                <span className="text-sm font-bold uppercase">
                  {initials || "U"}
                </span>
              </div>
              <div className="flex min-w-0 flex-col items-start">
                <p className="truncate text-[16px] font-medium text-[#041B3C]">
                  {name}
                </p>
                <span className="truncate text-[14px] text-[#434654]">
                  {member.email}
                </span>
              </div>
            </div>

            <span className="text-[14px] capitalize bg-primary-container text-white rounded-sm  w-fit px-2 py-1">
              {member.role}
            </span>

            <div className="flex justify-end">
              {member.role !== "owner" ? (
                <button
                  type="button"
                  aria-label={`Actions for ${name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-black/5"
                >
                  <DotsIcon/>
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </>
  );
}
