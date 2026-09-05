import { format, isToday } from "date-fns";

import { TaskStatisticsResponse } from "@/app/types/myStatisticsParams";
import NoTasks from "@/app/assets/icons/noTasks.svg";
import StatusCard from "./StatusCard";
import { TaskStatus } from "@/app/types/task";

type DaysCardProps = {
  days: Date[];
  statisticsCalendar: TaskStatisticsResponse | null;
};

export default function DaysCard({
  days,
  statisticsCalendar,
}: DaysCardProps) {
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

        const today = isToday(day);

        return (
          <div
            key={day.toISOString()}
            className={`
              relative flex
              min-w-0
              rounded-md
              bg-white
              shadow-sm
              p-3 sm:p-4

              /* Mobile */
              min-h-[92px]
              flex-row
              items-center

              /* Desktop */
              md:h-full
              md:min-h-0
              md:flex-col
              md:items-center

              ${today ? "border-2 border-primary" : ""}
              ${!dayStatistics || total === 0 ? "opacity-50" : ""}
            `}
          >
            {/* Today indicator */}
            {today && (
              <span
                className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-primary
                  px-4
                  py-1
                  text-xs
                  font-semibold
                  text-white
                  md:left-1/2
                  md:right-auto
                  md:top-[-12px]
                  md:-translate-x-1/2
                  md:translate-y-0
                "
              >
                TODAY
              </span>
            )}

            {/* Date */}
            <div
              className="
                flex
                w-[105px]
                shrink-0
                flex-col
                justify-center
                border-r
                border-[#DCE2EC]
                pr-4

                md:w-auto
                md:border-0
                md:p-0
              "
            >
              <p
                className="
                  text-sm
                  font-semibold
                  text-[#041B3C99]
                  md:text-sm
                "
              >
                {format(day, "EEE").toUpperCase()}
              </p>

              <p
                className={`
                  text-2xl
                  font-bold
                  md:text-xl
                  ${today ? "text-primary" : "text-[#041B3C]"}
                `}
              >
                {format(day, "d")}
              </p>
            </div>

            {/* Statistics */}
            <div
              className="
                flex
                min-w-0
                flex-1
                items-center
                pl-5

                md:mt-2
                md:w-full
                md:flex-none
                md:flex-col
                md:pl-0
              "
            >
              {!dayStatistics || total === 0 ? (
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2

                    md:mt-10
                    md:flex-col
                  "
                >
                  <NoTasks />

                  <p className="text-sm font-bold">
                    No tasks
                  </p>
                </div>
              ) : (
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    overflow-hidden

                    md:flex-col
                    md:gap-4
                  "
                >
                  {Object.entries(dayStatistics.statuses).map(
                    ([status, count]) => (
                      <StatusCard
                        key={status}
                        status={status as TaskStatus}
                        count={count}
                      />
                    ),
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