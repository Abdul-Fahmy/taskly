"use client";
import { Task, TaskStatus } from "@/app/types/task";
import TaskCard from "./TaskCard";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { fetchTasks } from "@/app/store/features/tasks.slice";
import TaskColumnSkeleton from "./Skeleton/TaskColumnSkeleton";

import { statusColors } from "@/app/constant/taskStatusColor";

const EMPTY_TASKS: Task[] = [];

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

  useEffect(() => {
    const promise = dispatch(
      fetchTasks({
        projectId,
        status: status.value,
        searchTerm: searchTerm.trim() || undefined,
      }),
    );

    return () => {
      promise.abort();
    };
  }, [dispatch, projectId, status.value, searchTerm]);

  if (columnStatus === "loading" || columnStatus === "idle") {
    return <TaskColumnSkeleton />;
  }

  return (
    <div className="flex min-w-72 shrink-0 flex-col py-6">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${statusColors[status.value]}`}
          ></span>
          <h3 className="text-sm font-semibold">{status.label}</h3>
          <p className="bg-task-count py-0.5 px-1.5 text-[10px] font-bold">
            {tasks.length}
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
      <div className="flex flex-col gap-2 p-3 pt-0">
        <button
          onClick={onAddTask}
          className="text-[#43465499] border-2 border-dashed border-[#C3C6D64D] rounded-md p-3 flex items-center justify-center gap-4"
        >
          <span className=" border-2 rounded-full w-6 h-6 flex items-center justify-center  ">
            +
          </span>

          <p className="uppercase text-[12px] font-bold">Add new task</p>
        </button>
        <div className="overflow-y-scroll max-h-96">
        {tasks.map((task) => (
                     <TaskCard key={task.id} task={task} />

        ))}
        </div>
      </div>
    </div>
  );
}
