"use client";

import Select from "react-select";

const selectClassNames = {
    control: () => "  w-full cursor-pointer bg-white p-2 rounded-md",
    valueContainer: () => "p-0",
    input: () => "m-0 p-0",
    indicatorsContainer: () => "p-0",
    dropdownIndicator: () => "p-0",
    clearIndicator: () => "p-0",
    menu: () => "mt-1 rounded-md border border-gray-200 bg-white shadow-lg",
    option: ({
      isFocused,
      isSelected,
    }: {
      isFocused: boolean;
      isSelected: boolean;
    }) =>
      `cursor-pointer px-3 py-2 ${
        isSelected
          ? "bg-blue-500 text-white"
          : isFocused
            ? "bg-gray-100"
            : "bg-white"
      }`,
  };

export type StatusOption = {
  value: string;
  label: string;
};

interface StatusFilterProps {
  statuses: StatusOption[];
  value: StatusOption | null;
  onChange: (status: StatusOption | null) => void;
}

export default function StatusFilter({
  statuses,
  value,
  onChange,
}: StatusFilterProps) {
  return (
    <Select<StatusOption>
    instanceId={'statusFilter-select'}

      options={statuses}
      value={value}
      onChange={onChange}
      isSearchable
      unstyled
      classNames={selectClassNames}
      placeholder="Select status..."
      className="w-[220px]"
    />
  );
}