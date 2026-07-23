import { z } from "zod";
import { passwordRules } from "./signUpSchema";

export { passwordRules };

export const resetPasswordSchema = z
  .object({
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
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
