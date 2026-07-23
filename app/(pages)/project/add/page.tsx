"use client";

import Button from "@/app/components/button/Button";
import Input from "@/app/components/input/Input";
import { projectFormData, projectSchema } from "@/app/schemas/addProjectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

const breadcrumbMap: Record<string, string> = {
  project: "Projects",
  add: "Add New Project",
};

export default function AddProject() {
  const pathname = usePathname();
  const previousPage =
    pathname.substring(0, pathname.lastIndexOf("/")) || "/project";
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => breadcrumbMap[segment] || segment);

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<projectFormData>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
  });
  const description = useWatch({ control, name: "description" });

  async function onSubmit(data: projectFormData) {
    setErrorMsg(null);
    let toastId = toast.loading("Creating project...");

    try {
      const response = await fetch("/api/addproject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMsg(result?.msg || "Failed to create project");
        return;
      }
      reset({ name: "", description: "" });
      toast.success("Project created successfully", { id: toastId });
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
      }, 3000);
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
        <h3 className="font-bold text-[36px]">Add New Project</h3>
      </div>

      <div className="w-full md:w-[672px] bg-white rounded-md shadow-[0_1px_2px_0_#0000000D] mx-auto ">
        <div className="p-8 flex items-center justify-start gap-4">
          <div className="hidden md:blockp-3 h-auto rounded-md bg-[#0052CC1A]">
            <Image
              src={"/icons/icon.svg"}
              alt="icon"
              width={22}
              height={20}
              style={{ width: "22px", height: "20px" }}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-[24px] font-semibold text-[#041B3C] leading-8">
              Initialize New Project
            </p>
            <p className="text-[#4F5F7B] text-[14px] leading-5 ">
              Define the scope and foundational details of your project.
            </p>
          </div>
        </div>

        <form
          className="space-y-8 px-8"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="">
            <span className="text-[#4F5F7B] font-bold text-[11px] uppercase">
              Project title *
            </span>
            <Input
              placeholder="Enter project title"
              type="text"
              {...register("name")}
            />
            {errors.name && (
              <div className="flex items-center gap-1">
                <Image
                  src={"/icons/error.svg"}
                  alt="error"
                  width={13}
                  height={13}
                  style={{ width: "13px", height: "13px" }}
                />
                <p className="text-[12px] text-[#BA1A1A]">
                  {" "}
                  {errors.name?.message}
                </p>
              </div>
            )}
          </div>
          <div className="">
            <span className="text-[#4F5F7B] font-bold text-[11px] uppercase">
              DESCRIPTION
            </span>
            <textarea
              title="DESCRIPTION"
              maxLength={501}
              {...register("description")}
              className="w-full bg-surface-highest py-3.5 px-4 rounded-md resize-none"
              rows={10}
              placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
            />
            <div className="flex items-center justify-between">
              {errors.description?.message ? (
                <p className="text-[12px] text-error">
                  {errors.description.message}
                </p>
              ) : (
                <span />
              )}
              <p className="text-xs text-[#4F5F7B]">
                {description?.length ?? 0}/500
              </p>
            </div>
          </div>

          {errorMsg && (
            <p className="text-error text-sm font-normal">{errorMsg}</p>
          )}

          <div className="mt-[60px] pb-8 flex items-center justify-between">
            <Link
              href={previousPage}
              className="font-bold text-[14px] text-[#4F5F7B] py-3 px-4 "
            >
              Back
            </Link>
            <Button
              displayText={isSubmitting ? "Loading..." : "Create Project"}
              type="submit"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
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
