"use client";

import Button from "@/app/components/button/Button";
import ProjectCard from "@/app/components/projectCard/ProjectCard";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchProjects } from "@/app/store/features/project.slice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Project() {
 const router = useRouter();
 const dispatch = useAppDispatch();
 const projects = useAppSelector((state)=>state.project.projects)

 useEffect(()=>{
  dispatch(fetchProjects())
 },[dispatch])

  return (
    <section className="w-full p-2">
      <div className="flex items-center justify-between px-3">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-[30px] text-[#041B3C]">Projects</h3>
          <p className="text-[#434654] text-[16px]">Manage and curate your projects</p>
        </div>
        <Button onClick={()=>{
          router.push('/project/add')
        }} displayText="Create New Project" className="hidden md:flex items-center gap-2 btn-primary w-fit " >
          <Image src={'/icons/plusIcon.svg'} alt="plus Icon" width={11} height={11} style={{ width: '11px', height: '11px' }} />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
{
  projects.map((project)=> 
    <ProjectCard key={project.id} project={project} />
  )
}
<div> </div>
      </div>


      <div className="flex justify-end">
      <Button onClick={()=>{
          router.push('/project/add')
        }} displayText="" className="flex md:hidden items-center gap-2 btn-primary w-fit " >
          <Image src={'/icons/plusIcon.svg'} alt="plus Icon" width={11} height={11} style={{ width: '11px', height: '11px' }} />
        </Button>
      </div>

    </section>
  );
}
