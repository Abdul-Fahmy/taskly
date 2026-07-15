import { z } from "zod";
const nameRegex = /^(?=.{3,50}$)(?!.*\s{2,})[\p{L}]+(?: [\p{L}]+)*$/u;

export const signupSchema = z
  .object({
    email: z.email("Invalid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must not exceed 64 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/\d/, "Must contain at least one number")
      .regex(/[!@#$%^&*]/, "Must contain at least one special character")
      .regex(/^\S*$/, "Password must not contain spaces"),

    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    data: z.object({
      name: z
        .string()
        .min(3, "Must be at least 3 characters")
        .regex(nameRegex, "Name can only contain letters and single spaces"),

      job_title: z.string().optional(),
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
