import { z } from "zod";
const nameRegex = /^(?=.{3,50}$)(?!.*\s{2,})[\p{L}]+(?: [\p{L}]+)*$/u;

export const passwordRules = {
  minLength: {
    regex: /.{8,}/,
    message: "At least 8 characters",
  },

  characters: {
    regex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
    message: "One uppercase, lowercase, and digit",
  },

  specialCharacter: {
    regex: /[@$!%*?&]/,
    message: "One special character",
  },
};

export const signupSchema = z
  .object({
    email: z.email("Invalid email"),

    password: z
      .string()
      .refine(
        (value) => passwordRules.minLength.regex.test(value),
        passwordRules.minLength.message,
      )
      .refine(
        (value) => passwordRules.characters.regex.test(value),
        passwordRules.characters.message,
      )
      .refine(
        (value) => passwordRules.specialCharacter.regex.test(value),
        passwordRules.specialCharacter.message,
      ),

    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    data: z.object({
      name: z
        .string()
        .min(3, "3-50 characters, letters only.")
        .regex(nameRegex, "Name can only contain letters and single spaces"),

      job_title: z.string().optional(),
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
