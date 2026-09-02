import { TasksByProjectResponse } from "@/app/types/myStatisticsParams";

type AllProjectCardProps = {
  projects: TasksByProjectResponse | null;
};

export default function AllProjectCard({ projects }: AllProjectCardProps) {
  return (
    <div className="w-full bg-white p-6 rounded-md shadow-md">
        <h3 className="text-lg font-bold text-[#041B3C] mb-8">All Projects</h3>
        <div className="flex flex-col gap-2">   
            {projects && projects.length > 0 ? (
                projects.map((project) => (
                    <div key={project.project_id} className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#041B3C]">{project.project_name}</h4>
                        <p className="text-sm text-[#434654]">{project.tasks_count}</p>
                    </div>
                ))
            ) : (
                <p className="text-sm text-[#434654]">No projects found</p>
            )}
            {projects?.map((project) => (
                <div key={project.project_id} className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#041B3C]">{project.project_name}</h4>
                    <p className="text-sm text-[#434654]">{project.tasks_count}</p>
                </div>
            ))}
        </div>
    </div>
  )
}
