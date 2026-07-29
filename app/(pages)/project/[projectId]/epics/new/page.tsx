"use client";
import EpicForm from "@/app/components/epicForm/EpicForm";
import { breadcrumbMap } from "@/app/constant/breadcrumbs";
import { useAppSelector } from "@/app/hooks/store.hooks";
import { generateBreadcrumbs } from "@/app/services/breadcrum";
import { useParams, usePathname } from "next/navigation";

export default function NewEpicPage() {
  const pathname = usePathname();
  //   const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();
  const project = useAppSelector((state) =>
    state.project.projects.find((project) => project.id === projectId),
  );
  const breadcrumbs = generateBreadcrumbs(pathname, breadcrumbMap, {
    [projectId]: project?.name || projectId,
  });
  return (
    <>
      <div className="hidden md:flex flex-col gap-4 items-start justify-start pt-6 pl-6">
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
        <h3 className="font-bold text-[36px]">Create New Epic</h3>
        <p className="text-[#434654] text-[16px]">
          Define a major project phase or high-level milestone to group
          <br /> related tasks and track architectural progress.
        </p>
      </div>
      <EpicForm />
    </>
  );
}
