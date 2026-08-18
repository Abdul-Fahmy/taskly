"use client";

import { statusOptions } from "@/app/constant/taskStatus";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { resetBoardTasksState } from "@/app/store/features/tasks.slice";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { TaskColumn } from "./TaskColumn";

export default function ViewBoard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { projectId } = useParams<{ projectId: string }>();
  const tasksByStatus = useAppSelector((state) => state.tasks.tasksByStatus);
  const statusByColumn = useAppSelector((state) => state.tasks.statusByColumn);
  const boardProjectId = useAppSelector((state) => state.tasks.boardProjectId);

  useEffect(() => {
    dispatch(resetBoardTasksState());
  }, [dispatch, projectId]);

  const isCurrentProject = boardProjectId === projectId;

  const allColumnsLoaded = statusOptions.every((status) => {
    const columnStatus = statusByColumn[status.value];
    return columnStatus === "succeeded" || columnStatus === "failed";
  });

  const totalTasks = statusOptions.reduce(
    (count, status) => count + (tasksByStatus[status.value]?.length ?? 0),
    0,
  );

  const showEmptyState =
    isCurrentProject && allColumnsLoaded && totalTasks === 0;

  if (showEmptyState) {
    return (
      <div className="mt-8 flex min-h-[40vh] w-full flex-col items-center justify-center gap-2">
        <Link
          href={`/project/${projectId}/tasks/new`}
          className="btn-primary rounded-md p-4 text-white"
        >
          Create Task
        </Link>
        <p className="text-2xl font-semibold text-[#041B3C]">No tasks found</p>
        <p className="text-sm text-[#434654]">
          Create a task to get started on this board.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-scroll">
      {statusOptions.map((status) => (
        <TaskColumn
          key={`${projectId}-${status.value}`}
          status={status}
          onAddTask={() => {
            router.push(
              `/project/${projectId}/tasks/new?status=${status.value}`,
            );
          }}
        />
      ))}
    </div>
  );
}
