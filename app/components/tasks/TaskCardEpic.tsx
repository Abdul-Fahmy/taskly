"use client";
import { getInitials } from "@/app/constant/getInitials";
import { Task } from "@/app/types/task";

export default function TaskCardEpic({ task }: { task: Task }) {
  const initials = getInitials(task.created_by.name || "U");
  const dueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No due date";
  return (
    <div className="flex items-center justify-between w-full border border-gray-200 rounded-md p-3">
      <div className="flex flex-col gap-2">
        <p>{task.title}</p>
        <div className="flex items-center gap-2">
          <p className="bg-primary text-white rounded-full px-2 py-1">
            {initials}
          </p>
          <p>{task.created_by.name ?? "user"}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="uppercase text-[10px] font-700">Due date</p>
        <span>{dueDate}</span>
      </div>
    </div>
  );
}
