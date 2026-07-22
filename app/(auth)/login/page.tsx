"use client";

import Button from "@/app/components/button/Button";
import Input from "@/app/components/input/Input";
import { useAppDispatch } from "@/app/hooks/store.hooks";
import { LoginFormData, loginSchema } from "@/app/schemas/signInSchema";
import { setUser } from "@/app/store/features/user.slice";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rememberMe }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage("Invalid email or password");
        return;
      }

      if (result.user) {
        dispatch(setUser(result.user));
      }

      router.push("/project");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="section">
      <div className="fixed top-0 left-0 right-0 bg-transparent p-4">
        <div className="ml-10 flex items-center gap-2">
          <Image
            src={"/Logo.svg"}
            alt="Logo"
            width={18}
            height={20}
            style={{ width: "18px", height: "20px" }}
          />
          <p className="font-bold text-xl ">Taskly</p>
        </div>
      </div>

      <div className="bg-white shadow-card rounded-lg flex flex-col gap-4 items-center justify-center py-12 w-full md:max-w-[480px] m-auto">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="text-neutral-700 text-sm font-normal">
          Log in to continue managing your tasks.
        </p>
        <form className="w-[384px] space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            placeholder="yourname@company.com"
            {...register("email")}
            error={errors.email?.message}
          />

        
            <Input
              label={
                <div className="flex w-full items-center justify-between">
                  <span>Password</span>
                  <Link
                    href="/forgot-password"
                    className="text-primary font-bold text-[11px] md:hidden"
                  >
                    Forgot?
                  </Link>
                </div>
              }
              type="password"
              placeholder="Password"
              {...register("password")}
              error={errors.password?.message}
            />
          

          {errorMessage && (
            <p className="text-red-500 text-sm font-normal">{errorMessage}</p>
          )}

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <Link
            href={'/forgot-password'}
              type="button"
              className="text-sm text-primary font-semibold hidden md:block"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            displayText={isSubmitting ? "Loading..." : "Login"}
            disabled={isSubmitting}
            className="w-full btn-primary"
          />
        </form>

        <p className="text-neutral-700 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
