export const selectClassNames = {
    control: () => "input  w-full cursor-pointer",
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