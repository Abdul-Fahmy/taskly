export default function Input({
  label,
  type,
  placeholder,
}: {
  label?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <p>{label}</p>
      <input className="input" type={type} placeholder={placeholder} />
    </div>
  );
}
