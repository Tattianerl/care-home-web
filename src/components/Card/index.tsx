
import type { ReactNode } from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  children?: ReactNode;
}

export function Card({
  title,
  value,
  icon,
  children,
}: CardProps) {
   return (
    <div
      className="
        bg-white
        rounded-xl
        border
        shadow-sm
        p-6
        transition-all
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-500">
            {title}
          </h3>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </p>
        </div>

        {icon && (
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            {icon}
          </div>
        )}
      </div>

      {children && (
        <div className="mt-4 text-sm text-slate-500">
          {children}
        </div>
      )}
    </div>
  );
}