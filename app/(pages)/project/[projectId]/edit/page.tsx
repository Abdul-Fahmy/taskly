"use client";
import ProjectForm from "@/app/components/project/projectForm/ProjectForm";
import { breadcrumbMap } from "@/app/constant/breadcrumbs";
import { useAppSelector } from "@/app/hooks/store.hooks";
import { projectFormData, projectSchema } from "@/app/schemas/addProjectSchema";
import { generateBreadcrumbs } from "@/app/services/breadcrum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TipIcon from "@/app/assets/icons/tipIcon.svg";

export default function EditPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();
  const project = useAppSelector((state) => state.project.project);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const breadcrumbs = generateBreadcrumbs(pathname, breadcrumbMap, {
    [projectId]: project?.name || projectId,
  });

  const form = useForm<projectFormData>({
    values: {
      name: project?.name || "",
      description: project?.description || "",
    },
    resolver: zodResolver(projectSchema),
    mode: "onChange",
  });

  async function onSubmit(data: projectFormData) {
    setErrorMsg(null);
    const toastId = toast.loading("Creating project...");

    try {
      const response = await fetch(`/api/project/${projectId}/editproject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMsg(result?.msg || "Failed to Edit project");
        return;
      }
      form.reset({ name: "", description: "" });
      toast.success("Project Edited successfully", { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred",
        { id: toastId },
      );
      setErrorMsg(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setTimeout(() => {
        toast.dismiss(toastId);
        router.push("/project");
      }, 2000);
    }
  }

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
                    ? "text-black"
                    : "text-[#43465499]"
                }
              >
                {item}
              </span>
            </span>
          ))}
        </span>
        <h3 className="font-bold text-[36px]">Edit Project</h3>
      </div>

      <ProjectForm
        form={form}
        onSubmit={onSubmit}
        errorMsg={errorMsg}
        displayText="Save changes"
      />
      <div className="md:w-2xl mx-auto pb-8 flex items-center justify-center gap-2 mt-8 px-3">
        <TipIcon />
        <p className="text-[12px] text-[#4F5F7B] ">
          <span className="font-bold">Pro Tip:</span> You can invite project
          members and assign epics immediately after the initial creation
          process.
        </p>
      </div>
    </>
  );
}
