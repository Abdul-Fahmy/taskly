"use client";

import { statusOptions } from "@/app/constant/taskStatus";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  moveTaskOptimistically,
  resetBoardTasksState,
  updateTaskStatus,
} from "@/app/store/features/tasks.slice";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { TaskColumn } from "./TaskColumn";
import toast from "react-hot-toast";

import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";

export default function ViewBoard({ searchTerm }: { searchTerm: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { projectId } = useParams<{ projectId: string }>();

  const tasksByStatus = useAppSelector((state) => state.tasks.tasksByStatus);

  const statusByColumn = useAppSelector((state) => state.tasks.statusByColumn);

  const boardProjectId = useAppSelector((state) => state.tasks.boardProjectId);

  // --------------------------------
  // Drag & Drop
  // --------------------------------

  const handleDragEnd = async (event: DragEndEvent) => {
    const { operation, canceled } = event;

    if (canceled) return;

    const { source, target } = operation;

    if (!source || !target) return;

    const task = source.data?.task;

    const destinationStatus = target.data?.status;

    if (!task || !destinationStatus) return;

    const oldStatus = task.status;

    if (oldStatus === destinationStatus) return;

    dispatch(
      moveTaskOptimistically({
        taskId: task.id,
        fromStatus: oldStatus,
        toStatus: destinationStatus,
      }),
    );

    try {
      await dispatch(
        updateTaskStatus({
          taskId: task.id,
          status: destinationStatus,
          projectId,
        }),
      ).unwrap();

      toast.success("Task status updated");
    } catch {
      dispatch(
        moveTaskOptimistically({
          taskId: task.id,
          fromStatus: destinationStatus,
          toStatus: oldStatus,
        }),
      );

      toast.error("Failed to update task status");
    }
  };

  // --------------------------------
  // Reset board when project changes
  // --------------------------------

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
    isCurrentProject &&
    allColumnsLoaded &&
    totalTasks === 0 &&
    !searchTerm.trim();

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
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-scroll">
        {statusOptions.map((status) => (
          <TaskColumn
            key={`${projectId}-${status.value}`}
            status={status}
            searchTerm={searchTerm}
            onAddTask={() => {
              router.push(
                `/project/${projectId}/tasks/new?status=${status.value}`,
              );
            }}
          />
        ))}
      </div>
    </DragDropProvider>
  );
}
