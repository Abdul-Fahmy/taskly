import { TaskStatisticsResponse } from "@/app/types/myStatisticsParams";
import { TaskStatus } from "@/app/types/task";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { statusColors, statusLabels } from "./StatusCard";

type TasksByStatusProps = {
  tasks: TaskStatisticsResponse;
};

export default function TasksByStatus({ tasks }: TasksByStatusProps) {
  const inProgress = tasks.totals.IN_PROGRESS ?? 0;
  const done = tasks.totals.DONE ?? 0;
  const blocked = tasks.totals.BLOCKED ?? 0;

  const total = tasks.total_tasks;

  const chartData = Object.entries(tasks.totals).map(([status, count]) => ({
    status: status as TaskStatus,
    name: statusLabels[status as TaskStatus] ?? status,
    value: count ?? 0,
    fill: statusColors[status as TaskStatus] ?? "#CBD5E1",
  }));

  const getPercentage = (value: number) => {
    if (!total) return 0;

    return Math.round((value / total) * 100);
  };

  const progressItems = [
    {
      label: statusLabels.IN_PROGRESS,
      value: inProgress,
      percentage: getPercentage(inProgress),
      color: statusColors.IN_PROGRESS,
    },
    {
      label: statusLabels.DONE,
      value: done,
      percentage: getPercentage(done),
      color: statusColors.DONE,
    },
    {
      label: statusLabels.BLOCKED,
      value: blocked,
      percentage: getPercentage(blocked),
      color: statusColors.BLOCKED,
    },
  ];
  const hasChartData = chartData.some((item) => item.value > 0);

  const displayChartData = hasChartData
    ? chartData
    : [
        {
          status: "EMPTY",
          name: "",
          value: 1,
          fill: "#E5E7EB",
        },
      ];

  return (
    <div className="flex w-full flex-col gap-6 rounded-md bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-[#041B3C]">Tasks By Status</h3>

      <div className="flex w-full items-center gap-10">
        {/* Doughnut Chart */}
        <div className="relative h-[260px] w-1/2 min-w-0">
        <ResponsiveContainer
    width="100%"
    height="100%"
    initialDimension={{ width: 300, height: 260 }}
  >
            <PieChart>
              <Pie
                data={displayChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={hasChartData ? 2 : 0}
                stroke="none"
              />
              {hasChartData && <Tooltip />}{" "}
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#041B3C]">{total}</span>

            <span className="text-sm text-[#434654]">Total</span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex w-1/2 flex-col gap-6">
          {progressItems.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#041B3C]">
                  {item.label}
                </span>

                <span className="text-sm font-semibold text-[#041B3C]">
                  {item.value}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-[#E8EDF3]">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
