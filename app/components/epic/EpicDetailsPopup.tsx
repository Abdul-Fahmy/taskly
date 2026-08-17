"use client";

import { getInitials } from "@/app/constant/getInitials";
import {
  updateEpicFormData,
  updateEpicSchema,
} from "@/app/schemas/addEpicSchema";
import { Epic, UserInfo } from "@/app/types/epicResponse";
import { Member } from "@/app/types/members";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import { CustomOption, CustomSingleValue } from "../customOption/CustomOption";
import Input from "../input/Input";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  fetchTasksForEpic,
  
} from "@/app/store/features/tasks.slice";
import TaskCardEpic from "../tasks/TaskCardEpic";
import { fetchMembers } from "@/app/store/features/members.slice";
import CopyIcon from'@/app/assets/icons/copy.svg'
import CloseModal from'@/app/assets/icons/closeModal.svg'

type AssigneeOption = {
  value: string;
  label: string;
};

type UpdateEpicPayload = {
  title?: string;
  description?: string | null;
  assignee_id?: string | null;
  deadline?: string | null;
};

function memberToUserInfo(member: Member): UserInfo {
  return {
    sub: member.user_id,
    name: member.metadata?.name ?? member.email,
    email: member.email,
    department: member.metadata?.job_title ?? "",
  };
}

