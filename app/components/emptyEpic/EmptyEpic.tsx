import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EmptyEpic() {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-4">
      <Image
        src={"icons/noepic.svg"}
        alt="no epics found"
        width={188}
        height={188}
        style={{ width: "188px", height: "188px" }}
      />
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
    </div>
  );
}
