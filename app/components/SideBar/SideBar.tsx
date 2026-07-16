"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SideBar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }
  return (
    <div className="fixed top-0 left-0 bottom-0  bg-surface-low min-w-3xs">
      <section className="flex-col gap-2 mx-auto px-4 pt-4 h-full">
        <div className="flex items-center gap-2 px-2 h-20">
          <Image src="/Logo.png" alt="Logo Taskly" width={18} height={20} />

          <Link href={"/"} className="uppercase font-bold text-xl">
            Taskly
          </Link>
        </div>
        <div className="flex-1 flex flex-col justify-between  px-4">
          <ul>
            <li>Projects</li>
            <li>Project Epics</li>
            <li>Project Tasks</li>
            <li>Project Members</li>
            <li>Project Details</li>
          </ul>

          <ul>
            <li>Collapse</li>
            <li onClick={handleLogout}>
              {isLoggingOut ? "logging out..." : "Logout"}
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
