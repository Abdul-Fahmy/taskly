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

interface ProjectOption {
  value: string;
  label: string;
}

interface ProjectFilterProps {
  projects: ProjectOption[];
  value: ProjectOption | null;
  onChange: (project: ProjectOption | null) => void;
}

export default function ProjectFilter({
  projects,
  value,
  onChange,
}: ProjectFilterProps) {
  const options: ProjectOption[] = [
   
    ...projects,
  ];



  return (
    <Select
    instanceId={'projects-select'}
      options={options}
      value={value}
      onChange={onChange}
      unstyled
      classNames={selectClassNames}
      isSearchable
      placeholder="Select project..."
      className="w-[250px]"
      classNamePrefix="project-select"
    />
  );
}