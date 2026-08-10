"use client";
import Button from "@/app/components/button/Button";
import { MemberCard } from "@/app/components/memberCard/MemberCard";
import MemberSkeleton from "@/app/components/memberSkeleton/MemberSkeleton";
import { Member } from "@/app/types/members";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MembersPage() {
  const { projectId } = useParams();
  const [members, setMembers] = useState<Member[] | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/project/${projectId}/members`);
        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }
        const result = (await response.json()) as Member[];
        setMembers(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error(error);
        setMembers([]);
      }
    };
    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  return (
    <section className="w-full p-2">
      <div className="flex items-center justify-between px-3">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-[30px] text-[#041B3C]">
            Project Members
          </h3>
        </div>
        <Button
          onClick={() => {}}
          displayText="Invite Members"
          className="hidden md:flex items-center gap-2 btn-primary w-fit "
        >
          <Image
            src={"/icons/plusIcon.svg"}
            alt="plus Icon"
            width={11}
            height={11}
            style={{ width: "11px", height: "11px" }}
          />
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

        {members === null ? (
          <MemberSkeleton />
        ) : members.length === 0 ? (
          <p className="px-4 py-6 text-[14px] text-[#434654]">No members yet</p>
        ) : (
          <MemberCard members={members} />
        )}
      </div>
    </section>
  );
}
