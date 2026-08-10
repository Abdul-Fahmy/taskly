import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { epicFormData } from "../schemas/addEpicSchema";
import { tasksFormData } from "../schemas/newTasksSchema";

export interface FormProps {
  form: UseFormReturn<epicFormData | tasksFormData>;
  onSubmit: SubmitHandler<epicFormData | tasksFormData>;
  errorMsg: string | null;
}
