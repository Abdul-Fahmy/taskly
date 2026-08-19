"use client";
import Button from "@/app/components/button/Button";
import EmptyEpic from "@/app/components/epic/emptyEpic/EmptyEpic";
import EpicDetailsPopup from "@/app/components/epic/EpicDetailsPopup";
import { EpicCard } from "@/app/components/epic/epicCard/EpicCard";
import Input from "@/app/components/input/Input";
import Modal from "@/app/components/modal/Modal";
import Pagination from "@/app/components/pagination/Pagination";
import ProjectEpicsSkeleton from "@/app/components/project/projectEpicSkeleton/ProjectEpicSkeleton";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  fetchEpicsPagination,
  resetEpicsState,
  setCurrentPage,
  setEpics,
} from "@/app/store/features/epics.slice";
import { Epic } from "@/app/types/epicResponse";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { generateBreadcrumbs } from "@/app/services/breadcrum";
import { breadcrumbMap } from "@/app/constant/breadcrumbs";
import ApiError from "@/app/components/apiError/ApiError";

export default function EpicsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { projectId } = useParams<{ projectId: string }>();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.project.project);

  const { epics, status, error, currentPage, totalCount, limit } =
    useAppSelector((state) => state.epics);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const hasMore = epics.length < totalCount;
  const breadcrumbs = generateBreadcrumbs(pathname, breadcrumbMap, {
    [projectId]: project?.name || "projectId",
  });

  const handleClick = async (epicId: string) => {
    try {
      const res = await fetch(
        `/api/project/${projectId}/epicDetails/${epicId}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch epic details");
      }
      const data = await res.json();
      const epic = Array.isArray(data) ? data[0] : (data?.epic ?? data);
      if (!epic?.id) {
        throw new Error("Epic not found");
      }
      setSelectedEpic(epic);
      setOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(resetEpicsState());
  }, [dispatch, projectId]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    function updateScreenMode() {
      setIsMobile(mediaQuery.matches);
      dispatch(setCurrentPage(1));
    }

    updateScreenMode();
    mediaQuery.addEventListener("change", updateScreenMode);

    return () => mediaQuery.removeEventListener("change", updateScreenMode);
  }, [dispatch, projectId]);

  useEffect(() => {
    if (isMobile === null || !projectId) {
      return;
    }

    const promise = dispatch(
      fetchEpicsPagination({
        projectId,
        limit,
        page: currentPage,
        append: isMobile && currentPage > 1,
      }),
    );

    return () => {
      promise.abort();
    };
  }, [dispatch, currentPage, limit, isMobile, projectId]);

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
    (status === "loading" && (!isMobile || epics.length === 0))
  ) {
    return (
      <section className="w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectEpicsSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (status === "failed" && epics.length === 0) {
    return (
      <ApiError
        error={error ?? "Something went wrong"}
        projectId={projectId}
        limit={limit}
        currentPage={currentPage}
      />
    );
  }

  return (
    <div className="pt-6">
      <div className="hidden md:flex">
        <span className="font-bold uppercase text-[12px] flex items-center gap-1 ">
          {breadcrumbs.map((item, index) => (
            <span key={item}>
              {index > 0 && <span className="mx-2 text-neutral-400">&gt;</span>}

              <span
                className={
                  index === breadcrumbs.length - 1
                    ? "text-black"
                    : "text-[#43465499]"
                }
              >
                {item}
              </span>
            </span>
          ))}
        </span>
      </div>
      {epics.length > 0 ? (
        <>
          <div className="flex items-center justify-between px-3">
            <div className="flex flex-col gap-2 ">
              <h3 className="font-semibold text-[30px] text-[#041B3C]">
                Project Epics
              </h3>
            </div>
            <div className="flex gap-4 ">
              <Input type="search" placeholder="Search Epics" />
              <Button
                onClick={() => {
                  router.push(`/project/${projectId}/epics/new`);
                }}
                displayText="Create New Epic"
                className="hidden md:flex items-center gap-2 btn-primary w-full "
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            {epics.map((epic) => (
              <EpicCard
                key={epic.id}
                epic={epic}
                onClick={() => handleClick(epic.id)}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyEpic />
      )}

      {totalCount > limit && (
        <div className="hidden md:block pt-6 px-3">
          <Pagination
            limit={limit}
            totalCount={totalCount}
            currentPage={currentPage}
            itemLabel="epics"
            onPageChange={(page) => dispatch(setCurrentPage(page))}
          />
        </div>
      )}

      <div ref={loadMoreRef} className="h-1 md:hidden" aria-hidden="true" />

      {isMobile && status === "loading" && epics.length > 0 && (
        <div className="grid grid-cols-1 gap-4 py-6 md:hidden">
          {Array.from({ length: 2 }).map((_, index) => (
            <ProjectEpicsSkeleton key={index} />
          ))}
        </div>
      )}

      {isMobile && status === "failed" && epics.length > 0 && (
        <div className="py-4 text-center text-red-700 md:hidden">
          <p>{error ?? "Failed to load more epics."}</p>
          <button
            type="button"
            className="mt-2 font-semibold text-primary"
            onClick={() =>
              dispatch(
                fetchEpicsPagination({
                  projectId,
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

      <div className="max-w-2xl">
        <Modal
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setSelectedEpic(null);
          }}
          width="672px"
        >
          {selectedEpic && (
            <EpicDetailsPopup
              epic={selectedEpic}
              onClose={() => {
                setOpen(false);
                setSelectedEpic(null);
              }}
              onEpicUpdated={(updatedEpic) => {
                setSelectedEpic(updatedEpic);
                dispatch(
                  setEpics(
                    epics.map((item) =>
                      item.id === updatedEpic.id ? updatedEpic : item,
                    ),
                  ),
                );
              }}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
