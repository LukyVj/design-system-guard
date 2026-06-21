import { Button as DSButton } from "@acme/design-system";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <DSButton
      variant="primary"
      size="md"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </DSButton>
  );
}
