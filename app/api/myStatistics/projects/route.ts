import { taskStatisticsProjectSchema } from "@/app/schemas/taskStatisticProjectsSchema";
import { getTaskStatisticsAllProject } from "@/app/services/myStatistics";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
   

    if(!startDate || !endDate) {
        return NextResponse.json({error: "Start and end date are required"}, {status: 400});
    }

    const parsed = taskStatisticsProjectSchema.safeParse({
        p_start_date: startDate,
        p_end_date: endDate,
       
    });

    if (!parsed.success) {
        return NextResponse.json(
            { message: "Validation failed", errors: parsed.error.flatten() },
            { status: 400 },
        );
    }

    const params = parsed.data;
    const response = await getTaskStatisticsAllProject(params);
    return NextResponse.json(response);
}