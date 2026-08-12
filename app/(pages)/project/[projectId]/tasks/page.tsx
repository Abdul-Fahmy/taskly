"use client";
import Input from "@/app/components/input/Input";
import { breadcrumbMap } from "@/app/constant/breadcrumbs";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { generateBreadcrumbs } from "@/app/services/breadcrum";
import { fetchProjects } from "@/app/store/features/project.slice";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function TasksPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) =>
    state.project.projects.find((project) => project.id === projectId),
  );
  const breadcrumbs = generateBreadcrumbs(pathname, breadcrumbMap, {
    [projectId]: project?.name || "projectId",
  });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch, projectId]);

  return (
    <div className="">
      <div className="hidden md:flex flex-col gap-2 items-start justify-start pt-6 pl-6">
        <span className="font-bold uppercase text-[12px] flex items-center gap-1 ">
          {breadcrumbs.map((item, index) => (
            <span key={item}>
              {index > 0 && <span className="mx-2 text-neutral-400">&gt;</span>}

              <span
                className={
                  index === breadcrumbs.length - 1
                    ? "text-primary"
                    : "text-[#43465499]"
                }
              >
                {item}
              </span>
            </span>
          ))}
        </span>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-[36px]">Active Workboard</h3>
            <p className="text-text-secondary text-[14px]">
              Curating Project Alpha`&apos;`s production pipeline and
              milestones.
            </p>
          </div>
          <div className="flex items-center">
            <Input type="search" placeholder="Search tasks..." />
            <button></button>
          </div>
        </div>
      </div>
    </div>
  );
}
