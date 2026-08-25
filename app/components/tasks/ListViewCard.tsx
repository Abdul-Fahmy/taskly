"use client";
import { getInitials } from "@/app/constant/getInitials";
import { Task, TaskStatus } from "@/app/types/task";
import { useState } from "react";
import TaskDetailsModal from "./taskDetails/TaskDetailsModal";
import TaskCardForMobile from "./TaskCardForMobile";

export default function ListViewCard({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);

  const statusColors: Record<TaskStatus, string> = {
    TO_DO: "bg-[#E2E8F0]",                // Slate
    IN_PROGRESS: "bg-[#DBEAFE]",          // Blue
    BLOCKED: "bg-[#FEE2E2]",              // Red
    IN_REVIEW: "bg-[#EDE9FE]",             // Violet
    READY_FOR_QA: "bg-[#FEF3C7]",          // Amber
    REOPENED: "bg-[#FFEDD5]",              // Orange
    READY_FOR_PRODUCTION: "bg-[#FCE7F3]", // Pink
    DONE: "bg-[#DCFCE7]",                 // Green
  };

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  return (
    <>
      <div
        className="block md:hidden px-2"
        onClick={() => setOpen(true)}
        role="button"
      >
        <TaskCardForMobile task={task} />
        <TaskDetailsModal
          taskId={task.id}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      </div>
      <div
        key={task.id}
        className={`hidden md:grid grid-cols-[120px_minmax(0,1fr)_160px_140px_180px] items-center gap-2 bg-white px-4 py-4 text-sm hover:bg-gray-50 cursor-pointer
     
    `}
        onClick={() => setOpen(true)}
        role="button"
      >
        <span className="text-primary text-[12px]">{task.task_id}</span>

        <span className="truncate font-medium text-gray-900">{task.title}</span>

        <span
  className={`w-fit whitespace-nowrap rounded-md p-1 text-[11px] font-bold ${
    statusColors[task.status as TaskStatus] ?? ""
  }`}
>
  {formatStatus(task.status)}
</span>

        <span className="text-gray-500">
          {task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}
        </span>

        <div className="flex items-center gap-2">
          {task.assignee ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:flex items-center justify-center bg-[#DAE2FF] text-[12px] w-6 h-6 rounded-full">
                {getInitials(task.assignee.name) || "U"}
              </span>

              <span className="truncate text-gray-700">
                {task.assignee.name || "Unassigned"}
              </span>
            </div>
          ) : (
            <span className="text-gray-400">Unassigned</span>
          )}
        </div>
        <TaskDetailsModal
          taskId={task.id}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      </div>
    </>
  );
}
