import Image from "next/image";
import Input from "../input/Input";
import Link from "next/link";
import Button from "../button/Button";
import { ProjectFormProps } from "@/app/types/projectFormCompnent";

export default function ProjectForm({
  form,
  onSubmit,
  errorMsg,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const description = watch("description");

  return (
    <div className="w-full md:w-2xl bg-white rounded-md shadow-[0_1px_2px_0_#0000000D] mx-auto ">
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

        <div className="mt-15 pb-8 flex items-center justify-between">
          <Link
            href={"/project"}
            className="font-bold text-[14px] text-[#4F5F7B] py-3 px-4 "
          >
            Back
          </Link>
          <Button
            displayText={isSubmitting ? "Loading..." : "Save Changes"}
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
