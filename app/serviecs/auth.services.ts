import { SignupRequest } from "../types/auth";

export async function signup(data: SignupRequest) {
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!apiKey) {
    throw new Error("Missing Supabase API key");
  }
  const response = await fetch(
    "https://vfimoyyouwxofuyyvqsj.supabase.co/auth/v1/signup",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
