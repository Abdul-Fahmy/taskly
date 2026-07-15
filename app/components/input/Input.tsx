// export default function Input({
//   label,
//   type,
//   placeholder,
//   error,
// }: {
//   label?: string;
//   type?: string;
//   placeholder?: string;
//   error?: string;
// }) {
//   return (
//     <div className="w-full">
//       <p>{label}</p>
//       <input className="input " type={type} placeholder={placeholder} />
//       {error && <p className="text-red-500 text-sm">{error}</p>}
//     </div>
//   );
// }
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <p>{label}</p>}

        <input
          ref={ref}
          className="input"
          type={type}
          placeholder={placeholder}
          {...props}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
