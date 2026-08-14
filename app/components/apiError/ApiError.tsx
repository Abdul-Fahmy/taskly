import { useAppDispatch } from "@/app/hooks/store.hooks";
import Button from "../button/Button";
import { fetchEpicsPagination } from "@/app/store/features/epics.slice";
import NoConnectionIcon from '@/app/assets/icons/no-connection.svg'

export default function ApiError({error,projectId,limit,currentPage}:{error: string,projectId: string,limit?: number,currentPage?: number}){
    const dispatch = useAppDispatch();

    return (
        <section className="w-full p-6 flex justify-center items-center">
        <div className="flex flex-col items-center justify-center">
            <div className="rounded-md bg-[#FFDAD6] flex items-center justify-center p-3">
            <NoConnectionIcon alt="no connection" />
            </div>

          <p className="text-[20px] font-semibold ">{error ?? "Something went wrong"}</p>
          <p className="text-[#434654]">We're having trouble retrieving your
 project epics right now. Please try
again in a moment.</p>
          <Button
            displayText="Retry Connection"
            className="mt-4 w-fit"
            onClick={() =>
              dispatch(
                fetchEpicsPagination({
                  projectId,
                  limit,
                  page: currentPage,
                }),
              )
            }
          />
        </div>
      </section>
    )
}