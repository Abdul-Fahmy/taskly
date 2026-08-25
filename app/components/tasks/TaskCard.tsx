"use client";

import { getInitials } from "@/app/constant/getInitials";
import { Task } from "@/app/types/task";
import Calendar from "@/app/assets/icons/date.svg";
import { useState } from "react";
import TaskDetailsModal from "./taskDetails/TaskDetailsModal";
import { useDraggable } from "@dnd-kit/react";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [open, setOpen] = useState(false);

  const initials = getInitials(task.created_by.name || "U");

  const createdAt = task.created_at
    ? new Date(task.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "No created date";

  const { ref, handleRef, isDragging } = useDraggable({
    id: `task-${task.id}`,
    data: {
      type: "task",
      task,
      status: task.status,
    },
  });

  return (
    <div
      ref={ref}
      className={`
        rounded-md
        transition-opacity
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      <div
        className="flex cursor-grab flex-col gap-4 shadow-sm shadow-black/5 active:cursor-grabbing"
        ref={handleRef}
       
      >
        <div className="flex flex-col items-start gap-4 rounded-md bg-white p-4">
          
          {/* Drag handle */}
          <div
             role="button"
             onClick={() => setOpen(true)}
            className="w-full cursor-pointer  "
          >
            <p>{task.title}</p>
          </div>

          <div className="flex w-full items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-700 text-[#94A3B8]">
              <Calendar />
              {createdAt}
            </p>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              {initials}
            </div>
          </div>
        </div>

        <TaskDetailsModal
          taskId={task.id}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      </div>
    </div>
  );
}