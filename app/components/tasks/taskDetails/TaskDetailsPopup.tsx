"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchEpics } from "@/app/store/features/epics.slice";
import { fetchMembers } from "@/app/store/features/members.slice";
import {
  patchTaskInStore,
  updateTask,
} from "@/app/store/features/tasks.slice";
import {
  dateInputToApiDueDate,
  normalizeDescription,
  toDateInputValue,
  updateTaskSchema,
  UpdateTaskFormData,
  validateDueDate,
} from "@/app/schemas/updateTaskSchema";
import { UpdateTaskPayload } from "@/app/types/taskUpdate";
import { Member } from "@/app/types/members";
import { Task, TaskStatus } from "@/app/types/task";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Select from "react-select";
import Copy from "@/app/assets/icons/copy.svg";
import toast from "react-hot-toast";
import { statusOptions } from "@/app/constant/taskStatus";
import { statusColors } from "@/app/constant/taskStatusColor";
import { getInitials } from "@/app/constant/getInitials";
import TaskDetailsPopupSkeleton from "../Skeleton/TaskDetailsSkeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

type EditableTaskField =
  | "title"
  | "description"
  | "assignee_id"
  | "due_date"
  | "epic_id"
  | "status";

type SelectOption = {
  value: string;
  label: string;
};

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

function memberToAssignee(member: Member): NonNullable<Task["assignee"]> {
  return {
    id: member.user_id,
    name: member.metadata?.name ?? member.email,
    email: member.email,
    department: member.metadata?.job_title ?? null,
  };
}

function getAssigneeId(task: Task | null): string {
  return task?.assignee?.id ?? "";
}

