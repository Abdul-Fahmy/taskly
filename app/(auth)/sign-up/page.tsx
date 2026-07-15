"use client";
import Button from "@/app/components/button/Button";
import Input from "@/app/components/input/Input";
import { SignupFormData } from "@/app/types/signUpForm";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/app/schemas/signUpSchema";
import { signup } from "@/app/serviecs/auth.services";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    const { confirmPassword, ...payload } = data;

    try {
      const response = await signup(payload);
      if (response) {
        router.push("/project");
      }
    } catch (error) {
      console.error(error);
      if (typeof error === "object" && error !== null && "msg" in error) {
        setErrorMessage(error.msg as string);
      }
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="card flex flex-col gap-4 items-center justify-center py-12 w-3/4 m-auto">
          <h1 className="text-3xl font-semibold">Create your workspace</h1>
          <p className="text-neutral-700 text-sm font-normal">
            Join the editorial approach to task management.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="w-3/4 space-y-4 ">
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
              label="Job title (optinal)"
              type="text"
              placeholder="e.g. Project Manager"
              {...register("data.job_title")}
              error={errors.data?.job_title?.message}
            />
            <div className="flex  items-center  justify-between gap-4">
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
            <p className="text-neutral-700 text-sm ">
              Already have an account?{" "}
              <Link href="/log-in" className="text-primary font-semibold">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
