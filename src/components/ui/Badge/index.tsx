interface BadgeProps {
  color: "green" | "blue" | "red" | "purple" | "gray" | "orange";
  children: React.ReactNode;
}

const colors = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  red: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
  gray: "bg-gray-100 text-gray-700",
  orange: "bg-orange-100 text-orange-700",
};

export function Badge({ color, children }: BadgeProps) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
}