import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPatientEvolutions, deleteEvolution, } from "../../services/evolutions";
import type { Evolution } from "../../types/evolution";

export function PatientEvolutions() {
  const { id } = useParams();
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const data = await getPatientEvolutions(id);
      setEvolutions(data);
    }
    loadData();
  }, [id]);

  async function handleDelete(id: string) {

  const confirmed = window.confirm(
    "Deseja realmente excluir esta evolução?"
  );

  if (!confirmed) return;

  try {

    await deleteEvolution(id);

    setEvolutions((old) =>
      old.filter((item) => item.id !== id)
    );

    alert("Evolução removida com sucesso.");

  } catch (error) {

    console.error(error);

    alert("Erro ao excluir evolução.");
  }
}

  return (
    <div>
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to={`/patients/${id}`} className="text-sm text-blue-600 hover:underline">
            ← Voltar para o perfil
          </Link>
          <h1 className="text-3xl font-bold mt-1">Evoluções</h1>
        </div>
        
        <Link
          to={`/patients/${id}/evolutions/new`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          Nova Evolução
        </Link>
      </div>

      {/* LISTAGEM */}
      <div className="bg-white rounded-xl shadow p-6">
        {evolutions.length === 0 ? (
          <p className="text-center text-gray-500">Nenhuma evolução registrada.</p>
        ) : (
          <div className="space-y-4">
            {evolutions.map((evolution) => (
              <div
                key={evolution.id}
                className="flex justify-between items-start border rounded-lg p-5 bg-gray-50 hover:shadow-sm transition"
              >
                {/* LADO ESQUERDO: CONTEÚDO */}
                <div className="flex-1 pr-4">
                  <p className="text-gray-800 text-lg mb-3 whitespace-pre-wrap">
                    {evolution.descricao}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500">
                    <p>
                      <strong>Assinatura:</strong> {evolution.assinatura}
                    </p>
                    <p>
                      <strong>Profissional:</strong> {evolution.user.nome}
                    </p>
                    <p>
                      <strong>Cargo:</strong> {evolution.user.cargo}
                    </p>
                    <p>
                      <strong>Data:</strong> {new Date(evolution.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>

                {/* LADO DIREITO: BOTÕES DE AÇÃO */}
                <div className="flex flex-col gap-2 shrink-0">
                  <Link
                    to={`/evolutions/${evolution.id}/edit`}
                    state={{
                      evolution,
                    }}
                    className="bg-white border border-blue-600 text-blue-600 px-4 py-1.5 rounded-md text-sm font-bold hover:bg-blue-50 transition text-center"
                  >
                    Editar
                  </Link>
                  
                  {/* Botão de Excluir (Visual) */}
                  <button
                    className="bg-white border border-red-200 text-red-500 px-4 py-1.5 rounded-md text-sm font-bold hover:bg-red-50 transition text-center"
                    onClick={() => {
                      if(window.confirm("Deseja realmente excluir esta evolução?")) {
                        handleDelete(evolution.id)
                        console.log("Excluir", evolution.id);
                      }
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}