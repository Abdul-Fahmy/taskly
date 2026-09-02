import { cookies } from "next/headers";
import { apiFetch } from "../lib/api";
import { TasksByProjectResponse, TaskStatisticsParams, TaskStatisticsProject, TaskStatisticsResponse } from "../types/myStatisticsParams";

function getSupabaseConfig() {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
    if (!baseUrl) {
      throw new Error("Missing Supabase environment variables");
    }
  
    return { baseUrl };
  }

export async function getTaskStatisticsByCalendar(params: TaskStatisticsParams) {
const {baseUrl} = getSupabaseConfig();
const cookieStore = await cookies();
const token = cookieStore.get("access_token")?.value;

if(!token) {
    throw new Error("Unauthorized");
}

const response: TaskStatisticsResponse = await apiFetch(`${baseUrl}/rest/v1/rpc/get_tasks_calendar_stats`,{
    method:"POST",
    body:params,
    token,


});

return response;
}

export async function getTaskStatisticsAllProject(params: TaskStatisticsProject) {
  const {baseUrl} = getSupabaseConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  
  if(!token) {
      throw new Error("Unauthorized");
  }
  
  const response: TasksByProjectResponse = await apiFetch(`${baseUrl}/rest/v1/rpc/get_tasks_count_per_project`,{
      method:"POST",
      body:params,
      token,
  
  
  });
  
  return response;
  }