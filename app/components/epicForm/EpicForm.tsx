"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Button from "../button/Button";
import { FormProps } from "@/app/types/epicForm";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Member } from "@/app/types/members";
import { epicFormData } from "@/app/schemas/addEpicSchema";

export default function EpicForm({ form, onSubmit, errorMsg }: FormProps<epicFormData>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const { projectId } = useParams<{ projectId: string }>();

  const [members,setMembers] = useState<Member[] | null> (null)




  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/project/${projectId}/members`);
        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }
        const result = (await response.json()) as Member[];
        setMembers(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error(error);
        setMembers([]);
      }
    };
    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  return (
    <div className="max-w-212 mx-auto bg-white mt-10 p-8">
      <form
        action=""
        className="w-full space-y-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex  items-center gap-5">
          <p className="w-1/4">Title *</p>
          <div className="grow">
            <input
              type="text"
              className="rounded-sm bg-surface-highest py-4 px-2  w-full"
              placeholder="e.g. Structural Foundation Phase"

              {...register("title")}
            />
            {errors.title && (
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
                  {errors.title?.message}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-start gap-5 ">
          <p className="w-1/4">Description</p>
          <textarea
            id="description"
            className="grow bg-surface-highest py-4 px-2 rounded-md resize-none "
            rows={5}
            placeholder="Describe the scope and objectives of this epic..."
            {...register("description")}
          ></textarea>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-start w-full gap-4">
            <p>Assignee</p>
            <select
              {...register("assignee_id")}
              id="assignee"
              className="bg-surface-highest py-4 px-2 rounded-sm w-full"
            >
              <option value="" disabled>
                Select a member...
              </option>
              {members?.map((member) => (
                <option key={member.member_id} value={member.user_id}>
                  {member.metadata?.name ?? member.email}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-start w-full gap-4">
            <p>Deadline</p>
            <input
              type="date"
              id="date"
              {...register("deadline")}
              className="bg-surface-highest py-4 px-2 rounded-sm w-full"
            ></input>
          </div>
        </div>
        <div className="flex justify-end items-center gap-4">
          <Link
            href={`/project/${projectId}/epics`}
            className="text-neutral-700 py-4 px-2"
          >
            Back
          </Link>
          <Button
            displayText={`${isSubmitting ? "Creating..." : "Create Epic"}`}
            className="btn-primary"
            disabled={isSubmitting}
            type="submit"
          />
        </div>
      </form>
      {errorMsg && <p className="text-error text-sm font-normal">{errorMsg}</p>}
    </div>
  );
}