function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export default function TaskDetailsPopup({
  taskId,
  onClose,
}: {
  taskId: string;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const { projectId } = useParams<{ projectId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const taskRef = useRef<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingFields, setUpdatingFields] = useState<Set<EditableTaskField>>(
    new Set(),
  );
  const deletedEpicHandledRef = useRef<string | null>(null);

  const epics = useAppSelector((state) => state.epics.epics);
  const members = useAppSelector((state) => state.members.members);

  const form = useForm<UpdateTaskFormData>({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: zodResolver(updateTaskSchema),
    mode: "onChange",
  });

  const {
    register,
    reset,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = form;

  const epicOptions: SelectOption[] = [
    { value: "", label: "No Epic" },
    ...epics.map((epic) => ({
      label: epic.title,
      value: epic.id,
    })),
  ];

  const assigneeOptions: SelectOption[] = [
    { value: "", label: "Unassigned" },
    ...members.map((member) => ({
      value: member.user_id,
      label: member.metadata?.name ?? member.email,
    })),
  ];

  useEffect(() => {
    taskRef.current = task;
  }, [task]);

  useEffect(() => {
    dispatch(fetchEpics({ projectId }));
    dispatch(fetchMembers({ projectId }));
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
          const data = (await response.json()) as Task;
          setTask(data);
          taskRef.current = data;
          reset({
            title: data.title,
            description: data.description ?? "",
          });
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
  }, [projectId, taskId, reset]);

  const isFieldUpdating = (field: EditableTaskField) =>
    updatingFields.has(field);

  const setFieldUpdating = (field: EditableTaskField, updating: boolean) => {
    setUpdatingFields((current) => {
      const next = new Set(current);
      if (updating) {
        next.add(field);
      } else {
        next.delete(field);
      }
      return next;
    });
  };

  const commitTask = (partial: Partial<Task>) => {
    if (!taskRef.current) {
      return;
    }

    const next = { ...taskRef.current, ...partial };
    taskRef.current = next;
    setTask(next);
    dispatch(
      patchTaskInStore({
        taskId: next.id,
        updates: partial,
      }),
    );
  };

  const saveTaskField = async (
    field: EditableTaskField,
    patch: UpdateTaskPayload,
    onError: () => void,
    showSuccessToast = false,
  ) => {
    if (!taskRef.current || isFieldUpdating(field)) {
      return;
    }

    setFieldUpdating(field, true);

    try {
      await dispatch(
        updateTask({
          projectId,
          taskId: taskRef.current.id,
          updates: patch,
        }),
      ).unwrap();

      if (showSuccessToast) {
        toast.success("Task updated");
      }
    } catch {
      onError();
      toast.error("Failed to update task. Please try again.");
    } finally {
      setFieldUpdating(field, false);
    }
  };

  const handleTitleBlur = async () => {
    const isValid = await trigger("title");
    const nextTitle = getValues("title").trim();
    const previousTitle = taskRef.current?.title ?? "";

    if (!isValid || !nextTitle) {
      setValue("title", previousTitle, { shouldValidate: true });
      if (!nextTitle) {
        toast.error("Title is required");
      }
      return;
    }

    if (nextTitle === previousTitle) {
      return;
    }

    setValue("title", nextTitle);
    commitTask({ title: nextTitle });

    await saveTaskField(
      "title",
      { title: nextTitle },
      () => {
        setValue("title", previousTitle, { shouldValidate: true });
        commitTask({ title: previousTitle });
      },
    );
  };

  const handleDescriptionBlur = async () => {
    const isValid = await trigger("description");
    if (!isValid) {
      setValue("description", taskRef.current?.description ?? "");
      return;
    }

    const nextDescription = normalizeDescription(getValues("description"));
    const previousDescription = normalizeDescription(
      taskRef.current?.description,
    );

    if (nextDescription === previousDescription) {
      return;
    }

    setValue("description", nextDescription ?? "");
    commitTask({ description: nextDescription });

    await saveTaskField(
      "description",
      { description: nextDescription },
      () => {
        setValue("description", previousDescription ?? "");
        commitTask({ description: previousDescription });
      },
    );
  };

  const handleAssigneeChange = async (option: SelectOption | null) => {
    const nextAssigneeId = option?.value ?? "";
    const previousAssignee = taskRef.current?.assignee ?? null;
    const previousAssigneeId = getAssigneeId(taskRef.current);

    if (nextAssigneeId === previousAssigneeId) {
      return;
    }

    const member = members.find((item) => item.user_id === nextAssigneeId);
    const nextAssignee = member ? memberToAssignee(member) : null;

    commitTask({ assignee: nextAssignee });

    await saveTaskField(
      "assignee_id",
      { assignee_id: nextAssigneeId || null },
      () => {
        commitTask({ assignee: previousAssignee });
      },
    );
  };

  const handleEpicChange = async (option: SelectOption | null) => {
    const nextEpicId = option?.value ?? "";
    const previousEpicId = taskRef.current?.epic_id ?? null;
    const previousEpic = taskRef.current?.epic ?? null;
    const normalizedNextEpicId = nextEpicId || null;

    if (normalizedNextEpicId === previousEpicId) {
      return;
    }

    const nextEpic =
      normalizedNextEpicId != null
        ? (epics.find((epic) => epic.id === normalizedNextEpicId) ?? null)
        : null;

    commitTask({
      epic_id: normalizedNextEpicId,
      epic: nextEpic,
    });

    await saveTaskField(
      "epic_id",
      { epic_id: normalizedNextEpicId },
      () => {
        commitTask({
          epic_id: previousEpicId,
          epic: previousEpic,
        });
      },
    );
  };

  const handleDueDateChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const nextDateInput = event.target.value;
    const previousDueDate = taskRef.current?.due_date ?? null;
    const previousDateInput = toDateInputValue(previousDueDate);

    if (nextDateInput === previousDateInput) {
      return;
    }

    if (!nextDateInput) {
      commitTask({ due_date: null });
      await saveTaskField(
        "due_date",
        { due_date: null },
        () => {
          commitTask({ due_date: previousDueDate });
        },
      );
      return;
    }

    const validation = validateDueDate(nextDateInput);
    if (!validation.valid) {
      event.target.value = previousDateInput;
      toast.error(validation.message ?? "Invalid due date");
      return;
    }

    const nextDueDate = dateInputToApiDueDate(nextDateInput);
    commitTask({ due_date: nextDueDate });

    await saveTaskField(
      "due_date",
      { due_date: nextDueDate },
      () => {
        commitTask({ due_date: previousDueDate });
      },
    );
  };

  const handleStatusChange = async (option: SelectOption | null) => {
    const nextStatus = option?.value as TaskStatus | undefined;
    const previousStatus = taskRef.current?.status as TaskStatus | undefined;

    if (!nextStatus || !previousStatus || nextStatus === previousStatus) {
      return;
    }

    commitTask({ status: nextStatus });

    await saveTaskField(
      "status",
      { status: nextStatus },
      () => {
        commitTask({ status: previousStatus });
      },
      true,
    );
  };

  useEffect(() => {
    const currentTask = taskRef.current;
    if (!currentTask?.epic_id || epics.length === 0) {
      return;
    }

    const currentEpicId = currentTask.epic_id;
    const epicExists = epics.some((epic) => epic.id === currentEpicId);

    if (
      epicExists ||
      deletedEpicHandledRef.current === `${taskId}:${currentEpicId}`
    ) {
      return;
    }

    deletedEpicHandledRef.current = `${taskId}:${currentEpicId}`;
    const previousEpicId = currentEpicId;
    const previousEpic = currentTask.epic;

    const nextTask = { ...currentTask, epic_id: null, epic: null };
    taskRef.current = nextTask;
    setTask(nextTask);
    dispatch(
      patchTaskInStore({
        taskId: nextTask.id,
        updates: { epic_id: null, epic: null },
      }),
    );

    void (async () => {
      setFieldUpdating("epic_id", true);
      try {
        await dispatch(
          updateTask({
            projectId,
            taskId: nextTask.id,
            updates: { epic_id: null },
          }),
        ).unwrap();
      } catch {
        const restoredTask = {
          ...nextTask,
          epic_id: previousEpicId,
          epic: previousEpic,
        };
        taskRef.current = restoredTask;
        setTask(restoredTask);
        dispatch(
          patchTaskInStore({
            taskId: restoredTask.id,
            updates: { epic_id: previousEpicId, epic: previousEpic },
          }),
        );
        deletedEpicHandledRef.current = null;
        toast.error("Failed to update task. Please try again.");
      } finally {
        setFieldUpdating("epic_id", false);
      }
    })();
  }, [dispatch, epics, projectId, taskId]);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#task-${taskId}`;

    await navigator.clipboard.writeText(url);

    toast.success("Link copied to clipboard");
  };

  const titleRegister = register("title");
  const descriptionRegister = register("description");
  const initials = getInitials(task?.created_by?.name ?? "");
  const formattedDueDate = toDateInputValue(task?.due_date);
  const formattedCreatedAt = formatDisplayDate(task?.created_at);
  const selectedEpicOption =
    epicOptions.find((option) => option.value === (task?.epic_id ?? "")) ??
    epicOptions[0];
  const selectedStatusOption =
    statusOptions.find((option) => option.value === task?.status) ?? null;
  const selectedAssigneeOption =
    assigneeOptions.find(
      (option) => option.value === getAssigneeId(task),
    ) ?? assigneeOptions[0];

  if (isLoading || !task) {
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
              {task.task_id}
            </span>
            <Select
              classNames={selectClassNames}
              instanceId="epic-select"
              unstyled
              isDisabled={isFieldUpdating("epic_id")}
              options={epicOptions}
              value={selectedEpicOption}
              onChange={(option) => {
                void handleEpicChange(option as SelectOption | null);
              }}
              className="w-[255px] bg-white border border-[#D7E2FF] rounded-md px-2"
            />
          </div>
          <input
            type="text"
            aria-label="Task title"
            disabled={isFieldUpdating("title")}
            className="text-[30px] font-bold w-full bg-transparent outline-none border-none disabled:opacity-60"
            placeholder="Task title"
            {...titleRegister}
            onBlur={(event) => {
              void titleRegister.onBlur(event);
              void handleTitleBlur();
            }}
          />
          {errors.title && (
            <p className="text-[12px] text-[#BA1A1A]">{errors.title.message}</p>
          )}
        </div>
        <div className="py-8 px-8  flex flex-col ">
          <label
            htmlFor="description"
            className="text-[10px] font-bold text-[#434654] uppercase"
          >
            description
          </label>
          <textarea
            id="description"
            disabled={isFieldUpdating("description")}
            className="w-full h-full bg-white border border-[#D7E2FF] rounded-md px-2 py-2 resize-none disabled:opacity-60"
            rows={10}
            placeholder="No description provided"
            {...descriptionRegister}
            onBlur={(event) => {
              void descriptionRegister.onBlur(event);
              void handleDescriptionBlur();
            }}
          />
          {errors.description && (
            <p className="text-[12px] text-[#BA1A1A]">
              {errors.description.message}
            </p>
          )}
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
            inputId="status"
            isDisabled={isFieldUpdating("status")}
            options={statusOptions}
            value={selectedStatusOption}
            onChange={(option) => {
              void handleStatusChange(option as SelectOption | null);
            }}
            className={`w-[255px] rounded-md px-2 border border-[#D7E2FF] ${
              task.status
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
              inputId="assignee"
              isDisabled={isFieldUpdating("assignee_id")}
              options={assigneeOptions}
              value={selectedAssigneeOption}
              placeholder="Unassigned"
              onChange={(option) => {
                void handleAssigneeChange(option as SelectOption | null);
              }}
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
              {task.created_by?.name}
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
            min={getTodayDateInputValue()}
            disabled={isFieldUpdating("due_date")}
            className="w-full rounded-md px-2 py-2 border border-[#D7E2FF] bg-white disabled:opacity-60"
            value={formattedDueDate}
            onChange={(event) => {
              void handleDueDateChange(event);
            }}
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
