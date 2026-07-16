import { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  displayText: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  displayText,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className="btn-primary" disabled={disabled} {...props}>
      {displayText}
    </button>
  );
}
