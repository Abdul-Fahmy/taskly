"use client";

import { useState } from "react";

import DateRangePicker from "@/app/components/myStatistics/DateRangePicker";
import ProjectFilter from "@/app/components/myStatistics/ProjectsFilter";
import StatusFilter, { StatusOption } from "@/app/components/myStatistics/StatusFilter";

interface ProjectOption {
  value: string;
  label: string;
}
const statuses = [
    {
      value: "all",
      label: "All Statuses",
    },
    {
      value: "TO_DO",
      label: "To Do",
    },
    {
      value: "IN_PROGRESS",
      label: "In Progress",
    },
    {
      value: "BLOCKED",
      label: "Blocked",
    },
    {
      value: "IN_REVIEW",
      label: "In Review",
    },
    {
      value: "READY_FOR_QA",
      label: "Ready for QA",
    },
    {
      value: "REOPENED",
      label: "Reopened",
    },
    {
      value: "READY_FOR_PRODUCTION",
      label: "Ready for Production",
    },
    {
      value: "DONE",
      label: "Done",
    },
  ];
export default function MyStatisticsPage() {
  const projects: ProjectOption[] = [
    {
        value: "all",
        label: "All Projects",
      },
    {
      value: "project1",
      label: "Project 1",
    },
    {
      value: "project2",
      label: "Project 2",
    },
  ];

  const [selectedProject, setSelectedProject] =
    useState<ProjectOption | null>(projects[0]);

    const [selectedStatus, setSelectedStatus] =
  useState<StatusOption | null>(statuses[0]);

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex w-full flex-col items-start">
        <h1 className="text-3xl font-bold text-[#041B3C]">
          My Statistics
        </h1>

        <p className="text-[#434654]">
          Manage your deadlines and track team velocity.
        </p>
      </div>

      <div className="flex w-full justify-between rounded-md bg-surface-highest p-2">
        <DateRangePicker />

        <div className="flex items-center w-1/2 gap-2">
          <ProjectFilter
            projects={projects}
            value={selectedProject}
            onChange={setSelectedProject}
          />
          <StatusFilter
    statuses={statuses}
    value={selectedStatus}
    onChange={setSelectedStatus}
  />
        </div>
      </div>
    </div>
  );
}