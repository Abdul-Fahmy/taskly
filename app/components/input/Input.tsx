"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import EyeIconOpen from "@/app/assets/icons/eyeIcon.svg";
import ClosedEyeIcon from "@/app/assets/icons/closedEyeIcon.svg";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return <EyeIconOpen open={open} />;
  }

  return <ClosedEyeIcon />;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, placeholder, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="w-full ">
        {label && <div>{label}</div>}

        <div className="relative">
          <input
            ref={ref}
            className={`input ${isPassword ? "" : ""} ${className ?? ""}`}
            type={inputType}
            placeholder={placeholder}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-700 hover:text-neutral-950 bg-transparent"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
