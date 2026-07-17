"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchCurrentUser } from "@/app/store/features/user.slice";
import { useEffect } from "react";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function NavBar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const status = useAppSelector((state) => state.user.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, status]);

  const name = user?.user_metadata?.name ?? user?.email ?? "User";
  const jobTitle = user?.user_metadata?.job_title ?? "";
  const initials = getInitials(name);

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 py-4 px-2 bg-white border-b-2 border-[#F9F9FF]">
      <div className="flex items-center justify-end gap-2">
        <div className="flex-col items-start justify-center hidden md:flex">
          <h3 className="text-sm font-bold">
            {status === "loading" ? "Loading..." : name}
          </h3>
          {jobTitle && (
            <p className="text-xs text-primary font-bold uppercase">
              {jobTitle}
            </p>
          )}
        </div>
        <div className="bg-primary-container w-10 h-10 rounded-md text-white flex items-center justify-center">
          <span className="font-bold uppercase text-lg">{initials || "U"}</span>
        </div>
      </div>
    </nav>
  );
}
