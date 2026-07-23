"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const footerItems = [
  {
    label: "Projects",
    src: "/icons/projectIcon.svg",
    width: 22,
    height: 16,
    href: "project",
  },
  {
    label: "Epics",
    src: "/icons/epicIcon.svg",
    width: 20,
    height: 18,
    href: "epics",
  },
  {
    label: "Tasks",
    src: "/icons/tasksIcon.svg",
    width: 20,
    height: 16,
    href: "tasks",
  },
  {
    label: "Members",
    src: "/icons/membersIcon.svg",
    width: 22,
    height: 16,
    href: "members",
  },
  {
    label: "Details",
    src: "/icons/detailIcon.svg",
    width: 20,
    height: 20,
    href: "edit",
  },
] as const;

function getProjectId(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "project") return null;
  const maybeId = segments[1];
  if (!maybeId || maybeId === "add") return null;
  return maybeId;
}

function getNavHref(pathname: string, href: string) {
  if (href === "project") return "/project";
  const projectId = getProjectId(pathname);
  if (!projectId) return "/project";
  return `/project/${projectId}/${href}`;
}

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="w-full bg-[#F1F3FF] fixed bottom-0 left-0 right-0 md:hidden z-20">
      <ul className="pt-3 flex items-center justify-between">
        {footerItems.map((item) => {
          const href = getNavHref(pathname, item.href);
          const isActive =
            item.href === "project"
              ? pathname === "/project" || pathname === "/project/"
              : pathname.endsWith(`/${item.href}`);

          return (
            <li key={item.label} className="w-full m-0">
              <Link
                href={href}
                className={`flex flex-col items-center gap-2 cursor-pointer p-2 rounded-md w-full ${
                  isActive ? "bg-white text-primary" : ""
                }`}
              >
                <Image
                  alt={item.label}
                  src={item.src}
                  width={item.width}
                  height={item.height}
                  style={{ width: "auto", height: "auto" }}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </footer>
  );
}
