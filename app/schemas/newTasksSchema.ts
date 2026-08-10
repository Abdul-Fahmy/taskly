import { z } from "zod";

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
  epic_id:z.string().optional().or(z.literal('')),
  status:z.string().optional().or(z.literal('todo | in_progress | in_review | done'))
});

export type tasksFormData = z.infer<typeof tasksSchema>;