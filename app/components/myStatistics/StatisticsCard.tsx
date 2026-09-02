import TotalTasks from "@/app/assets/icons/totalTasks.svg";
import DoneTasks from "@/app/assets/icons/doneTasks.svg";
import OverdueTasks from "@/app/assets/icons/overdueTasks.svg";
import { TaskStatisticsResponse } from "@/app/types/myStatisticsParams";

const statisticsConfig = {
  "Total tasks": {
    icon: TotalTasks,
    key: "total_tasks",
  },
  "Done tasks": {
    icon: DoneTasks,
    key: "done_tasks",
  },
  "Overdue tasks": {
    icon: OverdueTasks,
    key: "overdue_tasks",
  },
} as const;

type StatisticsCardProps = {
    title: keyof typeof statisticsConfig;
    statistics: TaskStatisticsResponse | null;
  };
  
  export default function StatisticsCard({
    title,
    statistics,
  }: StatisticsCardProps) {
    const { icon: Icon, key } = statisticsConfig[title];
  
    return (
      <div className="bg-[#FFFFFF] rounded-md flex justify-between items-center p-4 shadow-md">
        <div className="flex flex-col gap-2 items-start">
          <p className="text-[12px] font-700 text-[#041B3C99]">
            {title}
          </p>
  
          <p className="text-[30px] font-bold text-[#041B3C]">
            {statistics?.[key] }
          </p>
        </div>
  
        <Icon />
      </div>
    );
  }
