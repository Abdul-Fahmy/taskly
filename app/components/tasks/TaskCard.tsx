'use client'
import { getInitials } from "@/app/constant/getInitials";
import { Task } from "@/app/types/task";
import Calendar from'@/app/assets/icons/date.svg';


export default function TaskCard({task}:{task:Task}){
    
   const initials= getInitials(task.created_by.id || 'U')
    const createdAt = task.created_at ? new Date(task.created_at).toLocaleDateString('en-US', {  month: 'short', day: 'numeric' }) : 'No created date';
    return (
        <div className="flex flex-col gap-4">
           

<div className="bg-white flex flex-col items-start p-4 gap-4 rounded-md">
    <p>{task.title}</p>
    <div className="flex items-center justify-between w-full">
        <p className="text-[#94A3B8] text-sm font-700 flex items-center gap-2">
            <Calendar />
            
            {createdAt}</p>
        <div className="bg-primary text-white rounded-full px-2 py-1 ">
            {initials}
        </div>
    </div>
</div>


        </div>
    )
}