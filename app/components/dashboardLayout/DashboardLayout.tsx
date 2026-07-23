"use client";

import { useAppSelector } from "@/app/hooks/store.hooks";
import SideBar from "../SideBar/SideBar";
import NavBar from "../navBar/NavBar";
import Footer from "../footer/Footer";

export default function DashboardLayout({
  children,
  hasToken,
}: {
  hasToken: boolean;
  children: React.ReactNode;
}) {
  const collapsed = useAppSelector((state) => state.sidebar.collapsed);

  if (!hasToken) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <SideBar />

      <div
        className={`min-h-screen transition-[margin] duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <NavBar />

        <main className="min-h-[calc(100vh-5rem)] pt-20 md:px-4">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}
