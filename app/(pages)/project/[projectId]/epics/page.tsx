"use client";
import Button from "@/app/components/button/Button";
import EmptyEpic from "@/app/components/emptyEpic/EmptyEpic";
import { EpicCard } from "@/app/components/epicCard/EpicCard";
import ProjectEpicsSkeleton from "@/app/components/projectEpicSkeleton/ProjectEpicSkeleton";
import { Epic } from "@/app/types/epicResponse";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function EpicsPage() {
  const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();
  const [epics, setEpics] = useState<Epic[] | null>(null);

  useEffect(() => {
    const fetchEpics = async () => {
      try {
        const response = await fetch(`/api/project/${projectId}/epics`);
        if (!response.ok) {
          throw new Error("Failed to fetch epics");
        }
        const data = await response.json();

        setEpics(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEpics();
  }, [projectId]);

  if (!epics) {
    return <ProjectEpicsSkeleton />;
  }
  if (epics.length === 0) {
    return <EmptyEpic />;
  }

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between px-3">
        <div className="flex flex-col gap-2 ">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {epics.map((epic) => (
          <EpicCard key={epic.id} epic={epic} />
        ))}
      </div>
    </div>
  );
}
