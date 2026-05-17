interface ButtonProps {
  children: React.ReactNode;
  type?: "submit" | "button";
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "ghost";
}

export default function Button({
  children,
  type = "button",
  disabled,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const base = "w-full py-3 text-xs tracking-[3px] uppercase font-mono transition-all duration-200 rounded disabled:opacity-50";

  const variants = {
    primary: "bg-[#3dd6f5]/10 hover:bg-[#3dd6f5]/15 border border-(--color-border-strong) hover:border-[#3dd6f5]/60 text-(--color-cyan)",
    ghost: "bg-transparent border border-(--color-border) hover:border-(--color-border-strong) text-(--color-surface) hover:text-white",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}