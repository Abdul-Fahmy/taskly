import { taskStatisticsSchema } from "@/app/schemas/taskStatisticsSchema ";
import { getTaskStatisticsByCalendar } from "@/app/services/myStatistics";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");

    if(!startDate || !endDate) {
        return NextResponse.json({error: "Start and end date are required"}, {status: 400});
    }

    const parsed = taskStatisticsSchema.safeParse({
        p_start_date: startDate,
        p_end_date: endDate,
        p_project_id: projectId ?? undefined,
        p_status: status ?? undefined,
    });

    if (!parsed.success) {
        return NextResponse.json(
            { message: "Validation failed", errors: parsed.error.flatten() },
            { status: 400 },
        );
    }

    const params = parsed.data;
    const response = await getTaskStatisticsByCalendar(params);
    return NextResponse.json(response);
}