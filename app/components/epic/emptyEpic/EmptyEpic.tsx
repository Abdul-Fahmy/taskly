import Link from "next/link";
import { useParams } from "next/navigation";
import Stars from "@/app/assets/icons/stars.svg";
import Hierarchy from "@/app/assets/icons/hierarchy.svg";
import Track from "@/app/assets/icons/track.svg";
import RocketIcon from '@/app/assets/icons/rocket.svg'
import CutIcon from '@/app/assets/icons/cut.svg'
import PlusEpicIcon from '@/app/assets/icons/plusEpic.svg'
import SpeedIcon from '@/app/assets/icons/speed.svg'

export default function EmptyEpic() {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-4">
      <div className="grid grid-cols-2 gap-2 bg-white p-6 rounded-md ">
        <div className="bg-[#0052CC33] w-16 h-16 flex items-center justify-center">
         <RocketIcon/>
        </div>
        <div className="bg-[#0052CC33] w-16 h-16 flex items-center justify-center">
        <CutIcon/>
        </div>
        <div className="bg-[#0052CC33] w-16 h-16 flex items-center justify-center">
          <Track/>
        </div>
        <div className="bg-[#003D9B33] w-16 h-16 border border-dashed border-primary-container flex items-center justify-center">
         <PlusEpicIcon/>
        </div>
      </div>
      <h3 className="text-[36px] font-semibold">
        No epics in this project yet.
      </h3>
      <p className="text-[18px] text-[#434654] ">
        Break down your large project into manageable epics to track progress
        better and maintain architectural clarity.
      </p>
      <Link
        href={`/project/${projectId}/epics/new`}
        className="btn-primary w-fit flex items-center gap-2"
      >
        <SpeedIcon/>
        Create First Epic
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-start bg-[#F1F3FF] p-6 rounded-md h-[180px] gap-8">
          <div className="p-2 bg-white rounded-sm">
            <Stars />
          </div>

          <p className="text-[#041B3C] font-600 text-[16px]">
            High-Level Goals
          </p>
          <p className="text-[#434654] font-400 text-[12px] ">
            Define the broad objectives that span across multiple cycles.
          </p>
        </div>
        <div className="flex flex-col items-start bg-[#F1F3FF] p-6 rounded-md h-[180px] gap-8">
          <div className="p-2 bg-white rounded-sm">
            <Hierarchy />
          </div>
          <p className="text-[#041B3C] font-600 text-[16px]">
            Hierarchy Design
          </p>
          <p className="text-[#434654] font-400 text-[12px] ">
            Link individual tasks to parent epics for a consolidated view.
          </p>
        </div>
        <div className="flex flex-col items-start bg-[#F1F3FF] p-6 rounded-md h-[180px] gap-8">
          <div className="p-2 bg-white rounded-sm">
            <Track />
          </div>
          <p className="text-[#041B3C] font-600 text-[16px]">Track Velocity</p>
          <p className="text-[#434654] font-400 text-[12px] ">
            Visualize percentage completion at a macro project level.
          </p>
        </div>
      </div>
    </div>
  );
}
