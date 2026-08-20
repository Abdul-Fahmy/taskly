"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  fetchAllTasks,
  setAllTasksCurrentPage,
} from "@/app/store/features/tasks.slice";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import PaginationForTasks from "./PaginationForTasks";
import TaskListSkeleton from "./Skeleton/TaskListSkeleton";
import Link from "next/link";
import ListViewCard from "./ListViewCard";

export function ListView() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.allTasks);
  const {
    allTasksCurrentPage,
    allTasksLimit,
    allTasksTotalCount,
    allTasksStatus,
  } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(setAllTasksCurrentPage(1));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (projectId) {
      dispatch(
        fetchAllTasks({
          projectId,
          limit: allTasksLimit,
          page: allTasksCurrentPage,
        }),
      );
    }
  }, [dispatch, projectId, allTasksLimit, allTasksCurrentPage]);

  const handlePageChange = (page: number) => {
    dispatch(setAllTasksCurrentPage(page));
  };
  if (allTasksStatus === "loading") {
    return <TaskListSkeleton />;
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-3 pt-4">
        <Link
          href={`/project/${projectId}/tasks/new`}
          className="btn-primary text-white py-2 px-4 rounded-md mr-6 mt-4"
        >
          Create Task
        </Link>
        <p className="  text-2xl font-semibold">No tasks found</p>
        <p className="text-sm text-gray-500">
          Create a task to get started on this list.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden mt-8">
      <div className="hidden md:grid grid-cols-[120px_1fr_160px_140px_180px] items-center bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500">
        <span>Task ID</span>
        <span>Title</span>
        <span>Status</span>
        <span>Due Date</span>
        <span>Assignee</span>
      </div>

      {tasks.map((task) => (
        <ListViewCard key={task.id} task={task} />
      ))}
      <div className="bg-white rounded-md border-[#F1F3FF] border-b p-4">
        {allTasksTotalCount > 0 && (
          <PaginationForTasks
            limit={allTasksLimit}
            totalCount={allTasksTotalCount}
            currentPage={allTasksCurrentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <div className="hidden md:flex items-center justify-end">
        <Link
          href={`/project/${projectId}/tasks/new`}
          className="btn-primary text-white py-2 px-4 rounded-md mr-6 mt-4"
        >
          +
        </Link>
      </div>
    </div>
  );
}
