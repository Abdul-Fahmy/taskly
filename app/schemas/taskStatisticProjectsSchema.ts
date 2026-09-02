import { z } from "zod";

export const taskStatisticsProjectSchema = z.object({
  p_start_date: z.iso.date(),
  p_end_date: z.iso.date(),
 
});

export type taskStatisticsProjectsSchema = z.infer<typeof taskStatisticsProjectSchema>;