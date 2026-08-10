import { breadcrumbMap } from "@/app/constant/breadcrumbs";
import { useAppSelector } from "@/app/hooks/store.hooks";
import { generateBreadcrumbs } from "@/app/services/breadcrum";
import { useParams, usePathname } from "next/navigation"

export default function NewTaskPage(){
    const {projectId} = useParams<{projectId: string}>();
    const pathname = usePathname();
    const project = useAppSelector((state) =>
        state.project.projects.find((project) => project.id === projectId),
      );
      const breadcrumbs = generateBreadcrumbs(pathname, breadcrumbMap
        , {
        [projectId]: project?.name || projectId,
      });
    
    return(
        <div className="">
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
        <h3 className="font-bold text-[36px]">Create New Task</h3>
      </div>
        </div>
    )
}