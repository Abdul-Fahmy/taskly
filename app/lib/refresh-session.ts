export type RefreshedTokens = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
};

export async function refreshSessionTokens(
  refreshToken: string,
): Promise<RefreshedTokens | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  const response = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    },
  );

  if (!response.ok) {
    return null;
  }

  const tokens = (await response.json()) as Partial<RefreshedTokens>;

  if (!tokens.access_token || !tokens.refresh_token) {
    return null;
  }

  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_in: tokens.expires_in,
  };
}
