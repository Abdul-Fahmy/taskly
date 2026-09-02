import { TaskStatus } from "@/app/types/task";

type StatusCardProps = {
  status: TaskStatus;
  count: number;
};
export const statusColors: Record<TaskStatus, string> = {
    TO_DO: "#D7E2FF",
    IN_PROGRESS: "#CDDDFF",
    BLOCKED: "#FFDAD6",
    IN_REVIEW: "#4F5F7B",
    READY_FOR_QA: "#A855F7",
    REOPENED: "#F97316",
    READY_FOR_PRODUCTION: "#EC4899",
    DONE: "#82F9BE",
  };

export const statusLabels: Record<TaskStatus, string> = {
  TO_DO: "To Do",
  IN_PROGRESS: "In Progress",
  BLOCKED: "Blocked",
  IN_REVIEW: "In Review",
  READY_FOR_QA: "Ready for QA",
  REOPENED: "Reopened",
  READY_FOR_PRODUCTION: "Ready for Production",
  DONE: "Done",
};

export default function StatusCard({
  status,
  count,
}: StatusCardProps) {
  return (
    <div className={`rounded-sm  py-1 px-2 flex justify-between items-center `}  
     style={{
        backgroundColor: `${statusColors[status]}33`,
      }}>
      <p className="text-[11px] font-700 text-[#041B3C99]">
        {statusLabels[status]}
      </p>

      <p className="mt-2 font-bold text-[12px] text-[#041B3C]">
        {count}
      </p>
    </div>
  );
}