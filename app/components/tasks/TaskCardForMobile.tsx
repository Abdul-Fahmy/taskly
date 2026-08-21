import { getInitials } from "@/app/constant/getInitials";
import { statusColors } from "@/app/constant/taskStatusColor";
import { Task } from "@/app/types/task";

export default function TaskCardForMobile({task}:{task:Task}) {
    const formatStatus = (status: string) => {
        return status
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
      };
    const formattedDate = task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';
  return (
    <div className="flex flex-col w-full p-4 rounded-md shadow-[#041B3C0A] bg-white my-4 gap-4  ">
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-700 text-[#43465480] ">{task.task_id}</span>
                <span className={`py-1 px-2 ${statusColors[task.status as keyof typeof statusColors]} rounded-md text-[11px]` }>{formatStatus(task.status)}</span>
            </div>
            <p className="text-[18px] font-500 text-[#041B3C]">{task.title}</p>

        </div>
        <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F2F4F7] text-[11px] ">{getInitials(task.assignee?.name ?? 'U')}</span>
            <div className="flex flex-col items-start gap-2">
                <span className="uppercase font-bold text-[#434654B2] text-[11px]">Due Date</span>
                {task.due_date ? <span className="font-500 text-[12px] text-[#041B3C]">{formattedDate}</span>: <span>-</span>}
            </div>
        </div>
    </div>
  )
}
