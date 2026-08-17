"use client";

import TaskForm from "@/app/components/tasks/TaskForm";
import { breadcrumbMap } from "@/app/constant/breadcrumbs";
import { useAppSelector } from "@/app/hooks/store.hooks";
import { getApiErrorMessage } from "@/app/lib/api";
import { tasksFormData, tasksSchema } from "@/app/schemas/newTasksSchema";
import { generateBreadcrumbs } from "@/app/services/breadcrum";
import { TaskStatus } from "@/app/types/task";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function NewTaskPage() {
  const searchParams = useSearchParams();
  const selectedEpicId = searchParams.get("epicId");
  const selectedTaskStatus = searchParams.get("status");
  const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const project = useAppSelector((state) => state.project.project);
  const breadcrumbs = generateBreadcrumbs(pathname, breadcrumbMap, {
    [projectId]: project?.name || "projectId",
  });

  const form = useForm<tasksFormData>({
    mode: "onChange",
    resolver: zodResolver(tasksSchema),
    defaultValues: {
      title: "",
      description: "",
      assignee_id: "",
      due_date: "",
      status: "TO_DO",
      epic_id: selectedEpicId ?? "",
      project_id: projectId,
    },
  });

  useEffect(() => {
    if (selectedEpicId) {
      form.setValue("epic_id", selectedEpicId);
    }
    if (selectedTaskStatus) {
      form.setValue("status", selectedTaskStatus as TaskStatus);
    }
  }, [selectedEpicId, selectedTaskStatus, form]);

  const onSubmit = async (data: tasksFormData) => {
    setErrorMsg(null);
    const toastId = toast.loading("Creating task...");
    try {
      const response = await fetch(`/api/project/${projectId}/addTask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          project_id: projectId,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const message = result?.message || "Failed to create task";
        setErrorMsg(message);
        toast.error(message, { id: toastId });
        return;
      }

      form.reset({
        title: "",
        description: "",
        assignee_id: "",
        due_date: "",
        status: "TO_DO",
        epic_id: "",
        project_id: projectId,
      });
      toast.success("Task created successfully", { id: toastId });
      router.push(`/project/${projectId}/tasks`);
      router.refresh();
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to create task");
      setErrorMsg(message);
      toast.error(message, { id: toastId });
    }
  };

  return (
    <div className="">
      <div className="hidden md:flex flex-col gap-2 items-start justify-start pt-6 pl-6">
        <span className="font-bold uppercase text-[12px] flex items-center gap-1 ">
          {breadcrumbs.map((item, index) => (
            <span key={item}>
              {index > 0 && <span className="mx-2 text-neutral-400">&gt;</span>}

              <span
                className={
                  index === breadcrumbs.length - 1
                    ? "text-black"
                    : "text-[#43465499]"
                }
              >
                {item}
              </span>
            </span>
          ))}
        </span>
        <h3 className="font-bold text-[36px]">Create New Task</h3>
        <p className="text-text-secondary text-[14px]">
          Initialize a new work item within the Architectural Workspace
          ecosystem.
        </p>
      </div>
      <div className="mx-auto mt-8 max-w-2xl">
        <TaskForm form={form} onSubmit={onSubmit} errorMsg={errorMsg} />
      </div>
    </div>
  );
}
