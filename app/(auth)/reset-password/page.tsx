"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Input from "@/app/components/input/Input";
import Button from "@/app/components/button/Button";
import {
  passwordRules,
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/app/schemas/resetPassword";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const SUCCESS_MESSAGE =
  "Your password has been updated successfully. You can now log in";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });
  const password = useWatch({ control, name: "password" });

  const passwordStatus = Object.values(passwordRules).map((rule) => ({
    message: rule.message,
    valid: rule.regex.test(password || ""),
  }));

  useEffect(() => {
    if (!successMessage) return;

    const timer = window.setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [successMessage, router]);

  async function onSubmit(data: ResetPasswordFormData) {
    if (!accessToken) {
      setErrorMessage("Invalid or expired reset link.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/resetpassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: data.password,
          access_token: accessToken,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(result?.msg || "Failed to reset password");
        return;
      }

      setSuccessMessage(SUCCESS_MESSAGE);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (!accessToken) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <p className="flex items-center gap-2">
          <Image
            alt="expired Icon"
            src={"/icons/expiredIcon.svg"}
            width={30}
            height={30}
            style={{ width: "30px", height: "30px" }}
          />
          Invalid or expired reset link.
        </p>
        <Link href={"/login"} className="text-primary underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="fixed top-0 left-0 right-0 bg-transparent p-4">
        <Link href={"/"} className="ml-10 flex items-center gap-2">
          <Image
            src={"/Logo.svg"}
            alt="Logo"
            width={18}
            height={20}
            style={{ width: "18px", height: "20px" }}
          />
          <p className="font-bold text-xl ">Taskly</p>
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-card flex flex-col gap-4 items-center justify-center py-12 w-full md:max-w-[576px] m-auto px-8">
        <h1 className="text-3xl font-semibold">Create a New Password</h1>
        <p className="text-neutral-700 text-sm font-normal">
          Create a new, strong password to secure your workstation access.
        </p>
        <form
          className="min-w-[414px] space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex flex-col items-center justify-between gap-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Password"
              {...register("password")}
              error={errors.password?.message}
              disabled={Boolean(successMessage)}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              disabled={Boolean(successMessage)}
            />
          </div>
          <p>Security Requirements</p>

          <div className="flex bg-[#E8EDFF] p-3 mt-6 min-w-[414px]">
            <ul className="text-[11px] space-y-2 w-full flex flex-wrap">
              {passwordStatus.map((rule) => (
                <li
                  key={rule.message}
                  className={`flex w-1/2 items-center gap-1 text-[13px] ${
                    rule.valid ? "text-black" : "text-[#737685]"
                  }`}
                >
                  <span>
                    {rule.valid ? (
                      <Image
                        src={"/icons/checkedIcon.svg"}
                        alt="check icon"
                        width={12}
                        height={12}
                        style={{
                          width: "12px",
                          height: "12px",
                        }}
                      />
                    ) : (
                      <Image
                        src={"/icons/uncheckedIcon.svg"}
                        alt="unchecked icon"
                        width={12}
                        height={12}
                        style={{
                          width: "12px",
                          height: "12px",
                        }}
                      />
                    )}
                  </span>
                  {rule.message}
                </li>
              ))}
            </ul>
          </div>

          <Button
            type="submit"
            displayText={isSubmitting ? "Loading..." : "Update password"}
            disabled={isSubmitting || Boolean(successMessage)}
          />

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          {successMessage && (
            <p className="text-green-700 text-sm">{successMessage}</p>
          )}
        </form>
        <Link href={"/login"} className="text-primary">
          Back to sign in
        </Link>
      </div>
    </section>
  );
}
