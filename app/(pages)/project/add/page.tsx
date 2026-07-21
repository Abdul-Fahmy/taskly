'use client'
import Button from "@/app/components/button/Button";
import Input from "@/app/components/input/Input";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"

const breadcrumbMap: Record<string, string> = {
    project: "Projects",
    add: "Add New Project",
};

export default function AddProject() {
    const pathname = usePathname();
    const previousPage = pathname.substring(0,pathname.lastIndexOf('/'))

    const breadcrumbs = pathname
        .split("/")
        .filter(Boolean)
        .map((segment) => breadcrumbMap[segment] || segment);



    return (
        <>
            <div className="flex flex-col gap-4 items-start justify-start pt-[24px] pl-8">
                <span className="font-bold uppercase text-[12px] flex items-center gap-1 "> {breadcrumbs.map((item, index) => (
                    <span key={item}>
                        {index > 0 && (
                            <span className="mx-2 text-neutral-400">
                                &gt;
                            </span>
                        )}

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
                ))}</span>
                <h3 className="font-bold text-[36px]">Add New Project</h3>
            </div>

            <div className="w-[672px] bg-white rounded-md shadow-[0_1px_2px_0_#0000000D] mx-auto ">
                <div className="p-8 flex items-center justify-start gap-4">
                    <div className="p-3 h-auto rounded-md bg-[#0052CC1A]">
                        <Image src={'/icons/icon.svg'} alt="icon" width={22} height={20} style={{ width: '22px', height: '20px' }} />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[24px] font-semibold text-[#041B3C] leading-8">Initialize New Project</p>
                        <p className="text-[#4F5F7B] text-[14px] leading-5 ">Define the scope and foundational details of your project.</p>
                    </div>
                </div>

                <form action="" className="space-y-8 px-8">
                    <div className="">
                        <span className="text-[#4F5F7B] font-bold text-[11px] uppercase">Project title *</span>
                        <Input placeholder="Enter project title" type="text" />

                    </div>
                    <div className="">
                        <span className="text-[#4F5F7B] font-bold text-[11px] uppercase">DESCRIPTION</span>
                        <textarea title="DESCCRIPTION" name="description" className="w-full bg-surface-highest py-3.5 px-4 rounded-md resize-none" rows={10} placeholder="Provide a high-level overview of the project's architectural objectives and 
key milestones..." />
                    </div>
                </form>
                <div className="px-8 mt-[60px] pb-8 flex items-center justify-between">
                    <Link href={previousPage} className="font-bold text-[14px] text-[#4F5F7B] py-3 px-4 ">Back</Link>
                    <Button displayText="Create Project" type="submit" className="btn-primary" />
                </div>
            </div>
<div className="w-[672px] mx-auto pb-8 flex items-center justify-center gap-2 mt-8">
    <Image src={'/icons/tip.svg'} alt="tip icon" width={12} height={15} style={{width:'12px', height:'15px'}} />
    <p className="text-[12px] text-[#4F5F7B] "><span className="font-bold">Pro Tip:</span> You can invite project members and assign epics immediately after the initial creation process.</p>
</div>
        </>
    )
}