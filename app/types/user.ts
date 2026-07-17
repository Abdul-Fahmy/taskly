import { User } from "./signUpAuth";

export type { User };

export type UserState = {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};
