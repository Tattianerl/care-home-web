interface Props {
  deleting: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EvolutionActions({
  deleting,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Editar
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {deleting ? "Excluindo..." : "Excluir"}
        </button>
      )}
    </div>
  );
}