export default function EpicDetailsPopup({
  epic,
  onClose,
  onEpicUpdated,
}: {
  epic: Epic;
  onClose: () => void;
  onEpicUpdated?: (epic: Epic) => void;
}) {
  const { projectId } = useParams<{ projectId: string }>();
  const [localEpic, setLocalEpic] = useState(epic);
  const [prevEpic, setPrevEpic] = useState(epic);
  const localEpicRef = useRef(epic);
  const members = useAppSelector((state) => state.members.members);
  const [isEditingAssignee, setIsEditingAssignee] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const tasks = useAppSelector((state) => state.tasks.tasks);

  const handleAddTask = () => {
    router.push(`/project/${projectId}/tasks/new?epicId=${epic.id}`);
  };

  const form = useForm<updateEpicFormData>({
    defaultValues: {
      title: epic.title,
      description: epic.description ?? "",
      assignee_id: epic.assignee?.sub ?? "",
      deadline: epic.deadline ?? "",
    },
    resolver: zodResolver(updateEpicSchema),
    mode: "onChange",
  });

  const {
    register,
    control,
    reset,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = form;

  useEffect(() => {
    localEpicRef.current = localEpic;
  }, [localEpic]);

  useEffect(() => {
    dispatch(fetchTasksForEpic({ projectId: projectId, epicId: epic.id }));
  }, [epic.id, dispatch, projectId]);

  useEffect(() => {
    dispatch(fetchMembers({ projectId }));
  }, [projectId, dispatch]);

  if (epic !== prevEpic) {
    setPrevEpic(epic);
    setLocalEpic(epic);
    setIsEditingAssignee(false);
    reset({
      title: epic.title,
      description: epic.description ?? "",
      assignee_id: epic.assignee?.sub ?? "",
      deadline: epic.deadline ?? "",
    });
  }

  const createdByInitials = getInitials(localEpic.created_by?.name ?? "");
  const formatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(localEpic.created_at));

  const assigneeOptions: AssigneeOption[] = [
    { value: "", label: "Unassigned" },
    ...(members?.map((member) => ({
      value: member.user_id,
      label: member.metadata?.name ?? member.email,
    })) ?? []),
  ];

  const selectedAssignee =
    assigneeOptions.find(
      (option) => option.value === (localEpic.assignee?.sub ?? ""),
    ) ?? assigneeOptions[0];

  const commitEpic = (partial: Partial<Epic>) => {
    const next = { ...localEpicRef.current, ...partial };
    localEpicRef.current = next;
    setLocalEpic(next);
    onEpicUpdated?.(next);
  };

  const saveEpicField = async (
    patch: UpdateEpicPayload,
    onError: () => void,
  ) => {
    try {
      const res = await fetch(
        `/api/project/${projectId}/epicDetails/${localEpicRef.current.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update epic");
      }
    } catch {
      onError();
      toast.error("Failed to update epic. Please try again.");
    }
  };

  const handleTitleBlur = async () => {
    const isValid = await trigger("title");
    const nextTitle = getValues("title").trim();
    const previousTitle = localEpicRef.current.title;

    if (!isValid) {
      setValue("title", previousTitle, { shouldValidate: true });
      return;
    }

    if (nextTitle === previousTitle) {
      return;
    }

    setValue("title", nextTitle);
    commitEpic({ title: nextTitle });

    await saveEpicField({ title: nextTitle }, () => {
      setValue("title", previousTitle, { shouldValidate: true });
      commitEpic({ title: previousTitle });
    });
  };

  const handleDescriptionBlur = async () => {
    const isValid = await trigger("description");
    if (!isValid) {
      setValue("description", localEpicRef.current.description ?? "");
      return;
    }

    const nextDescription = (getValues("description") ?? "").trim();
    const previousDescription = localEpicRef.current.description ?? "";

    if (nextDescription === previousDescription) {
      return;
    }

    setValue("description", nextDescription);
    commitEpic({ description: nextDescription || undefined });

    await saveEpicField({ description: nextDescription || null }, () => {
      setValue("description", previousDescription);
      commitEpic({ description: previousDescription || undefined });
    });
  };

  const handleAssigneeChange = async (option: AssigneeOption | null) => {
    const nextAssigneeId = option?.value ?? "";
    const previousAssignee = localEpicRef.current.assignee;
    const previousAssigneeId = previousAssignee?.sub ?? "";

    if (nextAssigneeId === previousAssigneeId) {
      setIsEditingAssignee(false);
      return;
    }

    const member = members?.find((item) => item.user_id === nextAssigneeId);
    const nextAssignee = member ? memberToUserInfo(member) : null;

    setValue("assignee_id", nextAssigneeId);
    commitEpic({ assignee: nextAssignee });
    setIsEditingAssignee(false);

    await saveEpicField({ assignee_id: nextAssigneeId || null }, () => {
      setValue("assignee_id", previousAssigneeId);
      commitEpic({ assignee: previousAssignee });
    });
  };

  const handleDeadlineChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const nextDeadline = event.target.value;
    const previousDeadline = localEpicRef.current.deadline ?? "";

    if (nextDeadline === previousDeadline) {
      return;
    }

    setValue("deadline", nextDeadline);
    commitEpic({ deadline: nextDeadline });

    await saveEpicField({ deadline: nextDeadline || null }, () => {
      setValue("deadline", previousDeadline);
      commitEpic({ deadline: previousDeadline });
    });
  };

  const titleRegister = register("title");
  const descriptionRegister = register("description");
  const deadlineRegister = register("deadline");

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard')
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={"/icons/epics.svg"}
            alt="epics"
            width={20}
            height={14}
            style={{ width: "20px", height: "14px" }}
          />
          <p>{localEpic.epic_id}</p>
        </div>
       <div className="flex items-center gap-2">
        <button
        onClick={handleCopyLink}
         className="flex items-center gap-2 text-[#434654] text-[14px]">
          <CopyIcon />
          <p>Copy link</p>

        </button>
       <button onClick={onClose} className="text-xl font-bold text-[#041B3C99] " type="button">
          <CloseModal />
        </button>
       </div>
      </div>

      <div className="w-full flex flex-col items-start justify-between gap-8">
        <div className="w-full">
          <Input
            type="text"
            className="rounded-sm bg-surface-highest py-4 px-2 w-full"
            placeholder="e.g. Structural Foundation Phase"
            {...titleRegister}
            onBlur={(event) => {
              void titleRegister.onBlur(event);
              void handleTitleBlur();
            }}
          />
          {errors.title && (
            <div className="flex items-center gap-1 mt-1">
              <Image
                src={"/icons/error.svg"}
                alt="error"
                width={13}
                height={13}
                style={{ width: "13px", height: "13px" }}
              />
              <p className="text-[12px] text-[#BA1A1A]">
                {errors.title.message}
              </p>
            </div>
          )}
        </div>

        <textarea
          id="description"
          className="w-full grow bg-surface-highest py-4 px-2 rounded-md resize-none"
          rows={5}
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div className="flex flex-col items-start gap-2">
          <p className="text-[10px] font-bold text-text-secondary">
            created by
          </p>
          <div className="flex gap-2 w-full text-[14px]">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-container text-white">
              <span className="text-[10px] font-bold uppercase">
                {createdByInitials || "UN"}
              </span>
            </div>
            <p>{localEpic.created_by?.name ?? "Unknown"}</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2">
          <label
            htmlFor="assignee"
            className="text-[10px] font-bold text-text-shadow"
          >
            Assignee
          </label>
          {isEditingAssignee ? (
            <Controller
              control={control}
              name="assignee_id"
              render={({ field }) => (
                <Select
                  inputId="assignee"
                  className="w-full"
                  options={assigneeOptions}
                  value={
                    assigneeOptions.find(
                      (option) => option.value === field.value,
                    ) ?? assigneeOptions[0]
                  }
                  onChange={(option) =>
                    handleAssigneeChange(option as AssigneeOption | null)
                  }
                  onMenuClose={() => setIsEditingAssignee(false)}
                  autoFocus
                  defaultMenuIsOpen
                  components={{
                    Option: CustomOption,
                    SingleValue: CustomSingleValue,
                  }}
                />
              )}
            />
          ) : (
            <button
              type="button"
              className="flex items-center gap-2 w-full text-[14px] text-left"
              onClick={() => setIsEditingAssignee(true)}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-white">
                <span className="text-[10px] font-bold uppercase">
                  {getInitials(selectedAssignee.label) || "U"}
                </span>
              </div>
              <p>{selectedAssignee.label}</p>
            </button>
          )}
        </div>

        <div className="flex flex-col items-start gap-2">
          <label
            htmlFor="deadline"
            className="text-[10px] font-bold text-text-shadow w-full"
          >
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            className="border-2 border-surface-low rounded-md p-2"
            {...deadlineRegister}
            onChange={(event) => {
              void deadlineRegister.onChange(event);
              void handleDeadlineChange(event);
            }}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <p className="text-[10px] font-bold">Created at</p>
          <p className="text-[14px] flex gap-2 items-center">
            <Image
              src={"/icons/date.svg"}
              alt="time"
              width={13}
              height={15}
              style={{ width: "13px", height: "15px" }}
            />
            {formatted}
          </p>
        </div>
      </div>

      <div className="mt-2 ">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks</p>
          <button
            onClick={handleAddTask}
            className="text-primary text-[14px] font-semibold"
          >
            + Add Task
          </button>
        </div>
        {tasks.length === 0 ? (
          <div className="mt-2 w-full bg-surface-low rounded-sm p-4 flex flex-col items-center justify-center gap-4">
            <span className="p-4 bg-[#D7E2FF] rounded-sm">
              <Image
                src={"/icons/epicsTasks.svg"}
                alt="tasks"
                width={18}
                height={16}
                style={{ width: "18px", height: "16px" }}
              />
            </span>
            <p className="text-lg font-medium">
              No tasks have been added to this epic yet
            </p>
            <button
              onClick={handleAddTask}
              className="bg-primary text-white px-4 py-2 rounded-md "
            >
              + Add Tasks
            </button>
          </div>
        ) : (
                      <div className="overflow-y-scroll h-[180px]">
                        {tasks.map((task) => <TaskCardEpic key={task.id} task={task} />)}
                      </div>

          

)}
      </div>
    </div>
  );
}
