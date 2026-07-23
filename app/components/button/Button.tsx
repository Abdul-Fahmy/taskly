import { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  displayText: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  displayText,
  disabled,
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={["btn-primary", className].filter(Boolean).join(" ")}
      disabled={disabled}
      {...props}
    >
      {children}
      {displayText}
    </button>
  );
}
