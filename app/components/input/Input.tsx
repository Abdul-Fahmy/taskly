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
    <div className="w-full">
      <p>{label}</p>
      <input className="input " type={type} placeholder={placeholder} />
    </div>
  );
}
