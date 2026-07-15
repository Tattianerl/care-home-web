import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getTimeline } from "../../services/timeline";

import type { TimelineItem } from "../../types/timeline";

export function PatientTimeline() {
  const { id } = useParams();

  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  useEffect(() => {
    async function loadTimeline() {
      if (!id) return;

      const data = await getTimeline(id);

      setTimeline(data);
    }

    loadTimeline();
  }, [id]);

  function badgeColor(tipo: string) {
    switch (tipo) {
      case "EVOLUTION":
        return "bg-green-100 text-green-700";

      case "VITAL_SIGN":
        return "bg-blue-100 text-blue-700";

      case "APPOINTMENT":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <div>

          <Link
            to={`/patients/${id}`}
            className="text-blue-600 hover:underline"
          >
            ← Voltar
          </Link>

          <h1 className="text-3xl font-bold mt-2">
            Timeline do Paciente
          </h1>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        {timeline.length === 0 ? (

          <p className="text-gray-500">
            Nenhum evento encontrado.
          </p>

        ) : (

          <div className="space-y-6">

            {timeline.map((item, index) => (

              <div
                key={index}
                className="border-l-4 border-blue-500 pl-6 relative"
              >

                <div
                  className="
                    absolute
                    -left-2.5
                    top-2
                    w-4
                    h-4
                    rounded-full
                    bg-blue-600
                  "
                />

                <span
                
                  className={`
                    inline-block
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-bold
                    ${badgeColor(item.tipo)}
                  `}
                >
                  {item.tipo}
                </span>

                <p className="mt-3 text-gray-800">
                  {item.descricao}
                </p>

                <small className="text-gray-500">
                  {new Date(item.data).toLocaleString("pt-BR")}
                </small>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}