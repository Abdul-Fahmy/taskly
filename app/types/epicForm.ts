import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { epicFormData } from "../schemas/addEpicSchema";

export interface EpicFormProps {
  form: UseFormReturn<epicFormData>;
  onSubmit: SubmitHandler<epicFormData>;
  errorMsg: string | null;
}
