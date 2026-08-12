

import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";

export interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  errorMsg: string | null;
}
