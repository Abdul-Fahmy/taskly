"use client";

import Button from "@/app/components/button/Button";
import Input from "@/app/components/input/Input";
import ProjectForm from "@/app/components/projectForm/ProjectForm";
import { useAppSelector } from "@/app/hooks/store.hooks";
import { projectFormData, projectSchema } from "@/app/schemas/addProjectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

const breadcrumbMap: Record<string, string> = {
  project: "Projects",
  projectId: "Project Title",

  edit: "Edit",
};

export default function EditPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { projectId } = useParams();
  const project = useAppSelector((state) =>
    state.project.projects.find((project) => project.id === projectId),
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => breadcrumbMap[segment] || segment);

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
      <div className="hidden md:flex flex-col gap-4 items-start justify-start pt-[24px] pl-6">
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
        <h3 className="font-bold text-[36px]">Edit Project</h3>
      </div>

  <ProjectForm form={form} onSubmit={onSubmit} errorMsg={errorMsg}  />
      <div className="md:w-[672px] mx-auto pb-8 flex items-center justify-center gap-2 mt-8 px-3">
        <Image
          src={"/icons/tip.svg"}
          alt="tip icon"
          width={12}
          height={15}
          style={{ width: "12px", height: "15px" }}
        />
        <p className="text-[12px] text-[#4F5F7B] ">
          <span className="font-bold">Pro Tip:</span> You can invite project
          members and assign epics immediately after the initial creation
          process.
        </p>
      </div>
    </>
  );
}
