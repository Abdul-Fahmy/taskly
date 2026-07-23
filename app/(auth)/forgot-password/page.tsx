"use client";

import Button from "@/app/components/button/Button";
import Input from "@/app/components/input/Input";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/app/schemas/forgotPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const SUCCESS_MESSAGE =
  "If an account exists with this email, we’ve sent a password reset link.";
const MAX_TRIALS = 3;
const COOLDOWN_SECONDS = 5 * 60;
const STORAGE_KEY = "taskly:forgot-password";

type ForgotPasswordStorage = {
  trials: number;
  cooldownEndsAt: number | null;
};

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function readStorage(): ForgotPasswordStorage | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ForgotPasswordStorage;
    if (
      typeof parsed.trials !== "number" ||
      (parsed.cooldownEndsAt !== null &&
        typeof parsed.cooldownEndsAt !== "number")
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(data: ForgotPasswordStorage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function beginCooldown(nextTrials: number) {
  return {
    trials: nextTrials,
    cooldownEndsAt: Date.now() + COOLDOWN_SECONDS * 1000,
    cooldownLeft: COOLDOWN_SECONDS,
  };
}

function remainingFromEndsAt(endsAt: number, nowMs: number) {
  return Math.max(0, Math.ceil((endsAt - nowMs) / 1000));
}

export default function ForgotPasswordPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [trials, setTrials] = useState(0);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [cooldownEndsAt, setCooldownEndsAt] = useState<number | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [ready, setReady] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    const saved = readStorage();

    const id = window.setTimeout(() => {
      if (saved) {
        const remaining = saved.cooldownEndsAt
          ? remainingFromEndsAt(saved.cooldownEndsAt, Date.now())
          : 0;
        const endsAt = remaining > 0 ? saved.cooldownEndsAt : null;

        setTrials(saved.trials);
        setCooldownEndsAt(endsAt);
        setCooldownLeft(remaining);
        if (saved.trials > 0) {
          setSuccessMessage(SUCCESS_MESSAGE);
        }
      }
      setReady(true);
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready) return;

    writeStorage({
      trials,
      cooldownEndsAt: cooldownLeft > 0 ? cooldownEndsAt : null,
    });
  }, [ready, trials, cooldownEndsAt, cooldownLeft]);

  useEffect(() => {
    if (!cooldownEndsAt) return;

    const tick = () => {
      const remaining = remainingFromEndsAt(cooldownEndsAt, Date.now());
      setCooldownLeft(remaining);

      if (remaining <= 0) {
        setCooldownEndsAt(null);
      }
    };

    const immediate = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);

    return () => {
      window.clearTimeout(immediate);
      window.clearInterval(timer);
    };
  }, [cooldownEndsAt]);

  async function sendResetLink(email: string) {
    const response = await fetch("/api/auth/forgotpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.msg || "Failed to send reset link");
    }
  }

  async function onSubmit(data: ForgotPasswordFormData) {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (trials >= MAX_TRIALS) {
      setErrorMessage("You’ve reached the maximum of 3 reset attempts.");
      return;
    }

    if (cooldownLeft > 0) {
      setErrorMessage(
        `Please wait ${formatCountdown(cooldownLeft)} before trying again.`,
      );
      return;
    }

    try {
      await sendResetLink(data.email);
      const next = beginCooldown(trials + 1);
      setTrials(next.trials);
      setCooldownEndsAt(next.cooldownEndsAt);
      setCooldownLeft(next.cooldownLeft);
      setSuccessMessage(SUCCESS_MESSAGE);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  async function onResend() {
    if (cooldownLeft > 0 || trials >= MAX_TRIALS || isResending) return;

    const email = getValues("email");
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setErrorMessage(null);
    setIsResending(true);

    try {
      await sendResetLink(email);
      const next = beginCooldown(trials + 1);
      setTrials(next.trials);
      setCooldownEndsAt(next.cooldownEndsAt);
      setCooldownLeft(next.cooldownLeft);
      setSuccessMessage(SUCCESS_MESSAGE);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  }

  const trialsLeft = Math.max(MAX_TRIALS - trials, 0);
  const canResend =
    trials > 0 && trials < MAX_TRIALS && cooldownLeft === 0 && !isResending;
  const isSubmitDisabled =
    !ready || isSubmitting || cooldownLeft > 0 || trials >= MAX_TRIALS;

  return (
    <section className="section">
      <div className="fixed top-0 left-0 right-0 bg-transparent p-4">
        <Link href={"/"} className="ml-10 flex items-center gap-2">
          <Image
            src={"/Logo.svg"}
            alt="Logo"
            width={18}
            height={20}
            style={{ width: "auto", height: "20px" }}
          />
          <p className="font-bold text-xl uppercase">Taskly</p>
        </Link>
      </div>

      <div className="bg-white shadow-card rounded-lg flex flex-col gap-6 items-center justify-center py-12 px-8 w-full md:max-w-[448px] m-auto">
        <div className="flex flex-col gap-2 w-full max-w-[366px]">
          <h1 className="text-3xl font-semibold text-neutral-950">
            Forgot password?
          </h1>
          <p className="text-neutral-700 text-sm font-normal">
            No worries, we&apos;ll send you reset instructions.
          </p>
        </div>

        <form
          className="w-full max-w-[366px] space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label={
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-neutral-950">
                Email Address
              </span>
            }
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            error={errors.email?.message}
          />

          {errorMessage && (
            <p className="text-error text-sm font-normal">{errorMessage}</p>
          )}

          <Button
            type="submit"
            displayText={isSubmitting ? "Loading..." : "Send Reset Link"}
            disabled={isSubmitDisabled}
            className="w-full"
          />
        </form>

        <Link
          href={"/login"}
          className="text-primary flex items-center gap-2 font-medium text-sm"
        >
          <Image
            src={"/icons/backArrowIcon.svg"}
            alt="arrow-left icon"
            width={16}
            height={16}
            style={{ width: "16px", height: "16px" }}
          />
          Back to log in
        </Link>

        {ready && successMessage && (
          <div className="w-full max-w-[366px] flex flex-col gap-4 pt-2">
            <div className="flex items-start gap-3 rounded-md bg-[#E7F8EF] px-4 py-3">
              <Image
                src={"/icons/checkedIcon.svg"}
                alt="success"
                width={16}
                height={16}
                className="mt-0.5 shrink-0"
                style={{ width: "16px", height: "16px" }}
              />
              <p className="text-sm text-[#004E32] leading-relaxed">
                {successMessage}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-700 text-center">
                Didn&apos;t receive the email?
              </p>

              <button
                type="button"
                onClick={onResend}
                disabled={!canResend}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-surface-highest px-4 py-3 text-sm font-semibold text-neutral-700 disabled:cursor-not-allowed disabled:opacity-80 enabled:text-primary enabled:hover:brightness-95"
              >
                {isResending ? (
                  "Sending..."
                ) : cooldownLeft > 0 ? (
                  <>
                    <Image
                      src={"/icons/timerIcon.svg"}
                      alt="timer"
                      width={16}
                      height={16}
                      style={{ width: "16px", height: "16px" }}
                    />
                    Resend in {formatCountdown(cooldownLeft)}
                  </>
                ) : trials >= MAX_TRIALS ? (
                  "Resend limit reached"
                ) : (
                  "Resend"
                )}
              </button>

              <p className="text-neutral-500 text-xs text-center">
                {trialsLeft > 0
                  ? `${trialsLeft} attempt${trialsLeft === 1 ? "" : "s"} remaining`
                  : "No attempts remaining"}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
