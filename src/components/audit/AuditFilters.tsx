interface Props {
  onSearch: (filters: {
    usuario?: string;
    acao?: string;
    entidade?: string;
  }) => void;
}

export function AuditFilters({
  onSearch,
}: Props) {

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    const form =
      new FormData(event.currentTarget);

    onSearch({
      usuario: form.get("usuario") as string,
      acao: form.get("acao") as string,
      entidade: form.get("entidade") as string,
    });
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        rounded-xl
        shadow-sm
        border
        border-gray-100
        p-5
        mb-6
        grid
        grid-cols-1
        md:grid-cols-4
        gap-4
      "
    >

      <input
        name="usuario"
        placeholder="Usuário"
        className="
          border
          rounded-lg
          px-3
          py-2
          outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />


      <select
        name="acao"
        className="
          border
          rounded-lg
          px-3
          py-2
        "
      >
        <option value="">
          Todas ações
        </option>

        <option value="CREATE">
          Criação
        </option>

        <option value="UPDATE">
          Atualização
        </option>

        <option value="DELETE">
          Exclusão
        </option>

      </select>


      <input
        name="entidade"
        placeholder="Entidade"
        className="
          border
          rounded-lg
          px-3
          py-2
        "
      />


      <button
        type="submit"
        className="
          bg-blue-600
          text-white
          rounded-lg
          px-4
          py-2
          hover:bg-blue-700
          transition
        "
      >
        Pesquisar
      </button>

    </form>
  );
}