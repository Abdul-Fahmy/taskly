"use client";
import Button from "@/app/components/button/Button";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
export default function EpicsPage() {
  const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <div className="flex items-center justify-between px-3">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-[30px] text-[#041B3C]">
          Project Epics
        </h3>
      </div>
      <Button
        onClick={() => {
          router.push(`/project/${projectId}/epics/new`);
        }}
        displayText="Create New Epic"
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
  );
}
