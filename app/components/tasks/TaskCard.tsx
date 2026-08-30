"use client";

import { getInitials } from "@/app/constant/getInitials";
import { Task } from "@/app/types/task";
import Calendar from "@/app/assets/icons/date.svg";
import { useEffect, useState } from "react";
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

  const handleOpen = () => {
    setOpen(true);

    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#task-${task.id}`,
    );
  };

  const handleClose = () => {
    setOpen(false);

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
  };

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;

      if (hash === `#task-${task.id}`) {
        setOpen(true);
      }
    };

    checkHash();

    window.addEventListener("hashchange", checkHash);

    return () => {
      window.removeEventListener("hashchange", checkHash);
    };
  }, [task.id]);

  return (
    <>
      <div
        ref={ref}
        className={`
          rounded-md
          transition-opacity
          ${isDragging ? "opacity-50" : ""}
        `}
      >
        <div className="flex shadow-sm shadow-black/5">
          <button
            type="button"
            ref={handleRef}
            aria-label="Drag task"
            className="flex cursor-grab items-center rounded-l-md bg-white px-2 text-[#94A3B8] active:cursor-grabbing"
          >
            ⋮⋮
          </button>

          <div
            className="flex flex-1 cursor-pointer flex-col gap-4 rounded-r-md bg-white p-4"
            onClick={handleOpen}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                handleOpen();
              }
            }}
            role="button"
            tabIndex={0}
          >
            <p>{task.title}</p>

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
        </div>
      </div>

      <TaskDetailsModal
        taskId={task.id}
        isOpen={open}
        onClose={handleClose}
      />
    </>
  );
}
