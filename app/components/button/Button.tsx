export default function Button({
  displayText,
  disabled,
}: {
  displayText: string;
  disabled?: boolean;
}) {
  return (
    <button className="btn-primary" disabled={disabled}>
      {displayText}
    </button>
  );
}
