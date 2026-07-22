import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters.")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

export type projectFormData = z.infer<typeof projectSchema>;
