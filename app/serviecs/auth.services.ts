import { SignupFormData } from "../schemas/signUpSchema";

export async function signup(data: SignupFormData) {
  const response = await fetch("YOUR_API_URL", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  return response.json();
}
