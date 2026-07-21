"use client";

import Button from "@/app/components/button/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Project() {
 const router = useRouter();


  return (
    <section className="w-full p-2">
      <div className="flex items-center justify-between px-3">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-[30px] text-[#041B3C]">Projects</h3>
          <p className="text-[#434654] text-[16px]">Manage and curate your projects</p>
        </div>
        <Button onClick={()=>{
          router.push('/project/add')
        }} displayText="Create New Project" className="flex items-center gap-2 btn-primary w-fit" >
          <Image src={'/icons/plusIcon.svg'} alt="plus Icon" width={11} height={11} style={{ width: '11px', height: '11px' }} />
        </Button>
      </div>

    </section>
  );
}
