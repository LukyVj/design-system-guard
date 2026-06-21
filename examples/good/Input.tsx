import { Input as DSInput } from "@acme/design-system";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function Input({ value, onChange }: InputProps) {
  return <DSInput value={value} onChange={onChange} />;
}
