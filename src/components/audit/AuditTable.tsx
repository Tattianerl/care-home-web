import type { AuditLog } from "../../types/audit";


interface Props {
  logs: AuditLog[];
}


export function AuditTable({
  logs,
}: Props) {

  return (

    <div
      className="
        bg-white
        rounded-xl
        shadow-sm
        border
        border-gray-100
        overflow-x-auto
      "
    >

      <table className="w-full">

        <thead>

          <tr
            className="
              bg-gray-50
              text-left
            "
          >

            <th className="p-4">
              Data
            </th>

            <th className="p-4">
              Usuário
            </th>

            <th className="p-4">
              Cargo
            </th>

            <th className="p-4">
              Ação
            </th>

            <th className="p-4">
              Entidade
            </th>

            <th className="p-4">
              Descrição
            </th>

          </tr>

        </thead>


        <tbody>

          {logs.map((log) => (

            <tr
              key={log.id}
              className="
                border-t
                hover:bg-gray-50
              "
            >

              <td className="p-4 text-sm">
                {new Date(
                  log.createdAt
                ).toLocaleString("pt-BR")}
              </td>


              <td className="p-4">
                {log.user.nome}
              </td>


              <td className="p-4">
                {log.user.cargo}
              </td>


              <td className="p-4">
                {log.acao}
              </td>


              <td className="p-4">
                {log.entidade}
              </td>


              <td className="p-4">
                {log.descricao ?? "-"}
              </td>


            </tr>

          ))}

        </tbody>

      </table>


      {logs.length === 0 && (

        <div
          className="
            p-6
            text-center
            text-gray-500
          "
        >
          Nenhum registro encontrado.
        </div>

      )}

    </div>

  );
}