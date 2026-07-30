import {
  Activity,
} from "lucide-react";

import type {
  AuditLog,
} from "../../types/audit";


interface AuditActivityListProps {
  atividades: AuditLog[];
}


export function AuditActivityList({
  atividades,
}: AuditActivityListProps) {


  return (

    <div
      className="
        bg-white
        rounded-xl
        shadow
        p-6
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
          mb-4
        "
      >

        <Activity
          size={22}
          className="text-blue-600"
        />

        <h2
          className="
            text-lg
            font-semibold
          "
        >
          Atividades Recentes
        </h2>

      </div>



      <div
        className="
          space-y-4
        "
      >

        {
          atividades.length === 0 ? (

            <p
              className="
                text-gray-500
                text-sm
              "
            >
              Nenhuma atividade encontrada.
            </p>


          ) : (


            atividades.map((log) => (

              <div
                key={log.id}
                className="
                  border-b
                  pb-3
                  last:border-none
                "
              >

                <div
                  className="
                    flex
                    justify-between
                    items-center
                  "
                >

                  <p
                    className="
                      font-medium
                    "
                  >
                    {log.acao}
                  </p>


                  <span
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    {log.entidade}
                  </span>

                </div>


                <p
                  className="
                    text-sm
                    text-gray-600
                  "
                >
                  {log.descricao ??
                    "Sem descrição"}
                </p>



                <div
                  className="
                    flex
                    justify-between
                    mt-2
                    text-xs
                    text-gray-400
                  "
                >

                  <span>
                    {log.user.nome}
                    {" - "}
                    {log.user.cargo}
                  </span>


                  <span>
                    {
                      new Date(
                        log.createdAt
                      ).toLocaleString(
                        "pt-BR"
                      )
                    }
                  </span>


                </div>


              </div>

            ))

          )
        }

      </div>


    </div>

  );
}