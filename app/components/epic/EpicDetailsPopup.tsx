import { getInitials } from "@/app/constant/getInitials";
import { Epic } from "@/app/types/epicResponse";
import Image from "next/image";
import Select from 'react-select';
import { CustomOption, CustomSingleValue } from "../customOption/CustomOption";
import Link from "next/link";
import Button from "../button/Button";
const assignees = [
    {
      value: "1",
      label: "Abdulrahman Fahmy",
    },
    {
      value: "2",
      label: "Ahmed Mohamed",
    },
    {
      value: "3",
      label: "Sara Ali",
    },
  ];


export default function EpicDetailsPopup({epic, onClose}:{epic:Epic,onClose:()=>void}) {
    const initials = getInitials(epic.created_by.name ?? "");
    const formatted = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(epic.created_at));

    return(
        <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                <Image  src={"/icons/epics.svg"}alt="epics" width={20}height={14} style={{width:"20px",height:'14px'}} />
                <p>{epic.epic_id}</p>
                </div>
                <button
            onClick={onClose}
            className="text-xl font-bold"
          >
            ×
          </button>
            </div>
            <div className="w-full flex flex-col items-start justify-between gap-8">
                <h3 className="text-xl font-bold border-2 border-surface-low rounded-md w-full p-2">{epic.title}</h3>
                <p className="border-2 border-surface-low rounded-md h-[150px] w-full p-2">{epic.description || 'No Description Provided'}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
<div className="flex flex-col items-start gap-2">
    <p className="text-[10px] font-bold text-text-secondary ">created by</p>
    <div className="flex gap-2 w-full text-[14px]">
    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-container text-white">
        <span className="text-[10px] font-bold uppercase">
              {initials || "U"}
            </span>
    </div>
        <p>{epic.created_by.name}</p>
        
    </div>
</div>
<div className="flex flex-col items-start gap-2">
    <label htmlFor="assignee" className="text-[10px] font-bold text-text-shadow">Assignee</label>
    <Select options={assignees} components={{Option:CustomOption, SingleValue:CustomSingleValue}} className="w-full" />
</div>
<div className="flex flex-col items-start gap-2">
    <label htmlFor="deadline" className="text-[10px] font-bold text-text-shadow w-full">Deadline</label>
    <input type="date" id="deadline" className="border-2 border-surface-low rounded-md p-2" value={epic.deadline??''}  onChange={(e)=>{
        const deadline = e.target.value
    }}/>
</div>
<div className="flex flex-col items-start gap-2">
    <p className="text-[10px] font-bold ">Created at</p>
    <p className="text-[14px] flex gap-2 items-center">
        <Image src={'/icons/date.svg'} alt="time" width={13} height={15} style={{width:'13px',height:'15px'}} />
        {formatted}</p>
</div>
            </div>
            <div className="mt-2">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold ">Tasks</p>
                    <Link href={'/'} className="text-primary text-[14px] font-semibold">+ Add Task</Link>
                </div>
                <div className="mt-2 w-full bg-surface-low rounded-sm p-4 flex flex-col items-center justify-center gap-4">
                    <span className="p-4 bg-[#D7E2FF] rounded-sm ">
                        <Image src={'/icons/epicsTasks.svg'} alt="tasks" width={18} height={16} style={{width:'18px',height:'16px'}} />
                    </span>
                    <p className="text-lg font-medium ">No tasks have been added to this epic yet</p>
                    <Button displayText="+ Add Tasks"  />
                </div>
            </div>
           
        </div>
    )
}