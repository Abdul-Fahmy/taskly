import TotalTasks from "@/app/assets/icons/totalTasks.svg";
import DoneTasks from "@/app/assets/icons/doneTasks.svg";
import OverdueTasks from "@/app/assets/icons/overdueTasks.svg";
import { TaskStatisticsResponse } from "@/app/types/myStatisticsParams";

const statisticsConfig = {
  "Total tasks": {
    icon: TotalTasks,
    key: "total_tasks",
    bg: "bg-[#0052CC]/10",
  },
  "Done tasks": {
    icon: DoneTasks,
    key: "done_tasks",
    bg: "bg-[#00A86B]/10",
  },
  "Overdue tasks": {
    icon: OverdueTasks,
    key: "overdue_tasks",
    bg: "bg-[#E53935]/10",
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
    const { icon: Icon, key , bg} = statisticsConfig[title];
  
    return (
      <div className="bg-[#FFFFFF] rounded-md flex justify-between items-center p-4 shadow-sm">
        <div className="flex flex-col gap-2 items-start">
          <p className="text-[12px] font-bold text-[#041B3C99]">
            {title}
          </p>
  
          <p className="text-[30px] font-bold text-[#041B3C]">
            {statistics?.[key] }
          </p>
        </div>
  
        <div className={`rounded-sm p-4 ${bg}`}>
        <Icon />
        </div>
      </div>
    );
  }
