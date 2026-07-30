import type { ReactNode } from "react";

interface ReportSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ReportSection({
  title,
  description,
  children,
}: ReportSectionProps) {
  return (
    <section
      className="
        mb-8
      "
    >
      <div
        className="
          mb-5
        "
      >
        <h2
          className="
            text-xl
            font-bold
            text-gray-800
          "
        >
          {title}
        </h2>

        {description && (
          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            {description}
          </p>
        )}
      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >
        {children}
      </div>
    </section>
  );
}