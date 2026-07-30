"use client";
import EpicForm from "@/app/components/epicForm/EpicForm";
import { breadcrumbMap } from "@/app/constant/breadcrumbs";
import { useAppSelector } from "@/app/hooks/store.hooks";
import { getApiErrorMessage } from "@/app/lib/api";
import { epicFormData, epicSchema } from "@/app/schemas/addEpicSchema";
import { generateBreadcrumbs } from "@/app/services/breadcrum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function NewEpicPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();
  const project = useAppSelector((state) =>
    state.project.projects.find((project) => project.id === projectId),
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const breadcrumbs = generateBreadcrumbs(pathname, breadcrumbMap, {
    [projectId]: project?.name || projectId,
  });

  const form = useForm<epicFormData>({
    defaultValues: {
      title: "",
      description: "",
      assignee_id: "",
      deadline: "",
      project_id: projectId ?? "",
    },
    resolver: zodResolver(epicSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: epicFormData) => {
    setErrorMsg(null);
    const toastId = toast.loading("Creating epic...");
    try {
      const response = await fetch(`/api/project/${projectId}/epics/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const message = result?.msg || "Failed to create epic";
        setErrorMsg(message);
        toast.error(message, { id: toastId });
        return;
      }

      form.reset({
        title: "",
        description: "",
        assignee_id: "",
        deadline: "",
        project_id: projectId,
      });
      toast.success("Epic created successfully", { id: toastId });
      router.push(`/project/${projectId}/epics`);
      router.refresh();
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to create epic");
      setErrorMsg(message);
      toast.error(message, { id: toastId });
    }
  };

  return (
    <>
      <div className="hidden md:flex flex-col gap-4 items-start justify-start pt-6 pl-6">
        <span className="font-bold uppercase text-[12px] flex items-center gap-1 ">
          {breadcrumbs.map((item, index) => (
            <span key={item}>
              {index > 0 && <span className="mx-2 text-neutral-400">&gt;</span>}

              <span
                className={
                  index === breadcrumbs.length - 1
                    ? "text-primary"
                    : "text-[#43465499]"
                }
              >
                {item}
              </span>
            </span>
          ))}
        </span>
        <h3 className="font-bold text-[36px]">Create New Epic</h3>
        <p className="text-[#434654] text-[16px]">
          Define a major project phase or high-level milestone to group
          <br /> related tasks and track architectural progress.
        </p>
      </div>
      <EpicForm form={form} errorMsg={errorMsg} onSubmit={onSubmit} />
    </>
  );
}
