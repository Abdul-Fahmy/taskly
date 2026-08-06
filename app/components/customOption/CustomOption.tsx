import { components, OptionProps } from "react-select";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

export const CustomOption = (props: OptionProps<any>) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-semibold">
          {getInitials(props.data.label)}
        </div>

        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );
};
import { SingleValueProps } from "react-select";

export const CustomSingleValue = (props: SingleValueProps<any>) => {
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-semibold">
          {getInitials(props.data.label)}
        </div>

        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );
};