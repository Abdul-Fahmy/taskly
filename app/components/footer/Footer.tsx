import Image from "next/image";
import { usePathname } from "next/navigation";

const footerItems = [
  {
    label: "Projects",
    src: "/icons/projectIcon.svg",
    width: 22,
    height: 16,
    href: "project",
  },
  {
    label: "Epics",
    src: "/icons/epicIcon.svg",
    width: 20,
    height: 18,
    href: "epics",
  },
  {
    label: "Tasks",
    src: "/icons/tasksIcon.svg",
    width: 20,
    height: 16,
    href: "tasks",
  },
  {
    label: "Members",
    src: "/icons/membersIcon.svg",
    width: 22,
    height: 16,
    href: "members",
  },
  {
    label: "Details",
    src: "/icons/detailIcon.svg",
    width: 20,
    height: 20,
    href: "edit",
  },
] as const;

export default function Footer() {
  const pathname = usePathname();
  return (
    <footer className="w-full bg-[#F1F3FF] fixed bottom-0 left-0 right-0 md:hidden ">
      <div className="">
        <ul className="pt-3 flex items-center justify-between ">
          {footerItems.map((item) => {
            const isActive = pathname.endsWith(item.href.toLocaleLowerCase());
            return (
              <li
                key={item.label}
                className={`flex flex-col items-center gap-2 cursor-pointer p-2 rounded-md w-full m-0 ${isActive ? 'bg-white text-primary' :''}`}
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
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
