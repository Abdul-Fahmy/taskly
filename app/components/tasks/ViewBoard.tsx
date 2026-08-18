'use client'

import { statusOptions } from "@/app/constant/taskStatus";
import { TaskColumn } from "./TaskColumn";
import { useParams, useRouter } from "next/navigation";

export default function ViewBoard() {
    const router = useRouter();
    const { projectId } = useParams<{ projectId: string }>();

 

  return (
    <div className="flex gap-4 overflow-x-scroll">
    {statusOptions.map((status) => {
      return (
        <TaskColumn
          key={status.value}
          status={status}
          onAddTask={() => {
            router.push(
              `/project/${projectId}/tasks/new?status=${status.value}`,
            );
          }}
        />
      );
    })}
  </div>  )
}
