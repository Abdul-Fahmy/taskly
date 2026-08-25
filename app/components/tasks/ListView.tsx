"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  fetchAllTasks,
  setAllTasksCurrentPage,
} from "@/app/store/features/tasks.slice";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PaginationForTasks from "./PaginationForTasks";
import TaskListSkeleton from "./Skeleton/TaskListSkeleton";
import Link from "next/link";
import ListViewCard from "./ListViewCard";

export function ListView({ searchTerm }: { searchTerm: string }) {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.allTasks);
  const {
    allTasksCurrentPage,
    allTasksLimit,
    allTasksTotalCount,
    allTasksStatus,
  } = useAppSelector((state) => state.tasks);

  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const hasMore = tasks.length < allTasksTotalCount;

  useEffect(() => {
    dispatch(setAllTasksCurrentPage(1));
  }, [dispatch, projectId, searchTerm]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    function updateScreenMode() {
      setIsMobile(mediaQuery.matches);
      dispatch(setAllTasksCurrentPage(1));
    }

    updateScreenMode();
    mediaQuery.addEventListener("change", updateScreenMode);

    return () => mediaQuery.removeEventListener("change", updateScreenMode);
  }, [dispatch, projectId]);

  useEffect(() => {
    if (isMobile === null || !projectId) {
      return;
    }

    const promise = dispatch(
      fetchAllTasks({
        projectId,
        limit: allTasksLimit,
        page: allTasksCurrentPage,
        append: isMobile && allTasksCurrentPage > 1,
        searchTerm: searchTerm.trim() || undefined,
      }),
    );

    return () => {
      promise.abort();
    };
  }, [
    dispatch,
    projectId,
    allTasksLimit,
    allTasksCurrentPage,
    isMobile,
    searchTerm,
  ]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (
      !isMobile ||
      !target ||
      !hasMore ||
      allTasksStatus === "loading" ||
      allTasksStatus === "failed"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch(setAllTasksCurrentPage(allTasksCurrentPage + 1));
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [allTasksCurrentPage, dispatch, hasMore, isMobile, allTasksStatus]);

  const handlePageChange = (page: number) => {
    dispatch(setAllTasksCurrentPage(page));
  };

  const showInitialSkeleton =
    isMobile === null ||
    (allTasksStatus === "loading" && tasks.length === 0);

  if (showInitialSkeleton) {
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
    <div className="w-full overflow-hidden mt-8 mb-20">
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

      <div ref={loadMoreRef} className="h-1 md:hidden" aria-hidden="true" />

      {isMobile && allTasksStatus === "loading" && tasks.length > 0 && (
        <div className="px-2 py-4 md:hidden">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="my-4 h-32 animate-pulse rounded-md bg-gray-200"
            />
          ))}
        </div>
      )}

      {allTasksTotalCount > 0 && (
        <div className="hidden md:block bg-white rounded-md border-[#F1F3FF] border-b p-4">
          <PaginationForTasks
            limit={allTasksLimit}
            totalCount={allTasksTotalCount}
            currentPage={allTasksCurrentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

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
