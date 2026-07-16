"use client";

import Button from "@/app/components/button/Button";
import Input from "@/app/components/input/Input";
import { LoginFormData, loginSchema } from "@/app/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

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

      if (!response.ok) {
        setErrorMessage("Invalid email or password");
        return;
      }

      router.push("/project");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="card flex flex-col gap-4 items-center justify-center py-12 w-3/4 m-auto">
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-neutral-700 text-sm font-normal">
            Log in to continue managing your tasks.
          </p>
          <form className="w-3/4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              type="email"
              placeholder="yourname@company.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              label="Password"
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

              <button
                type="button"
                className="text-sm text-primary font-semibold"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              displayText={isSubmitting ? "Loading..." : "Login"}
              disabled={isSubmitting}
            />
          </form>

          <p className="text-neutral-700 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
