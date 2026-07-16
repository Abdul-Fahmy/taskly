import { AuthResponse } from "../types/signUpAuth";
import { LoginForm } from "../types/loginForm";
import { SignUpRequest } from "../types/signUpRequest";

function getSupabaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!apiKey || !baseUrl) {
    throw new Error("Missing Supabase environment variables");
  }

  return { apiKey, baseUrl };
}

export async function signup(data: SignUpRequest): Promise<AuthResponse> {
  const { apiKey, baseUrl } = getSupabaseConfig();

  const response = await fetch(`${baseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}

export async function login(data: LoginForm): Promise<AuthResponse> {
  const { apiKey, baseUrl } = getSupabaseConfig();

  const response = await fetch(
    `${baseUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
