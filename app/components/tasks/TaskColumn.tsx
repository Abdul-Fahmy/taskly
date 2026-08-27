"use client";
import { Task, TaskStatus } from "@/app/types/task";
import { TaskCard } from "./TaskCard";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fetchTasks } from "@/app/store/features/tasks.slice";
import TaskColumnSkeleton from "./Skeleton/TaskColumnSkeleton";
import { useDroppable } from "@dnd-kit/react";

import { statusColors } from "@/app/constant/taskStatusColor";

const EMPTY_TASKS: Task[] = [];
const COLUMN_PAGE_SIZE = 5;

type TaskColumnProps = {
  status: {
    value: TaskStatus;
    label: string;
  };
  onAddTask: () => void;
  searchTerm: string;
};

export function TaskColumn({ status, onAddTask, searchTerm }: TaskColumnProps) {
  const { projectId } = useParams<{ projectId: string }>();

  const dispatch = useAppDispatch();

  const tasks = useAppSelector(
    (state) => state.tasks.tasksByStatus[status.value] ?? EMPTY_TASKS,
  );

  const columnStatus = useAppSelector(
    (state) => state.tasks.statusByColumn[status.value] ?? "idle",
  );

  const totalCount = useAppSelector(
    (state) => state.tasks.totalCountByColumn[status.value] ?? 0,
  );

  const [page, setPage] = useState(1);
  const columnKey = `${projectId}-${searchTerm}-${status.value}`;
  const [prevColumnKey, setPrevColumnKey] = useState(columnKey);

  if (columnKey !== prevColumnKey) {
    setPrevColumnKey(columnKey);
    setPage(1);
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const hasMore = tasks.length < totalCount;

  const { ref: dropRef, isDropTarget } = useDroppable({
    id: `column-${status.value}`,
    data: {
      type: "column",
      status: status.value,
    },
  });

  useEffect(() => {
    const promise = dispatch(
      fetchTasks({
        projectId,
        status: status.value,
        searchTerm: searchTerm.trim() || undefined,
        limit: COLUMN_PAGE_SIZE,
        page,
        append: page > 1,
      }),
    );

    return () => {
      promise.abort();
    };
  }, [dispatch, projectId, status.value, searchTerm, page]);

  useEffect(() => {
    const root = scrollRef.current;
    const target = loadMoreRef.current;

    if (
      !root ||
      !target ||
      !hasMore ||
      columnStatus === "loading" ||
      columnStatus === "failed"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((currentPage) => currentPage + 1);
        }
      },
      {
        root,
        rootMargin: "120px",
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasMore, columnStatus, page, tasks.length]);

  const showInitialSkeleton =
    (columnStatus === "loading" || columnStatus === "idle") &&
    tasks.length === 0;

  if (showInitialSkeleton) {
    return <TaskColumnSkeleton />;
  }

  return (
    <div
      ref={dropRef}
      className={`
        flex min-w-72 shrink-0 flex-col py-6
        transition-colors
        ${isDropTarget ? "bg-blue-50/50 rounded-lg" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${statusColors[status.value]}`}
          />

          <h3 className="text-sm font-semibold">{status.label}</h3>

          <p className="bg-task-count px-1.5 py-0.5 text-[10px] font-bold">
            {totalCount}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddTask}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-200"
        >
          +
        </button>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-2 p-3 pt-0">
        <button
          onClick={onAddTask}
          className="flex items-center justify-center gap-4 rounded-md border-2 border-dashed border-[#C3C6D64D] p-3 text-[#43465499]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border-2">
            +
          </span>

          <p className="text-[12px] font-bold uppercase">Add new task</p>
        </button>

        <div ref={scrollRef} className="max-h-96 overflow-y-auto">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}

          <div ref={loadMoreRef} className="h-1" aria-hidden="true" />

          {columnStatus === "loading" && tasks.length > 0 && (
            <div className="my-2 h-24 animate-pulse rounded-lg bg-gray-100" />
          )}
        </div>
      </div>
    </div>
  );
}
