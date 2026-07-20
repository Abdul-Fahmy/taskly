import { AuthResponse, User } from "../types/signUpAuth";
import { LoginForm } from "../types/loginForm";
import { SignUpRequest } from "../types/signUpRequest";
import { cookies } from "next/headers";
import { apiFetch } from "../lib/api";

function getSupabaseConfig() {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl) {
    throw new Error("Missing Supabase environment variables");
  }

  return { baseUrl };
}

export async function signup(data: SignUpRequest): Promise<AuthResponse> {
  const { baseUrl } = getSupabaseConfig();

  return apiFetch<AuthResponse>(`${baseUrl}/auth/v1/signup`, {
    method: "POST",
    body: data,
  });
}

export async function login(data: LoginForm): Promise<AuthResponse> {
  const { baseUrl } = getSupabaseConfig();

  return apiFetch<AuthResponse>(
    `${baseUrl}/auth/v1/token?grant_type=password`,
    { method: "POST", body: data },
  );
}

export async function getUser(): Promise<User> {
  const { baseUrl } = getSupabaseConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Missing access token");
  }

  return apiFetch<User>(`${baseUrl}/auth/v1/user`, { method: "GET", token });
}
