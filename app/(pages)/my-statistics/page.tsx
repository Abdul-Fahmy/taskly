import DateRangePicker from "@/app/components/myStatistics/DateRangePicker";

export default function MyStatisticsPage() {
  return (
    <div className="p-8 flex flex-col gap-8">
        <div className="flex flex-col items-start w-full">
            <h1 className="text-3xl font-bold text-[#041B3C]">Weekly Planner</h1>
            <p className="text-[#434654] font-400 ">Manage your deadlines and track team velocity.</p>
        </div>
        <div className="flex justify-between w-full p-2 bg-surface-highest rounded-md">
            <DateRangePicker />
        </div>
    </div>
  )
}
