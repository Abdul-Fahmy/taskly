"use client";
import { getInitials } from "@/app/constant/getInitials";
import { Task } from "@/app/types/task";
import Calendar from "@/app/assets/icons/date.svg";

export default function TaskCard({ task }: { task: Task }) {
  const initials = getInitials(task.created_by.name || "U");
  const createdAt = task.created_at
    ? new Date(task.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "No created date";

  // const dueDate = task.due_date
  // ? new Date(task.due_date).toLocaleDateString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //   })
  // : "No due date";

  // const getDueDateText = (dueDate: string) => {
  //   const today = new Date();
  //   const due = new Date(dueDate);

  //   today.setHours(0, 0, 0, 0);
  //   due.setHours(0, 0, 0, 0);

  //   if (due.getTime() === today.getTime()) {
  //     return "Today";
  //   }

  //   if (due.getTime() < today.getTime()) {
  //     return "Delayed";
  //   }

  //   return due.toLocaleDateString();
  // };

  return (
    <div className="flex flex-col gap-4 shadow-black/5 shadow-sm">
      <div className="bg-white flex flex-col items-start p-4 gap-4 rounded-md">
        <p>{task.title}</p>
        <div className="flex items-center justify-between w-full">
          <p className="text-[#94A3B8] text-sm font-700 flex items-center gap-2">
            <Calendar />

            {createdAt}
          </p>
          <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center ">
            {initials}
          </div>
        </div>
      </div>
    </div>
  );
}
