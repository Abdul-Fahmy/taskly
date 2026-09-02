import { z } from "zod";

export const taskStatisticsSchema = z.object({
  p_start_date: z.iso.date(),
  p_end_date: z.iso.date(),
  p_project_id: z.uuid().optional(),
  p_status: z
    .enum([
      "TO_DO",
      "IN_PROGRESS",
      "BLOCKED",
      "IN_REVIEW",
      "READY_FOR_QA",
      "REOPENED",
      "READY_FOR_PRODUCTION",
      "DONE",
    ])
    .optional(),
});

export type TaskStatisticsParams = z.infer<typeof taskStatisticsSchema>;