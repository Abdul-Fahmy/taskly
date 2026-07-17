"use client";

import Button from "@/app/components/button/Button";
import Input from "@/app/components/input/Input";
import { useAppDispatch } from "@/app/hooks/store.hooks";
import { SignupFormData, signupSchema } from "@/app/schemas/signUpSchema";
import { setUser } from "@/app/store/features/user.slice";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    setErrorMessage(null);

    const payload = {
      email: data.email,
      password: data.password,
      data: data.data,
    };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.msg ?? "Signup failed");
        return;
      }

      if (result.hasSession && result.user) {
        dispatch(setUser(result.user));
        router.push("/project");
        router.refresh();
        return;
      }

      setErrorMessage(
        "Account created. Please confirm your email, then log in.",
      );
      router.push("/login");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="section">
      <div className="mt-4">
        <div className="bg-white rounded-lg shadow flex flex-col gap-4 items-center justify-center py-12 w-full md:w-3/4 m-auto">
          <h1 className="text-3xl font-semibold">Create your workspace</h1>
          <p className="text-neutral-700 text-sm font-normal">
            Join the editorial approach to task management.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="w-3/4 space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              {...register("data.name")}
              error={errors.data?.name?.message}
            />

            <Input
              label="Email"
              type="email"
              placeholder="yourname@company.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              label="Job title (optional)"
              type="text"
              placeholder="e.g. Project Manager"
              {...register("data.job_title")}
              error={errors.data?.job_title?.message}
            />

            <div className="flex-col md:flex-rowitems-center justify-between gap-4">
              <Input
                label="Password"
                type="password"
                placeholder="Password"
                {...register("password")}
                error={errors.password?.message}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat your password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
            </div>

            <div className="hidden md:flex bg-[#E8EDFF] p-4 gap-2 mt-6">
              <ul className="text-[11px] text-[#434654]">
                <li>At least 8 characters</li>
                <li>One uppercase, lowercase, and digit</li>
                <li>One special character</li>
              </ul>
            </div>

            <Button
              type="submit"
              displayText={isSubmitting ? "Loading..." : "Create Account"}
              disabled={isSubmitting}
            />

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
          </form>

          <div>
            <p className="text-neutral-700 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
