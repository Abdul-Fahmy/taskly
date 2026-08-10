import { FormProps } from "@/app/types/epicForm";
import Input from "../input/Input";
import Select from "react-select";
import { Controller } from "react-hook-form";

export default function TaskForm({ form, onSubmit, errorMsg }: FormProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = form
    const options = [{ label: "Todo", value: "todo" }, { label: "in progress", value: "in_progress" }, { label: "in review", value: "in_review" }, { label: "done", value: "done" }]
    return (
        <div className="bg-white rounded-md p-6 w-full ">
            <form className="w-full space-y-4">
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="title">Title *</label>
                    <Input type="text" id="title" />
                </div>
                <div className="flex items-center gap-4 w-full">
                    <div className="w-full">
                        <label htmlFor="status">Status * </label>
                        <Controller
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <Select
                                unstyled


                                classNames={{
                                    control: () => "input  w-full cursor-pointer",
                                    valueContainer: () => "p-0",
                                    input: () => "m-0 p-0",
                                    indicatorsContainer: () => "p-0",
                                    dropdownIndicator: () => "p-0",
                                    clearIndicator: () => "p-0",
                                    menu: () =>
                                      "mt-1 rounded-md border border-gray-200 bg-white shadow-lg",
                                    option: ({ isFocused, isSelected }) =>
                                      `cursor-pointer px-3 py-2 ${
                                        isSelected
                                          ? "bg-blue-500 text-white"
                                          : isFocused
                                            ? "bg-gray-100"
                                            : "bg-white"
                                      }`,
                                  }}
                                    options={options}
                                    value={
                                        options.find(
                                            (option) => option.value === field.value,
                                        ) ?? options[0]
                                    }
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    ref={field.ref}
                                    onChange={(selectedOption) => {
                                        field.onChange(selectedOption?.value ?? "");
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="assignee_id"> Assignee</label>
                        <Controller
                            control={form.control}
                            name="assignee_id"
                            render={({ field }) => 
                               (
                                <Select 
                                unstyled


                                classNames={{
                                    control: () => "input  w-full cursor-pointer",
                                    valueContainer: () => "p-0",
                                    input: () => "m-0 p-0",
                                    indicatorsContainer: () => "p-0",
                                    dropdownIndicator: () => "p-0",
                                    clearIndicator: () => "p-0",
                                    menu: () =>
                                      "mt-1 rounded-md border border-gray-200 bg-white shadow-lg",
                                    option: ({ isFocused, isSelected }) =>
                                      `cursor-pointer px-3 py-2 ${
                                        isSelected
                                          ? "bg-blue-500 text-white"
                                          : isFocused
                                            ? "bg-gray-100"
                                            : "bg-white"
                                      }`,
                                  }}/>
                               )
                            }

                        />
                    </div>

                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="epic_id">Epic</label>
                    <Controller
                    control={form.control}
                    name="epic_id"
                    render={({field})=>(
                        <Select
                        
                        
                        unstyled


                                classNames={{
                                    control: () => "input  w-full cursor-pointer",
                                    valueContainer: () => "p-0",
                                    input: () => "m-0 p-0",
                                    indicatorsContainer: () => "p-0",
                                    dropdownIndicator: () => "p-0",
                                    clearIndicator: () => "p-0",
                                    menu: () =>
                                      "mt-1 rounded-md border border-gray-200 bg-white shadow-lg",
                                    option: ({ isFocused, isSelected }) =>
                                      `cursor-pointer px-3 py-2 ${
                                        isSelected
                                          ? "bg-blue-500 text-white"
                                          : isFocused
                                            ? "bg-gray-100"
                                            : "bg-white"
                                      }`,
                                  }}
                        />
                    )}
                    
                    
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="due_date">Due Date</label>
                    <input type="date" id="due_date" {...register('due_date')} className="input"/>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="description">Description</label>
                    <textarea   id="description" className="input resize-none" rows={5} placeholder="Provide detailed context for this task..." {...register('description')}></textarea>
                </div>
            </form>
        </div>
    )
}