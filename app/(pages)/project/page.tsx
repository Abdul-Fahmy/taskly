"use client";

import Button from "@/app/components/button/Button";
import ProjectCardSkeleton from "@/app/components/cardSkeleton/CardSkeleton";
import ProjectCard from "@/app/components/projectCard/ProjectCard";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchProjects } from "@/app/store/features/project.slice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Project() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {projects,status}  = useAppSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (status === 'loading') {
  
      return (
        <section className="w-full p-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        </section>
      );
    
  }
  return (
    <section className="w-full p-2">
      {projects ? (
        <>
          <div className="flex items-center justify-between px-3">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-[30px] text-[#041B3C]">
                Projects
              </h3>
              <p className="text-[#434654] text-[16px]">
                Manage and curate your projects
              </p>
            </div>
            <Button
              onClick={() => {
                router.push("/project/add");
              }}
              displayText="Create New Project"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 pb-6 ">
            {projects.map((project) => (
<Link href={`/project/${project.id}/epics`} key={project.id}>
<ProjectCard  project={project} />
</Link>            ))}
            <Link
              href={"/project/add"}
              className="hidden md:flex flex-col w-full items-center justify-center gap-2"
            >
              <div className="p-4 bg-[#F1F3FF]">
                <Image
                  src={"/icons/roundedPlus.svg"}
                  alt="rounded plus icon"
                  width={20}
                  height={20}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>
              <p className="text-[#434654] font-bold text-[14px]">
                ADD PROJECT
              </p>
            </Link>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => {
                router.push("/project/add");
              }}
              displayText=""
              className="flex md:hidden items-center gap-2 btn-primary w-fit "
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
        </>
      ) : (
        <>
          <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-4">
            <Image
              src={"/noProjects.svg"}
              alt="no projects found"
              width={288}
              height={288}
              style={{ width: "288px", height: "288px" }}
            />
            <h3 className="text-[36px] font-semibold">No Projects </h3>
            <p className="text-[18px] text-[#434654] ">
              You don’t have any projects yet. Start by defining your first
              architectural workspace to begin tracking tasks and epics.
            </p>
            <Link
              href={"/project/add"}
              className="btn-primary w-fit flex items-center gap-2"
            >
              <Image
                src={"/icons/whitPlus.svg"}
                alt="rounded plus icon"
                width={20}
                height={20}
                style={{ width: "20px", height: "20px" }}
              />
              Create New Project
            </Link>
          </div>
        </>
        
      )}
    </section>
  );
}
