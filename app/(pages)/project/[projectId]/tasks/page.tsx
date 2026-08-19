"use client";
import Input from "@/app/components/input/Input";
import {
  CustomOption,
  CustomSingleValue,
  ViewOption,
  viewOptions,
} from "@/app/components/tasks/CustomOptions";
import { ListView } from "@/app/components/tasks/ListView";
import ViewBoard from "@/app/components/tasks/ViewBoard";
import { breadcrumbMap } from "@/app/constant/breadcrumbs";
import { selectClassNames } from "@/app/constant/classesForSelect";
import { useAppSelector } from "@/app/hooks/store.hooks";
import { generateBreadcrumbs } from "@/app/services/breadcrum";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import Select, { SingleValue } from "react-select";


export default function TasksPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const project = useAppSelector((state) => state.project.project);
  const [view, setView] = useState<"board" | "list">("board");

  const breadcrumbs = generateBreadcrumbs(pathname, breadcrumbMap, {
    [projectId]: project?.name || "projectId",
  });

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
                    ? "text-black"
                    : "text-[#43465499]"
                }
              >
                {item}
              </span>
            </span>
          ))}
        </span>
        <div className="flex items-center justify-between w-full mx-auto">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-[36px]">Active Workboard</h3>
            <p className="text-text-secondary text-[14px]">
              Curating Project Alpha&apos;s production pipeline and milestones.
            </p>
          </div>
          <div className="flex items-center gap-2 w-1/2 px-4 ">
            <Input type="search" placeholder="Search tasks..." />
            <div className="w-1/2">
              <Select<ViewOption, false>
                instanceId="tasks-view"
                classNames={selectClassNames}
                unstyled
                options={viewOptions}
                components={{
                  Option: CustomOption,
                  SingleValue: CustomSingleValue,
                }}
                value={viewOptions.find((option) => option.value === view)}
                onChange={(option: SingleValue<ViewOption>) => {
                  if (option) {
                    setView(option.value);
                  }
                }}
                name="view"
              />
            </div>
          </div>
        </div>
      </div>
      {view === "board" && <ViewBoard key={projectId} />}
      {view === "list" && <ListView />}
    </div>
  );
}
