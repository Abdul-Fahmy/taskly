import { getInitials } from "@/app/constant/getInitials";
import { components, OptionProps, SingleValueProps } from "react-select";

type AssigneeOption = {
  value: string;
  label: string;
};

export const CustomOption = (props: OptionProps<AssigneeOption>) => {
  const label = props.data.label ?? "Unassigned";

  return (
    <components.Option {...props}>
      <div className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-[10px] font-semibold">
          {getInitials(label) || "U"}
        </div>
        <span>{label}</span>
      </div>
    </components.Option>
  );
};

export const CustomSingleValue = (props: SingleValueProps<AssigneeOption>) => {
  const label = props.data.label ?? "Unassigned";

  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-[10px] font-semibold">
          {getInitials(label) || "U"}
        </div>
        <span>{label}</span>
      </div>
    </components.SingleValue>
  );
};
