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
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { generateBreadcrumbs } from "@/app/services/breadcrum";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";
import Select, { SingleValue } from "react-select";

export default function TasksPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchTerm, setSearchTerm] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const project = useAppSelector((state) => state.project.project);

  const isMobile = useMediaQuery("(max-width: 767px)");

  const viewParam = searchParams.get("view");

  const view: "board" | "list" = viewParam === "list" ? "list" : "board";

  const currentView = isMobile ? "list" : view;

  const breadcrumbs = generateBreadcrumbs(pathname, breadcrumbMap, {
    [projectId]: project?.name || "projectId",
  });

  const handleViewChange = (option: SingleValue<ViewOption>) => {
    if (!option) return;

    router.push(`${pathname}?view=${option.value}`);
  };

  return (
    <div>
      <div className="flex flex-col gap-2 items-start justify-start pt-6 md:pl-6 w-full">
        <span className=" hidden md:block font-bold uppercase text-[12px] flex items-center gap-1">
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

        <div className="md:flex-row flex-col flex items-center justify-between w-full md:mx-auto">
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <h3 className="font-bold text-[36px] px-4 md:px-0">
              Active Workboard
            </h3>

            <p className="md:block hidden text-text-secondary text-[14px]">
              Curating Project Alpha&apos;s production pipeline and milestones.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-1/2 px-4">
            <Input
              type="search"
              placeholder="Search tasks..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />

            <div className="w-1/2 hidden md:block">
              <Select<ViewOption, false>
                instanceId="tasks-view"
                classNames={selectClassNames}
                unstyled
                options={viewOptions}
                components={{
                  Option: CustomOption,
                  SingleValue: CustomSingleValue,
                }}
                value={viewOptions.find(
                  (option) => option.value === currentView,
                )}
                onChange={handleViewChange}
                name="view"
              />
            </div>
          </div>
        </div>
        <div className="md:hidden block mt-4 w-full px-4 ">
          <Link
            href={`/project/${projectId}/tasks/new`}
            className="md:hidden block w-full px-4 text-center w-full  btn-primary text-white py-2 rounded-md  mt-4"
          >
            Create Task
          </Link>
        </div>
      </div>

      {/* View */}
      {currentView === "list" ? (
        <ListView searchTerm={searchTerm} />
      ) : (
        <ViewBoard searchTerm={searchTerm} />
      )}
    </div>
  );
}
