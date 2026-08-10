import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EmptyEpic() {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-4">
      <div className="grid grid-cols-2 gap-2 bg-white p-6 rounded-md">
        <div className="bg-[#0052CC33] w-16 h-16">
          <Image
            src={"/icons/rocket.svg"}
            alt="no epics found"
            width={25}
            height={25}
            style={{ width: "25px", height: "25px" }}
          />
        </div>
        <div className="bg-[#0052CC33] w-16 h-16">
          <Image
            src={"/icons/cut.svg"}
            alt="cut"
            width={25}
            height={25}
            style={{ width: "25px", height: "25px" }}
          />
        </div>
        <div className="bg-[#0052CC33] w-16 h-16">
          <Image
            src={"/icons/track.svg"}
            alt="dots"
            width={25}
            height={25}
            style={{ width: "25px", height: "25px" }}
          />
        </div>
        <div className="bg-[#003D9B33] w-16 h-16 border border-dashed border-primary-container">
          <Image
            src={"/icons/plusEpic.svg"}
            alt="plus"
            width={25}
            height={25}
            style={{ width: "25px", height: "25px" }}
          />
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
        <Image
          src={"/icons/speed.svg"}
          alt="rounded plus icon"
          width={20}
          height={20}
          style={{ width: "20px", height: "20px" }}
        />
        Create First Epic
      </Link>
      <div className="flex items-center gap-4">
        <div className=""></div>
        <div className=""></div>
        <div className=""></div>
      </div>
    </div>
  );
}
