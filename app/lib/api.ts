type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
};

export type ApiFetchError = {
  status: number;
  data: unknown;
  message: string;
};

export function isApiFetchError(error: unknown): error is ApiFetchError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as ApiFetchError).status === "number"
  );
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (isApiFetchError(error)) {
    const data = error.data as Record<string, string> | null;

    return (
      error.message ||
      data?.msg ||
      data?.error_description ||
      data?.message ||
      fallback
    );
  }

  return fallback;
}

export function getApiErrorStatus(error: unknown, fallback: number): number {
  if (isApiFetchError(error)) {
    return error.status;
  }

  return fallback;
}




export async function apiFetch<T>(
    url: string,
    { token, ...options }: FetchOptions = {}
): Promise<T> {
    const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!apiKey) throw new Error('missing supabase api key')
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),

            ...options.headers,
        },
        body:
            options.body && typeof options.body !== "string"
                ? JSON.stringify(options.body)
                : (options.body as BodyInit),
    });
    const data = await response.json().catch(() => null);


    // Axios-like error handling
    if (!response.ok) {

        throw {
            status: response.status,
            data,
            message: (data as { message?: string })?.message || response.statusText,
        };
    }

    return data as T
}