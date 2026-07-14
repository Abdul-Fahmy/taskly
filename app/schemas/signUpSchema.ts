import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.email("Invalid email"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    data: z.object({
      name: z.string().min(3, "Name is required"),

      job_title: z.string().optional(),
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
