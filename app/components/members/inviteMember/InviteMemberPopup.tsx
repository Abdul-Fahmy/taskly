"use client";
import CloseModal from "@/app/assets/icons/closeModal.svg";
import MemberIcon from "@/app/assets/icons/inviteMember.svg";
import Input from "../../input/Input";
import Button from "../../button/Button";
import { useForm } from "react-hook-form";
import {
  InviteMemberFormData,
  inviteMemberSchema,
} from "@/app/schemas/invitationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
export default function InviteMemberPopup({
  onClose,
}: {
  onClose: () => void;
}) {
  const { projectId } = useParams<{ projectId: string }>();

  const form = useForm<InviteMemberFormData>({
    defaultValues: {
      p_email: "",
      p_project_id: projectId,
      p_app_url: "https://taskly-one-dusky.vercel.app/",
      p_base_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
    resolver: zodResolver(inviteMemberSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: InviteMemberFormData) => {
    const toastId = toast.loading("Sending invitation...");
    try {
      const response = await fetch(`/api/project/${projectId}/members/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        const message = result?.msg || "Failed to send invitation";
        toast.error(message, { id: toastId });
        return;
      }
      toast.success("Invitation sent successfully", { id: toastId });
      onClose();
      form.reset();
    } catch {
      const message = "Failed to send invitation";
      toast.error(message, { id: toastId });
      return;
    }
  };

  return (
    <div className="flex flex-col items-start justify-center gap-2 p-8">
      <div className="flex items-center justify-between w-full ">
        <div className="w-12 h-12 rounded-md bg-[#F1F3FF] flex items-center justify-center">
          <MemberIcon />
        </div>
        <button onClick={onClose}>
          <CloseModal />
        </button>
      </div>
      <h3 className="text-2xl font-bold text-[#041B3C]">Invite Team Member</h3>
      <p className="text-[#4F5F7B] text-[14px]">
        Send an invitation to join the Architectural Studio workspace.
      </p>

      <form className="w-full space-y-4">
        <div className="w-full">
          <label
            htmlFor="email"
            className="uppercase text-[11px] font-bold text-[#4F5F7B]"
          >
            Email Address
          </label>
          <Input
            placeholder="Enter email address"
            {...form.register("p_email")}
            error={form.formState.errors.p_email?.message}
          />
        </div>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onClose}
            className="text-[#4F5F7B] text-[14px] font-semibold w-1/2"
          >
            Close
          </button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            displayText={`${form.formState.isSubmitting ? "Sending..." : "Send Invitation"}`}
            className="w-1/2"
            type="submit"
            disabled={!form.formState.isValid}
          />
        </div>
      </form>
    </div>
  );
}
