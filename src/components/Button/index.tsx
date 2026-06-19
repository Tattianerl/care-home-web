import type { ButtonHTMLAttributes } from "react";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> ;

export function Button({
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className="
        bg-blue-600
        text-white
        px-4
        py-2
        rounded-lg
        hover:bg-blue-700
        transition
      "
    >
      {children}
    </button>
  );
}