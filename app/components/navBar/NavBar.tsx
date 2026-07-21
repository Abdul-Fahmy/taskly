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
  const collapsed = useAppSelector((state) => state.sidebar.collapsed);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, status]);

  const name = user?.user_metadata?.name ?? user?.email ?? "User";
  const jobTitle = user?.user_metadata?.job_title ?? "";
  const initials = getInitials(name);

  return (
    <nav
      className={`fixed top-0 right-0 z-20 h-20 border-b border-black/10 bg-white px-5 transition-[left] duration-300 ${
        collapsed ? "left-20" : "left-64"
      }`}
    >
      <div className="flex h-full items-center justify-end gap-2">
        <div className="hidden flex-col items-start justify-center md:flex">
          <h3 className="text-sm font-bold">
            {status === "loading" ? "Loading..." : name}
          </h3>
          {jobTitle && (
            <p className="text-xs font-bold uppercase text-primary">
              {jobTitle}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-container text-white">
          <span className="text-lg font-bold uppercase">{initials || "U"}</span>
        </div>
      </div>
    </nav>
  );
}
