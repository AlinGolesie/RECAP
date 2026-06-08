interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

export function Button({ children, onClick, variant = "primary", type = "button", className = "", disabled = false }: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyles = variant === "primary"
    ? "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg hover:shadow-green-500/20"
    : "bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
}
