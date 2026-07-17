"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch } from "@/app/hooks/store.hooks";
import { clearUser } from "@/app/store/features/user.slice";

const navItems = [
  { label: "Projects", src: "/icons/folderIcon.png", width: 22, height: 16 },
  {
    label: "Project Epics",
    src: "/icons/epicsIcon.png",
    width: 20,
    height: 18,
  },
  {
    label: "Project Tasks",
    src: "/icons/tasksIcon.png",
    width: 20,
    height: 16,
  },
  {
    label: "Project Members",
    src: "/icons/membersIcon.png",
    width: 22,
    height: 16,
  },
  {
    label: "Project Details",
    src: "/icons/detailsIcon.png",
    width: 20,
    height: 20,
  },
] as const;

const footerItems = [
  {
    label: "Collapse",
    src: "/icons/collapseIcon.png",
    width: 12,
    height: 20,
  },
] as const;

export default function SideBar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      dispatch(clearUser());
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 bg-surface-low transition-all duration-500 ${
        isCollapsed ? "w-20" : "w-3xs"
      }`}
    >
      <section
        className={`flex flex-col ${isCollapsed ? "items-center" : ""} h-full`}
      >
        <div className="flex items-center gap-2 px-6 h-20">
          <Image
            src="/Logo.png"
            alt="Taskly logo"
            width={18}
            height={20}
            style={{ width: "auto", height: "auto" }}
          />

          <Link href="/" className="uppercase font-bold text-xl">
            {isCollapsed ? "" : "Taskly"}
          </Link>
        </div>

        <div className="flex flex-col justify-between flex-1 px-6 py-4">
          <ul className="space-y-5">
            {navItems.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Image
                  alt={item.label}
                  src={item.src}
                  width={item.width}
                  height={item.height}
                  style={{ width: "auto", height: "auto" }}
                />
                {isCollapsed ? "" : item.label}
              </li>
            ))}
          </ul>

          <ul className="space-y-2">
            {footerItems.map((item) => (
              <li
                onClick={() => setIsCollapsed(!isCollapsed)}
                key={item.label}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Image
                  alt="collapse Icon"
                  src={item.src}
                  width={item.width}
                  height={item.height}
                  style={{ width: "auto", height: "auto" }}
                />
                {isCollapsed ? "" : item.label}
              </li>
            ))}

            <li
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleLogout}
            >
              <Image
                alt=""
                src="/icons/logoutIcon.png"
                width={18}
                height={18}
                style={{ width: "auto", height: "auto" }}
              />
              {isCollapsed ? "" : isLoggingOut ? "Logging out..." : "Logout"}
            </li>
          </ul>
        </div>
      </section>
    </aside>
  );
}
