import { z } from "zod";

export const passwordRules = {
  length: {
    regex: /^.{8,64}$/,
    message: "8 and 64 characters.",
  },
  uppercase: {
    regex: /[A-Z]/,
    message: "uppercase letter.",
  },
  lowercase: {
    regex: /[a-z]/,
    message: "lowercase letter.",
  },
  digit: {
    regex: /\d/,
    message: "one digit.",
  },
  specialCharacter: {
    regex: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]';`~]/,
    message: "special character.",
  },
};
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .refine((value) => passwordRules.length.regex.test(value), {
        message: passwordRules.length.message,
      })
      .refine((value) => passwordRules.uppercase.regex.test(value), {
        message: passwordRules.uppercase.message,
      })
      .refine((value) => passwordRules.lowercase.regex.test(value), {
        message: passwordRules.lowercase.message,
      })
      .refine((value) => passwordRules.digit.regex.test(value), {
        message: passwordRules.digit.message,
      })
      .refine((value) => passwordRules.specialCharacter.regex.test(value), {
        message: passwordRules.specialCharacter.message,
      }),

    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
