import { Project } from "@/app/types/project";

export default function ProjectCard({project}:{project:Project}){
     const formatDate = (date: string) => {
        return new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(date));
      };

    return(
        <div className="w-full rounded-md bg-white p-4 flex flex-col justify-between items-start gap-4 h-[220px]">
            <h1 className="font-medium text-[18px]">{project.name}</h1>
            <p className="text-[14px] text-[#434654] ">{project.description}</p>
            <div className="flex items-center justify-between w-full">
                <span className="uppercase text-[11px] font-bold">created at</span>
                <span>{formatDate(project.created_at)}</span>
            </div>
        </div>
    )
}