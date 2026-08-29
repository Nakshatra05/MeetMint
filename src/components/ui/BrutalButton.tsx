import { cn } from "@/lib/utils";

type BrutalButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary: "bg-yellow text-black hover:bg-yellow/90",
  secondary: "bg-purple text-white hover:bg-purple/90",
  ghost: "bg-white text-black hover:bg-gray-50",
  danger: "bg-orange text-black hover:bg-orange/90",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function BrutalButton({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: BrutalButtonProps) {
  return (
    <button
      className={cn(
        "brutal-btn brutal-press rounded-xl inline-flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
