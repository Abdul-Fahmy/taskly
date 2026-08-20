"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  fetchAllTasks,
  setAllTasksCurrentPage,
} from "@/app/store/features/tasks.slice";
import { TaskStatus } from "@/app/types/task";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import PaginationForTasks from "./PaginationForTasks";
import TaskListSkeleton from "./Skeleton/TaskListSkeleton";
import Link from "next/link";
import { getInitials } from "@/app/constant/getInitials";

export function ListView() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.allTasks);
  const { allTasksCurrentPage, allTasksLimit, allTasksTotalCount, allTasksStatus } =
    useAppSelector((state) => state.tasks);
    

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
    return <div className="flex flex-col items-center justify-center gap-2 p-3 pt-4">
      <Link href={`/project/${projectId}/tasks/new`} className="btn-primary text-white py-2 px-4 rounded-md mr-6 mt-4">Create Task</Link>
      <p className="  text-2xl font-semibold">No tasks found</p>
      <p className="text-sm text-gray-500">Create a task to get started on this list.</p>
    </div>
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

      {tasks.map((task,index) => (
        <div
          key={task.id}
          className={`grid grid-cols-[120px_1fr_160px_140px_180px] items-center gap-2 bg-white px-4 py-4 text-sm hover:bg-gray-50 cursor-pointer ${
            index !== tasks.length - 1
              ? "border-b border-[#F1F3FF]"
              : ""
          }`}        >
          <span className="text-primary text-[12px]">{task.task_id}</span>

          <span className="truncate font-medium text-gray-900">
            {task.title}
          </span>

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
                                <span className="hidden md:flex items-center justify-center bg-[#DAE2FF] text-[12px] w-6 h-6 rounded-full">{getInitials(task.assignee.name) || 'U'}</span>

                <span className="truncate text-gray-700">
                {task.assignee.name || "Unassigned"}
              </span>
              </div>
            ) : (
              <span className="text-gray-400">Unassigned</span>
            )}
          </div>
          
        </div>
        
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
      <Link href={`/project/${projectId}/tasks/new`} className="btn-primary text-white py-2 px-4 rounded-md mr-6 mt-4">+</Link>
    </div>
    </div>
  );
}
