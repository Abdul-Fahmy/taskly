import { useParams } from "next/navigation"

export default function NewTaskPage(){
    const {projectId} = useParams<{projectId: string}>();
    
    return(
        <div className="">

        </div>
    )
}