import Image from "next/image";

const footerItems = [
    { label: "Projects", src: "/icons/projectIcon.svg", width: 22, height: 16 },
    {
      label: "Epics",
      src: "/icons/epicIcon.svg",
      width: 20,
      height: 18,
    },
    {
      label: "Tasks",
      src: "/icons/tasksIcon.svg",
      width: 20,
      height: 16,
    },
    {
      label: "Members",
      src: "/icons/membersIcon.svg",
      width: 22,
      height: 16,
    },
    {
      label: "Details",
      src: "/icons/detailIcon.svg",
      width: 20,
      height: 20,
    },
  ] as const;

export default function Footer() {
    return (
        <footer className="w-full bg-[#F1F3FF] fixed bottom-0 left-0 right-0 md:hidden ">
<div className="">
<ul className="pt-3 flex items-center justify-between ">
            {footerItems.map((item) => (
              <li
                key={item.label}
                className="flex flex-col items-center gap-2 cursor-pointer w-full m-0"
              >
                <Image
                  alt={item.label}
                  src={item.src}
                  width={item.width}
                  height={item.height}
                  style={{ width: "auto", height: "auto" }}
                />
                {item.label}
              </li>
            ))}
          </ul>
</div>

        </footer>
    )
}