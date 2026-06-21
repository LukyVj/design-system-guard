
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn rounded-[9px] bg-[#121212] px-[13px] py-[7px] text-[15px] text-white hover:bg-[#ff00aa] disabled:opacity-50"
      style={{ boxShadow: "0 0 0 1px #333333" }}
    >
      {children}
    </button>
  );
}
