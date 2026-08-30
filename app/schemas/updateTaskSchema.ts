import { z } from "zod";

const statusSchema = z.enum([
  "TO_DO",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "READY_FOR_QA",
  "REOPENED",
  "READY_FOR_PRODUCTION",
  "DONE",
]);

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

export function validateDueDate(value: string): {
  valid: boolean;
  message?: string;
} {
  if (!value) {
    return { valid: true };
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { valid: false, message: "Invalid due date" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date < today) {
    return { valid: false, message: "Due date cannot be in the past" };
  }

  return { valid: true };
}

export function dateInputToApiDueDate(dateInput: string): string {
  const [year, month, day] = dateInput.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 23, 59, 0, 0)).toISOString();
}

export function toDateInputValue(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function normalizeDescription(
  value: string | null | undefined,
): string | null {
  const trimmed = (value ?? "").trim();
  return trimmed ? trimmed : null;
}

export { statusSchema };
