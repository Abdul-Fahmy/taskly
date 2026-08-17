"use client";

import { useRouter, useSearchParams } from "next/navigation";
import LogoTaskly from "@/app/assets/icons/logoTaskly.svg";
import UserInvitation from "@/app/assets/icons/userInvitation.svg"
import Button from "@/app/components/button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMemberFormData, acceptMemberSchema } from "@/app/schemas/acceptInvitationSchema";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function InvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter()

  const token = searchParams.get("token");

  const form = useForm<AcceptMemberFormData>({
    resolver: zodResolver(acceptMemberSchema),
    defaultValues: {
      p_token: token!,
    },
  });
  const onSubmit = async(data: AcceptMemberFormData) => {
    const toastId = toast.loading("Accepting invitation...");
    try {
      const response = await fetch(`/api/acceptInvitation?token=${token}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to accept invitation");
      }
      toast.success("Invitation accepted", { id: toastId });
      router.push("/project");
    } catch (error) {
      toast.error("Failed to accept invitation");
    }
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items center">
        <div className="flex items-center gap-2">
          <LogoTaskly />
          <h2 className="uppercase text-[24px] font-bold text-[#041B3C]">
            TASKLY
          </h2>
        </div>
        <div className="bg-white border-t border-[#003D9B] rounded-md p-12 flex flex-col items-center ">
            <div className="bg-[#E0E8FF] rounded-full py-1 px-3 flex items-center ">
                <UserInvitation />
                <p className="uppercase text-[11px] font-bold text-[#434654]">New Project Invitation</p>
            </div>
            <p className="text-[30px] font-semibold text-[#041B3C] ">You've been invited to join new project</p>
            <Button displayText="Accept Invitation" onClick={form.handleSubmit(onSubmit)} />
        </div>
      </div>
    </div>
  );
}
