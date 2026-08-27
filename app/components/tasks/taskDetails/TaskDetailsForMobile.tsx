"use client";

import { getInitials } from "@/app/constant/getInitials";
import { Task } from "@/app/types/task";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TaskDetailsPopupSkeleton from "../Skeleton/TaskDetailsSkeleton";
import CloseIcon from "@/app/assets/icons/closeModal.svg";
import { statusColors } from "@/app/constant/taskStatusColor";

function formatDisplayDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function TaskDetailsForMobile({
  taskId,
  isOpen,
  onClose,
}: {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { projectId } = useParams<{ projectId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !projectId || !taskId) {
      return;
    }

    const fetchTask = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/project/${projectId}/tasks/taskDetails/${taskId}`,
        );

        if (response.ok) {
          const data = await response.json();
          setTask(data);
        } else {
          toast.error("Failed to fetch task details");
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch task details",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTask();
  }, [isOpen, projectId, taskId]);

  if (!isOpen) {
    return null;
  }

  if (isLoading || !task) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20">
        <div className="relative h-full w-full max-w-[450px] overflow-y-auto bg-[#F4F5F9] shadow-2xl">
          <TaskDetailsPopupSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 md:hidden"
      onMouseDown={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative min-h-1/2 w-full max-w-[450px] overflow-y-auto bg-[#F4F5F9] shadow-2xl"
      >
        <div className="flex justify-center pt-4">
          <div className="h-[5px] w-12 rounded-full bg-[#D8DBE3]" />
        </div>

        <div className="border-b border-dashed border-[#3B82F6] px-7 pb-5 pt-7">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold tracking-[0.08em] text-[#536481]">
              {task.task_id}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#4B4F59] transition hover:bg-black/5"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="px-7 pb-8">
          <h2 className="mt-3 max-w-[390px] text-[28px] font-bold leading-[1.18] tracking-[-0.5px] text-[#09244A]">
            {task.title}
          </h2>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex h-8 items-center gap-1.5 rounded-full ${statusColors[task.status as keyof typeof statusColors]} px-3.5 text-[13px] font-bold text-[#092B24]`}
            >
              {formatStatus(task.status)}
            </span>

            {task.epic?.title && (
              <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#D3DFFE] px-3.5 text-[13px] font-semibold text-[#31517E]">
                {task.epic.title}
              </span>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3.5">
            <DetailCard label="ASSIGNEE">
              <div className="flex items-center gap-2.5">
                <Avatar initials={getInitials(task.assignee?.name || "U")} />
                <span className="truncate text-[16px] font-medium text-[#0C2446]">
                  {task.assignee?.name ?? "Unassigned"}
                </span>
              </div>
            </DetailCard>

            <DetailCard label="DUE DATE">
              <span className="text-[16px] font-medium text-[#0C2446]">
                {formatDisplayDate(task.due_date)}
              </span>
            </DetailCard>

            <DetailCard label="CREATED BY">
              <div className="flex items-center gap-2.5">
                <Avatar initials={getInitials(task.created_by.name || "U")} />
                <span className="truncate text-[16px] font-medium text-[#0C2446]">
                  {task.created_by.name}
                </span>
              </div>
            </DetailCard>

            <DetailCard label="CREATED AT">
              <span className="text-[16px] font-medium text-[#0C2446]">
                {formatDisplayDate(task.created_at)}
              </span>
            </DetailCard>
          </div>

          <section className="mt-10">
            <h3 className="text-[17px] font-bold tracking-[-0.2px] text-[#737887]">
              DESCRIPTION
            </h3>

            <div className="mt-3.5 rounded-lg bg-white px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <p className="text-[16px] leading-[1.62] text-[#4B5161]">
                {task.description ?? "No description provided"}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

interface DetailCardProps {
  label?: string;
  children: React.ReactNode;
}

function DetailCard({ label, children }: DetailCardProps) {
  return (
    <div className="flex min-h-[94px] flex-col justify-center rounded-lg bg-[#F0F2FF] px-[18px] py-4">
      {label && (
        <span className="mb-2 text-[12px] font-bold tracking-[0.02em] text-[#737887]">
          {label}
        </span>
      )}

      {children}
    </div>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D8E3FF] text-[11px] font-semibold text-[#315CA7]">
      {initials}
    </div>
  );
}
