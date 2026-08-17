import { z } from "zod";

export const inviteMemberSchema = z.object({
  p_email: z.email("Please enter a valid email address"),

  p_project_id: z.string(),

  p_app_url: z.string(),

  p_base_url: z.string(),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
