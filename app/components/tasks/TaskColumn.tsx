"use Client";
import { Task, TaskStatus } from "@/app/types/task";
import TaskCard from "./TaskCard";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/hooks/store.hooks";
import { setSelectedTaskStatus } from "@/app/store/features/tasks.slice";

type TaskColumnProps = {
  status: {
    value: TaskStatus;
    label: string;
  };
  tasks: Task[];
  onAddTask: () => void;
};

export function TaskColumn({ status, tasks, onAddTask }: TaskColumnProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleAddTask = () => {
    dispatch(setSelectedTaskStatus(status.value));
    router.push(`/project/${projectId}/tasks/new`);
  };

  return (
    <div className="flex min-w-72 shrink-0 flex-col">
      <div className="flex items-center justify-between p-3">
        <span
          className={`w-3 h-3 rounded-full ${status.value === "TO_DO" ? "bg-blue-500" : status.value === "IN_PROGRESS" ? "bg-yellow-500" : status.value === "BLOCKED" ? "bg-red-500" : status.value === "IN_REVIEW" ? "bg-green-500" : status.value === "READY_FOR_QA" ? "bg-purple-500" : status.value === "REOPENED" ? "bg-orange-500" : status.value === "READY_FOR_PRODUCTION" ? "bg-pink-500" : status.value === "DONE" ? "bg-gray-500" : ""}`}
        ></span>
        <h3 className="text-sm font-semibold">{status.label}</h3>

        <button
          type="button"
          onClick={onAddTask}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-200"
        >
          +
        </button>
      </div>
      <div className="flex flex-col gap-2 p-3 pt-0">
        <button
          onClick={handleAddTask}
          className=" border-2 border-dashed border-gray-300 rounded-md p-3 flex items-center justify-center gap-4"
        >
          <span className="text-gray-300 border-2 rounded-full w-6 h-6 flex items-center justify-center  ">
            +
          </span>

          <p className="uppercase text-[12px] font-bold">Add new task</p>
        </button>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
