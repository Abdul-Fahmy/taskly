"use client";

import Button from "@/app/components/button/Button";
import ProjectCardSkeleton from "@/app/components/cardSkeleton/CardSkeleton";
import Pagination from "@/app/components/pagination/Paagination";
import ProjectCard from "@/app/components/projectCard/ProjectCard";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  fetchPagination,
  setCurrentPage,
} from "@/app/store/features/project.slice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Project() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { projects, status, error, currentPage, totalCount, limit } =
    useAppSelector((state) => state.project);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const hasMore = projects.length < totalCount;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    function updateScreenMode() {
      setIsMobile(mediaQuery.matches);
      dispatch(setCurrentPage(1));
    }

    updateScreenMode();
    mediaQuery.addEventListener("change", updateScreenMode);

    return () => mediaQuery.removeEventListener("change", updateScreenMode);
  }, [dispatch]);

  useEffect(() => {
    if (isMobile === null) {
      return;
    }

    dispatch(
      fetchPagination({
        limit,
        page: currentPage,
        append: isMobile && currentPage > 1,
      }),
    );
  }, [dispatch, currentPage, limit, isMobile]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (
      !isMobile ||
      !target ||
      !hasMore ||
      status === "loading" ||
      status === "failed"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch(setCurrentPage(currentPage + 1));
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [currentPage, dispatch, hasMore, isMobile, status]);

  if (
    isMobile === null ||
    (status === "loading" && (!isMobile || projects.length === 0))
  ) {
    return (
      <section className="w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (status === "failed" && projects.length === 0) {
    return (
      <section className="w-full p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p>{error ?? "Failed to load projects."}</p>
          <Button
            displayText="Try Again"
            className="mt-4 w-fit"
            onClick={() =>
              dispatch(fetchPagination({ limit, page: currentPage }))
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full p-2">
      {projects.length > 0 ? (
        <>
          <div className="flex items-center justify-between px-3">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-[30px] text-[#041B3C]">
                Projects
              </h3>
              <p className="text-[#434654] text-[16px]">
                Manage and curate your projects
              </p>
            </div>
            <Button
              onClick={() => {
                router.push("/project/add");
              }}
              displayText="Create New Project"
              className="hidden md:flex items-center gap-2 btn-primary w-fit "
            >
              <Image
                src={"/icons/plusIcon.svg"}
                alt="plus Icon"
                width={11}
                height={11}
                style={{ width: "11px", height: "11px" }}
              />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 pb-6 ">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            <Link
              href={"/project/add"}
              className="hidden md:flex flex-col w-full items-center justify-center gap-2"
            >
              <div className="p-4 bg-[#F1F3FF]">
                <Image
                  src={"/icons/roundedPlus.svg"}
                  alt="rounded plus icon"
                  width={20}
                  height={20}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>
              <p className="text-[#434654] font-bold text-[14px]">
                ADD PROJECT
              </p>
            </Link>
          </div>

          <div className="flex justify-end pb-20">
            <Button
              onClick={() => {
                router.push("/project/add");
              }}
              displayText=""
              className="flex md:hidden items-center gap-2 btn-primary w-fit "
            >
              <Image
                src={"/icons/plusIcon.svg"}
                alt="plus Icon"
                width={11}
                height={11}
                style={{ width: "11px", height: "11px" }}
              />
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-4">
            <Image
              src={"/noProjects.svg"}
              alt="no projects found"
              width={288}
              height={288}
              style={{ width: "288px", height: "288px" }}
            />
            <h3 className="text-[36px] font-semibold">No Projects </h3>
            <p className="text-[18px] text-[#434654] ">
              You don’t have any projects yet. Start by defining your first
              architectural workspace to begin tracking tasks and epics.
            </p>
            <Link
              href={"/project/add"}
              className="btn-primary w-fit flex items-center gap-2"
            >
              <Image
                src={"/icons/whitPlus.svg"}
                alt="rounded plus icon"
                width={20}
                height={20}
                style={{ width: "20px", height: "20px" }}
              />
              Create New Project
            </Link>
          </div>
        </>
      )}

      {totalCount > limit && (
        <div className="hidden md:block">
          <Pagination
            limit={limit}
            totalCount={totalCount}
            currentPage={currentPage}
            onPageChange={(page) => dispatch(setCurrentPage(page))}
          />
        </div>
      )}

      <div ref={loadMoreRef} className="h-1 md:hidden" aria-hidden="true" />

      {isMobile && status === "loading" && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-8 py-6 md:hidden">
          {Array.from({ length: 2 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      )}

      {isMobile && status === "failed" && projects.length > 0 && (
        <div className="py-4 text-center text-red-700 md:hidden">
          <p>{error ?? "Failed to load more projects."}</p>
          <button
            type="button"
            className="mt-2 font-semibold text-primary"
            onClick={() =>
              dispatch(
                fetchPagination({
                  limit,
                  page: currentPage,
                  append: true,
                }),
              )
            }
          >
            Try again
          </button>
        </div>
      )}
    </section>
  );
}
