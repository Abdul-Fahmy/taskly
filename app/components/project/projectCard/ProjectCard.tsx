import { Project } from "@/app/types/project";
import Link from "next/link";
import EditIcon from "@/app/assets/icons/Orion_edit.svg";

export default function ProjectCard({ project }: { project: Project }) {
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="w-full rounded-md bg-white p-4 flex flex-col justify-between items-start gap-4 h-[220px] shadow-sm">
      <div className="flex items-center justify-between w-full">
        <Link
          href={`/project/${project.id}/epics`}
          className="font-medium text-[18px]"
        >
          {project.name}
        </Link>
        <Link href={`/project/${project.id}/edit`}>
          <EditIcon />
        </Link>
      </div>
      <Link
        href={`/project/${project.id}/epics`}
        className="text-[14px] text-[#434654] line-clamp-2 "
      >
        {project.description}
      </Link>
      <div className="flex items-center justify-between w-full">
        <span className="uppercase text-[11px] font-bold">created at</span>
        <span>{formatDate(project.created_at)}</span>
      </div>
    </div>
  );
}
