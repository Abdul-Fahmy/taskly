import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { projectFormData } from "../schemas/addProjectSchema";

export interface ProjectFormProps {
  form: UseFormReturn<projectFormData>;
  onSubmit: SubmitHandler<projectFormData>;
  errorMsg: string | null;
  displayText: string;
}
