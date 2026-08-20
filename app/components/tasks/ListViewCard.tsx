"use client";
import { getInitials } from "@/app/constant/getInitials";
import { Task, TaskStatus } from "@/app/types/task";
import { useState } from "react";
import Modal from "../modal/Modal";
import TaskDetailsPopup from "./TaskDetailsPopup";

export default function ListViewCard({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);

  const statusColors: Record<TaskStatus, string> = {
    TO_DO: "bg-[#D7E2FF]",
    IN_PROGRESS: "bg-[#CDDDFF]",
    BLOCKED: "bg-[#FFDAD6]",
    IN_REVIEW: "bg-[#4F5F7B]",
    READY_FOR_QA: "bg-purple-500",
    REOPENED: "bg-orange-500",
    READY_FOR_PRODUCTION: "bg-pink-500",
    DONE: "bg-[#82F9BE]",
  };

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  return (
    <div
      key={task.id}
      className={`grid grid-cols-[120px_1fr_160px_140px_180px] items-center gap-2 bg-white px-4 py-4 text-sm hover:bg-gray-50 cursor-pointer
     
    `}
      onClick={() => setOpen(true)}
      role="button"
    >
      <span className="text-primary text-[12px]">{task.task_id}</span>

      <span className="truncate font-medium text-gray-900">{task.title}</span>

      <span
        className={`text-gray-700 w-fit p-1 rounded-md text-[11px] font-bold ${statusColors[task.status as TaskStatus] ?? ""}`}
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
      <Modal isOpen={open} onClose={()=>setOpen(false)} width='896px'><TaskDetailsPopup taskId={task.id} onClose={()=>setOpen(false)} /></Modal>

    </div>
  );
}
