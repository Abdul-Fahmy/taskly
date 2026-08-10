"use client";

import TaskForm from "@/app/components/tasks/TaskForm";
import { breadcrumbMap } from "@/app/constant/breadcrumbs";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { tasksFormData, tasksSchema } from "@/app/schemas/newTasksSchema";
import { generateBreadcrumbs } from "@/app/services/breadcrum";
import { fetchProjects } from "@/app/store/features/project.slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function NewTaskPage() {
    const dispatch = useAppDispatch();
    const { projectId } = useParams<{ projectId: string }>();
    const pathname = usePathname();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const project = useAppSelector((state) =>
        state.project.projects.find((project) => project.id === projectId),
    );
    const breadcrumbs = generateBreadcrumbs(pathname, breadcrumbMap
        , {
            [projectId]: project?.name || 'projectId',
        });

        const form = useForm<tasksFormData>({
            resolver:zodResolver(tasksSchema),
            defaultValues:{
                title:'',
                description:'',
                assignee_id:'',
                due_date:'',
                status:'',
                epic_id:'',
                project_id:projectId
            }
        })

        useEffect(()=>{
            dispatch(fetchProjects())
        },[
            projectId
        ])

    return (
        <div className="">
            <div className="hidden md:flex flex-col gap-2 items-start justify-start pt-6 pl-6">
                <span className="font-bold uppercase text-[12px] flex items-center gap-1 ">
                    {breadcrumbs.map((item, index) => (
                        <span key={item}>
                            {index > 0 && <span className="mx-2 text-neutral-400">&gt;</span>}

                            <span
                                className={
                                    index === breadcrumbs.length - 1
                                        ? "text-primary"
                                        : "text-[#43465499]"
                                }
                            >
                                {item}
                            </span>
                        </span>
                    ))}
                </span>
                <h3 className="font-bold text-[36px]">Create New Task</h3>
                <p className="text-text-secondary text-[14px]">Initialize a new work item within the Architectural Workspace ecosystem.</p>
            </div>
            <div className="mx-auto mt-8 max-w-2xl">
                <TaskForm  form={form} onSubmit={()=>{}} errorMsg={errorMsg}/>
            </div>
        </div>
    )
}