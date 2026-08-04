import { Epic } from "@/app/types/epicResponse";
import Image from "next/image";



export default function EpicDetailsPopup({epic, onClose}:{epic:Epic,onClose:()=>void}) {
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
           
        </div>
    )
}