import z from "zod";

export const acceptMemberSchema = z.object({
  p_token: z.string(),
});

export type AcceptMemberFormData = z.infer<typeof acceptMemberSchema>;
