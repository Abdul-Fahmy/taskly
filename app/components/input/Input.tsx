"use client";

import Image from "next/image";
import { forwardRef, InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <Image src={'/icons/eyeIcon.svg'} alt="eye icon" width={20} height={20} />
    );
  }

  return (
   <Image src={'/icons/closedEyeIcon.svg'} alt="closed eye icon" width={20} height={20} />
  );
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, placeholder, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="">
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

        {error && <p className="text-neutral-300 text-sm">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
