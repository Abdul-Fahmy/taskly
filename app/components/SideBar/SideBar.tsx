"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { clearUser } from "@/app/store/features/user.slice";
import { toggle } from "@/app/store/features/sidebar.slice";

const navItems = [
  { label: "Projects", src: "/icons/projectIcon.svg", width: 22, height: 16, href:'project' },
  {
    label: "Project Epics",
    src: "/icons/epicIcon.svg",
    width: 20,
    height: 18,
    href:'epics'
  },
  {
    label: "Project Tasks",
    src: "/icons/tasksIcon.svg",
    width: 20,
    height: 16,
    href:'tasks'

  },
  {
    label: "Project Members",
    src: "/icons/membersIcon.svg",
    width: 22,
    height: 16,
    href:'members'

  },
  {
    label: "Project Details",
    src: "/icons/detailIcon.svg",
    width: 20,
    height: 20,
    href:'edit'

  },
] as const;

const footerItems = [
  {
    label: "Collapse",
    src: "/icons/collapseIcon.svg",
    width: 12,
    height: 20,
  },
] as const;

export default function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isCollapsed = useAppSelector((state) => state.sidebar.collapsed);
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
  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <aside
      className={`hidden md:block fixed left-0 top-0 z-30 h-screen border-r border-black/5 bg-surface-low transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <section
        className={`flex flex-col ${isCollapsed ? "items-center" : ""} h-full`}
      >
        <div className="flex items-center gap-2 px-6 h-20">
          <Image
            src="/Logo.svg"
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
            {navItems.map((item) => {
              const isActive = pathname.endsWith(item.href.toLocaleLowerCase());
              return (
                <li
                  key={item.label}
                  className={`flex items-center gap-2 cursor-pointer p-2 ${isActive ? "bg-white text-primary " : ""}`}
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
              );
            })}
          </ul>

          <ul className="space-y-2">
            {footerItems.map((item) => (
              <li
                onClick={() => dispatch(toggle())}
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
                alt="logout Icon"
                src="/icons/logoutIcon.svg"
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
