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
        <div className="flex h-4 w-4 items-center justify-center rounded-lg bg-primary text-white text-sm font-semibold">
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
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-semibold">
          {getInitials(label) || "U"}
        </div>
        <span>{label}</span>
      </div>
    </components.SingleValue>
  );
};
