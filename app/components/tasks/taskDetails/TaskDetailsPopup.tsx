"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchEpics } from "@/app/store/features/epics.slice";
import { Task } from "@/app/types/task";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import Copy from "@/app/assets/icons/copy.svg";
import toast from "react-hot-toast";
import { statusOptions } from "@/app/constant/taskStatus";
import { statusColors } from "@/app/constant/taskStatusColor";
import { getInitials } from "@/app/constant/getInitials";
import TaskDetailsPopupSkeleton from "../Skeleton/TaskDetailsSkeleton";

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

function toDateInputValue(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export default function TaskDetailsPopup({
  taskId,
  onClose,
}: {
  taskId: string;
  onClose: () => void;
}) {
  const selectClassNames = {
    control: () => "w-full cursor-pointer",
    valueContainer: () => "p-0",
    input: () => "m-0 p-0",
    indicatorsContainer: () => "p-0",
    dropdownIndicator: () => "p-0",
    clearIndicator: () => "p-0",
    menu: () => "mt-1 rounded-md border border-gray-200 bg-white shadow-lg",
    option: ({
      isFocused,
      isSelected,
    }: {
      isFocused: boolean;
      isSelected: boolean;
    }) =>
      `cursor-pointer px-3 py-2 ${
        isSelected
          ? "bg-blue-500 text-white"
          : isFocused
            ? "bg-gray-100"
            : "bg-white"
      }`,
  };
  const dispatch = useAppDispatch();
  const { projectId } = useParams<{ projectId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const epics = useAppSelector((state) => state.epics.epics);
  const epicsOptions = epics.map((epic) => ({
    label: epic.title,
    value: epic.id,
  }));
  const initials = getInitials(task?.created_by?.name ?? "");
  const formattedDueDate = toDateInputValue(task?.due_date);
  const formattedCreatedAt = formatDisplayDate(task?.created_at);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchEpics({ projectId }));
  }, [dispatch, projectId]);

  useEffect(() => {
    const fetchTask = async () => {
      if (!projectId || !taskId) {
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/project/${projectId}/tasks/taskDetails/${taskId}`,
        );
        if (response.ok) {
          const data = await response.json();
          setTask(data);
          setIsLoading(false);
        } else {
          toast.error("Failed to fetch task details");
          setIsLoading(false);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch task details",
        );
        setIsLoading(false);
      }
    };

    void fetchTask();
  }, [projectId, taskId]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  if (isLoading) {
    return <TaskDetailsPopupSkeleton />;
  }

  return (
    <div className="flex w-full gap-4 bg-surface-low rounded-lg overflow-hidden">
      <div className="flex flex-col   w-2/3 bg-white">
        <div className="flex flex-col py-6 px-8  items-start gap-2 border-b border-[#E8EDFF]">
          <div className="flex items-center gap-2 w-full  ">
            <span
              className={`p-2 rounded-md bg-[#DAE2FF] text-primary text-[12px] font-bold`}
            >
              {task?.task_id}
            </span>
            <Select
              classNames={selectClassNames}
              instanceId="epic-select"
              unstyled
              value={epicsOptions.find(
                (option) => option.value === task?.epic_id,
              )}

              className="w-[255px] bg-white border border-[#D7E2FF] rounded-md px-2"
            />
          </div>
          <h2 className="text-[30px] font-bold">{task?.title}</h2>
        </div>
        <div className="py-8 px-8  flex flex-col ">
          <label
            htmlFor="description"
            className="text-[10px] font-bold text-[#434654] uppercase"
          >
            description
          </label>
          <textarea
            name="description"
            id="description"
            className="w-full h-full bg-white border border-[#D7E2FF] rounded-md px-2 py-2 resize-none"
            rows={10}
            value={task?.description ?? ""}
            placeholder="No description provided"
            readOnly
          />
        </div>
        <div className="bg-surface-low flex items-center justify-between py-6 px-8">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-[#434654] text-[14px]"
          >
            <Copy /> Copy link
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-[#D7E2FF] rounded-sm text-[#041B3C] text-[14px] font-semibold "
          >
            Close
          </button>
        </div>
      </div>
      <div className="w-1/3  px-8 py-6 flex flex-col items-start gap-10 ">
        <div className="w-full flex flex-col gap-2">
          <label
            htmlFor="status"
            className="uppercase text-[#434654] text-[12px] font-700"
          >
            Status
          </label>
          <Select
            classNames={selectClassNames}
            instanceId="status-select"
            unstyled
            value={statusOptions.find(
              (option) => option.value === task?.status,
            )}

            className={`w-[255px] rounded-md px-2 border border-[#D7E2FF] ${
              task?.status
                ? statusColors[task.status as keyof typeof statusColors]
                : "bg-white"
            }`}
          />
        </div>
        <div className="w-full flex flex-col gap-2 border-b border-[#C3C6D633] pb-6">
          <div className="w-full flex flex-col ">
            <label
              htmlFor="assignee"
              className="uppercase text-[#434654] text-[12px] font-700"
            >
              Assignee
            </label>
            <Select
              classNames={selectClassNames}
              className="w-[255px] rounded-md px-2 border border-[#D7E2FF] bg-white"
              unstyled
              instanceId="assignee-select"
              value={
                task?.assignee?.name && task?.assignee?.email
                  ? {
                      label: task.assignee.name,
                      value: task.assignee.email,
                    }
                  : null
              }
              placeholder="Unassigned"
            />
          </div>
          <div className="w-full flex flex-col ">
            <label className="uppercase text-[#434654] text-[12px] font-700">
              Reporter
            </label>
            <p className="flex items-center gap-2">
              {initials && (
                <span className=" w-6 h-6 rounded-full bg-[#DAE2FF] text-[11px] text-bold flex items-center justify-center">
                  {initials}
                </span>
              )}
              {task?.created_by?.name}
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full gap-4 ">
          <label
            htmlFor="dueDate"
            className="uppercase text-[#434654] text-[12px] font-700"
          >
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            className="w-full rounded-md px-2 py-2 border border-[#D7E2FF] bg-white"
            value={formattedDueDate ?? ""}
            readOnly
          />
          <div className="flex items-center justify-between">
            <p className="text-[#434654] text-[12px] font-bold capitalize">
              Created at
            </p>
            <p className="text-[#041B3C] text-[14px] font-500">
              {formattedCreatedAt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
