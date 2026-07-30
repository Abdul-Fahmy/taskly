import { z } from "zod";

export const epicSchema = z.object({
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
  deadline: z.string().optional().or(z.literal("")),
  project_id: z.string(),
});

export type epicFormData = z.infer<typeof epicSchema>;
