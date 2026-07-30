import { Edit, Trash2, Loader2 } from "lucide-react";

interface Props {
  deleting: boolean;
  onEdit(): void;
  onDelete(): void;
}

export function EvolutionActions({
  deleting,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">

      <button
        onClick={onEdit}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-lg
          border
          border-slate-200
          bg-white
          px-3
          py-2
          text-xs
          font-semibold
          text-slate-700
          hover:bg-slate-50
        "
      >
        <Edit size={15} />
        Editar
      </button>

      <button
        onClick={onDelete}
        disabled={deleting}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-lg
          border
          border-rose-200
          bg-white
          px-3
          py-2
          text-xs
          font-semibold
          text-rose-600
          hover:bg-rose-50
          disabled:opacity-50
        "
      >
        {deleting ? (
          <Loader2
            size={15}
            className="animate-spin"
          />
        ) : (
          <Trash2 size={15} />
        )}

        Excluir
      </button>

    </div>
  );
}