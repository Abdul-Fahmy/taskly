import {
    components,
    OptionProps,
    SingleValueProps,
    
  } from "react-select";

  import BoardView from '@/app/assets/icons/boardView.svg'
  import ListView from '@/app/assets/icons/ListView.svg'

export type ViewOption = {
    value: "board" | "list";
    label: string;
    icon: React.ReactNode;
  };


  export const viewOptions: ViewOption[] = [
    {
      value: "board",
      label: "Board View",
      icon: <BoardView className= 'flex items-center justify-center' />,
    },
    {
      value: "list",
      label: "List View",
      icon: <ListView className= ' flex items-center justify-center'/>
    },
  ];



  export const CustomOption = (props: OptionProps<ViewOption>) => {
    return (
      <components.Option {...props}>
        <div className="flex items-center gap-2">
          {props.data.icon}
  
          <span>{props.data.label}</span>
        </div>
      </components.Option>
    );
  };


 export const CustomSingleValue = (
    props: SingleValueProps<ViewOption>
  ) => {
    return (
      <components.SingleValue {...props}>
        <div className="flex items-center gap-2">
          {props.data.icon}
          <span>{props.data.label}</span>
        </div>
      </components.SingleValue>
    );
  };