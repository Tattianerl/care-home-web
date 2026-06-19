import type { InputHTMLAttributes } from "react";
type InputProps =
  InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="
        w-full
        border
        rounded-lg
        px-4
        py-2
        outline-none
        focus:ring-2
        focus:ring-blue-500
      "
    />
  );
}