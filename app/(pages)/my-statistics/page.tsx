"use client";

import { useEffect, useState } from "react";

import DateRangePicker from "@/app/components/myStatistics/DateRangePicker";
import ProjectFilter from "@/app/components/myStatistics/ProjectsFilter";
import StatusFilter, { StatusOption } from "@/app/components/myStatistics/StatusFilter";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchProjects } from "@/app/store/features/project.slice";
import { TaskStatisticsResponse } from "@/app/types/myStatisticsParams";
import {
  endOfWeek,
  startOfWeek,
  format,
  eachDayOfInterval,
  
} from "date-fns";
import type { DateRange } from "react-day-picker";
import StatisticsCard from "@/app/components/myStatistics/StatisticsCard";
import DaysCard from "@/app/components/myStatistics/DaysCard";

interface ProjectOption {
  value: string | null;
  label: string;
}
const statuses = [
    {
      value: null,
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

  const statisticsCards = [
    "Total tasks",
    "Done tasks",
    "Overdue tasks",
  ] as const;

export default function MyStatisticsPage() {
    const dispatch = useAppDispatch()
    const project = useAppSelector((state) => state.project.projects);
    const [dateRange, setDateRange] = useState<DateRange>(() => {
      const today = new Date();
    
      return {
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 }),
      };
    });

 

    const projects: ProjectOption[] = [
      {
        value: null,
        label: "All Projects",
      },
      ...project.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    ];

    useEffect(()=>{
        dispatch(fetchProjects())
    },[dispatch])
  const [selectedProject, setSelectedProject] =
    useState<ProjectOption | null>(projects[0]);

    const [selectedStatus, setSelectedStatus] =
  useState<StatusOption | null>(statuses[0] as StatusOption);


  const [statisticsCalendar, setStatisticsCalendar] = useState<TaskStatisticsResponse | null>(null)
  const days = dateRange.from && dateRange.to
  ? eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    })
  : [];

  useEffect(() => {
    const fetchStatisticsCalendar = async () => {
      if (!dateRange.from || !dateRange.to) return;
  
      const params = new URLSearchParams({
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: format(dateRange.to, "yyyy-MM-dd"),
      });
  
      if (selectedProject?.value) {
        params.set("projectId", selectedProject.value);
      }
  
      if (selectedStatus?.value) {
        params.set("status", selectedStatus.value);
      }
  
      const response = await fetch(
        `/api/myStatistics/byCalender?${params.toString()}`
      );
  
      const data: TaskStatisticsResponse = await response.json();
  console.log(data);
  
      setStatisticsCalendar(data);
    };
  
    fetchStatisticsCalendar();
  }, [dateRange, selectedProject, selectedStatus]);

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
      <DateRangePicker
  value={dateRange}
  onChange={setDateRange}
/>
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

     {statisticsCards && (
  <div className="grid grid-cols-3 gap-4">
    {statisticsCards.map((title) => (
      <StatisticsCard
        key={title}
        title={title}
        statistics={statisticsCalendar}
      />
    ))}
  </div>
)}
<div className="grid grid-cols-7 gap-3 h-[420px] ">
  <DaysCard
    days={days}
    statisticsCalendar={statisticsCalendar}
  />
</div>
    </div>
  );
}