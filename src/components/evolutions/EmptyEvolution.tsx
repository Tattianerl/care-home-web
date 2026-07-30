import { FileText } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
}

export function EmptyEvolution({
  title = "Nenhuma evolução encontrada",
  description = "Ainda não existe nenhuma evolução cadastrada.",
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">

      <FileText
        size={42}
        className="text-slate-300"
      />

      <h3 className="mt-3 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}