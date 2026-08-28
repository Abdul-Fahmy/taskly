"use client";
import Button from "@/app/components/button/Button";
import InviteMemberPopup from "@/app/components/members/inviteMember/InviteMemberPopup";
import { MemberCard } from "@/app/components/members/memberCard/MemberCard";
import MemberSkeleton from "@/app/components/members/memberSkeleton/MemberSkeleton";
import Modal from "@/app/components/modal/Modal";
import { breadcrumbMap } from "@/app/constant/breadcrumbs";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { generateBreadcrumbs } from "@/app/services/breadcrum";
import { fetchMembers } from "@/app/store/features/members.slice";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import PlusIcon from "@/app/assets/icons/plusIcon.svg";

export default function MembersPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const { members, status } = useAppSelector((state) => state.members);
  const pathname = usePathname();
  const project = useAppSelector((state) => state.project.project);
  const breadcrumbs = generateBreadcrumbs(pathname, breadcrumbMap, {
    [projectId]: project?.name || "projectId",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMembers({ projectId }));
  }, [projectId, dispatch]);

  return (
    <section className="w-full p-2">
      <span className="hidden md:block font-bold uppercase text-[12px] flex items-center gap-1 ">
        {breadcrumbs.map((item, index) => (
          <span key={item}>
            {index > 0 && <span className="mx-2 text-neutral-400">&gt;</span>}

            <span
              className={
                index === breadcrumbs.length - 1
                  ? "text-black"
                  : "text-[#43465499]"
              }
            >
              {item}
            </span>
          </span>
        ))}
      </span>
      <div className="flex items-center justify-between px-3">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-[30px] text-[#041B3C]">
            Project Members
          </h3>
        </div>
        <Button
          onClick={() => {
            setOpen(true);
          }}
          displayText="Invite Members"
          className="hidden md:flex items-center gap-2 btn-primary w-fit "
        >
          <PlusIcon />
        </Button>
      </div>

      <div className=" max-w-2xl mx-auto rounded-md bg-white mt-10">
        <div className="hidden md:grid grid-cols-[1fr_120px_64px] items-center gap-4 border-b border-black/10 px-4 py-3">
          <span className="text-[11px] font-bold uppercase text-[#4F5F7B]">
            Member
          </span>
          <span className="text-[11px] font-bold uppercase text-[#4F5F7B]">
            Role
          </span>
          <span className="text-right text-[11px] font-bold uppercase text-[#4F5F7B]">
            Action
          </span>
        </div>

        {status === "loading" ? (
          <MemberSkeleton />
        ) : members.length === 0 ? (
          <p className="px-4 py-6 text-[14px] text-[#434654]">No members yet</p>
        ) : (
          <MemberCard members={members} />
        )}
      </div>

      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        width="448px"
      >
        <InviteMemberPopup
          onClose={() => {
            setOpen(false);
          }}
        />
      </Modal>
    </section>
  );
}
