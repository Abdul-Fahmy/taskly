export default function Button({
  displayText,
  disabled,
  type,
}: {
  displayText: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button type={type} className="btn-primary" disabled={disabled}>
      {displayText}
    </button>
  );
}
