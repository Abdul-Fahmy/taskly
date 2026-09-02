import { format } from "date-fns";
import { TaskStatisticsResponse } from "@/app/types/myStatisticsParams";
import NoTasks from "@/app/assets/icons/noTasks.svg";
import StatusCard from "./StatusCard";
import { TaskStatus } from "@/app/types/task";

type DaysCardProps = {
  days: Date[];
  statisticsCalendar: TaskStatisticsResponse | null;
};

export default function DaysCard({ days, statisticsCalendar }: DaysCardProps) {
  return (
    <>
      {days.map((day) => {
        const dayStatistics = statisticsCalendar?.daily.find(
          (item) => item.day === format(day, "yyyy-MM-dd"),
        );

        const total = dayStatistics
          ? Object.values(dayStatistics.statuses).reduce(
              (sum, value) => sum + value,
              0,
            )
          : 0;

        return (
          <div key={day.toISOString()} className="rounded-md bg-white p-4 shadow-md h-full flex flex-col">
            <div className=""><p className="text-sm font-medium text-[#041B3C99]">
              {format(day, "EEE")}
            </p>

            <p className="text-xl font-bold text-[#041B3C]">
              {format(day, " d MMM")}
            </p></div>

            <div className="mt-2 text-2xl font-bold text-[#041B3C]">
              {!dayStatistics || total === 0 ? (
                <div className="flex flex-col items-center justify-center mt-14">
                    <NoTasks />
                  <p className="text-sm font-700">No tasks</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {Object.entries(dayStatistics.statuses).map(
                    ([status, count]) => (
                      <StatusCard
                        key={status}
                        status={status as TaskStatus}
                        count={count}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
