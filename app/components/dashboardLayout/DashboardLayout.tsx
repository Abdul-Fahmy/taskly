"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchProjectDetails } from "@/app/store/features/project.slice";
import { useParams } from "next/navigation";
import { useEffect } from "react";
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
  const currentProject = useAppSelector((state) => state.project.project);

  const currentProjectId = useAppSelector((state) => state.project.project?.id);
  const detailsStatus = useAppSelector((state) => state.project.detailsStatus);
  const detailsProjectId = useAppSelector(
    (state) => state.project.detailsProjectId,
  );
  const dispatch = useAppDispatch();
  const params = useParams<{ projectId?: string | string[] }>();
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;

  useEffect(() => {
    if (!hasToken || !projectId) {
      return;
    }

    if (currentProjectId === projectId) {
      return;
    }

    if (
      detailsProjectId === projectId &&
      (detailsStatus === "loading" || detailsStatus === "failed")
    ) {
      return;
    }

    void dispatch(fetchProjectDetails({ projectId }));
  }, [
    dispatch,
    hasToken,
    projectId,
    currentProjectId,
    detailsStatus,
    detailsProjectId,
    currentProject,
  ]);

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
