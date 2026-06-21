type InputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function Input({ value, onChange }: InputProps) {
  return (
    <input
      className="input rounded-[9px] bg-[#121212] px-[13px] py-[7px] text-[15px] text-white hover:bg-[#ff00aa] disabled:opacity-50"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
