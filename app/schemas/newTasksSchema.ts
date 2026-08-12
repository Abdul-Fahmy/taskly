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
export const tasksSchema = z.object({
  title: z
    .string()
    .min(3, "Title is required (minimum 3 characters)")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  assignee_id: z.string().optional().or(z.literal("")),
  due_date: z.string().optional().or(z.literal("")),
  project_id: z.string(),
  epic_id: z.string().optional().or(z.literal("")),
  status: statusSchema,
});

export type tasksFormData = z.infer<typeof tasksSchema>;
