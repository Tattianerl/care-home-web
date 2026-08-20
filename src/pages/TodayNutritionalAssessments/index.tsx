import { useEffect, useState, useMemo } from "react";
import { api } from "../../services/api"; 
import { Utensils, Search, ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AssessmentToday {
  id: string;
  peso: number;
  altura: number;
  imc: number | null;
  observacoes: string | null;
  createdAt: string;
  patient: {
    id: string;
    nome: string;
  };
  user: {
    id: string;
    nome: string;
    cargo: string;
  };
}

interface Professional {
  id: string;
  nome: string;
  cargo?: string;
}

export function TodayNutritionalAssessments() {
  const [assessments, setAssessments] = useState<AssessmentToday[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedImcCategory, setSelectedImcCategory] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Busca paralela para máxima performance e velocidade de carregamento
        const [assessmentsRes, usersRes] = await Promise.all([
          api.get("/nutritional-assessments/today"),
          api.get("/users"), // Altere para a sua rota de usuários/profissionais ativos
        ]);

        setAssessments(assessmentsRes.data);
        setProfessionals(usersRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados do dia", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Classificação rápida de IMC
  const getImcCategory = (imc: number | null): string => {
    if (!imc) return "NONE";
    if (imc < 18.5) return "UNDERWEIGHT";
    if (imc < 25) return "NORMAL";
    if (imc < 30) return "OVERWEIGHT";
    return "OBESITY";
  };

  // Filtragem otimizada em memória
  const filteredAssessments = useMemo(() => {
    return assessments.filter((item) => {
      const matchesSearch = item.patient.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesUser = selectedUser === "" || item.user.id === selectedUser;

      const matchesImc =
        selectedImcCategory === "" ||
        getImcCategory(item.imc) === selectedImcCategory;

      return matchesSearch && matchesUser && matchesImc;
    });
  }, [assessments, searchTerm, selectedUser, selectedImcCategory]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedUser("");
    setSelectedImcCategory("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            title="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Utensils className="text-teal-600" />
              Avaliações Nutricionais de Hoje
            </h1>
            <p className="text-sm text-gray-500">
              Consulte e acompanhe o fluxo de atendimentos nutricionais de hoje.
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3 md:space-y-0 md:flex md:items-center md:gap-4">
        {/* Campo de Busca por Nome do Paciente */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Select de Profissionais */}
        <div className="w-full md:w-56">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Todos os profissionais</option>
            {professionals.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Select de Faixa de IMC */}
        <div className="w-full md:w-48">
          <select
            value={selectedImcCategory}
            onChange={(e) => setSelectedImcCategory(e.target.value)}
            className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Todas as faixas de IMC</option>
            <option value="UNDERWEIGHT">Abaixo do peso (&lt; 18.5)</option>
            <option value="NORMAL">Eutrófico (18.5 - 24.9)</option>
            <option value="OVERWEIGHT">Sobrepeso (25 - 29.9)</option>
            <option value="OBESITY">Obesidade (&ge; 30)</option>
          </select>
        </div>

        {/* Botão para Limpar */}
        {(searchTerm || selectedUser || selectedImcCategory) && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg transition-colors border border-gray-200 hover:border-red-200"
            title="Limpar filtros"
          >
            <RotateCcw size={14} />
            Limpar
          </button>
        )}
      </div>

      {/* Tabela de Resultados */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando avaliações...</div>
      ) : filteredAssessments.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100 text-gray-500">
          {assessments.length === 0
            ? "Nenhuma avaliação nutricional registrada hoje."
            : "Nenhum resultado encontrado para os filtros aplicados."}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                <th className="p-4">Paciente</th>
                <th className="p-4">Profissional</th>
                <th className="p-4">Peso / Altura</th>
                <th className="p-4">IMC</th>
                <th className="p-4">Horário</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredAssessments.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{item.patient.nome}</td>
                  <td className="p-4 text-gray-600">
                    {item.user.nome}{" "}
                    <span className="text-xs text-gray-400">({item.user.cargo})</span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {item.peso} kg / {item.altura} m
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 font-semibold text-xs rounded-md ${
                        !item.imc
                          ? "bg-gray-100 text-gray-600"
                          : item.imc < 18.5
                          ? "bg-yellow-50 text-yellow-700"
                          : item.imc < 25
                          ? "bg-emerald-50 text-emerald-700"
                          : item.imc < 30
                          ? "bg-orange-50 text-orange-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {item.imc ? item.imc.toFixed(1) : "--"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(item.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => navigate(`/patients/${item.patient.id}/nutrition`)}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}