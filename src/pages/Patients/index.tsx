import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Users,
  Search,
  UserPlus,
  Phone,
  UserCheck,
  ChevronRight,
  Loader2,
  UserX,
  X,
  ArrowUpDown,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getPatients } from "../../services/patients";
import type { Patient } from "../../types/patient";
import { RegisterPatientModal } from "../../components/RegisterPatientModal";

const ITEMS_PER_PAGE = 6; // Quantidade de residentes por página

export function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para Ordenação e Paginação
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

 // Função para carregar os pacientes
  const loadPatients = useCallback(async () => {
    try {
      setLoading(true);
      // Forçamos/informamos ao TS que a resposta pode ser um array ou um objeto genérico
      const response: unknown = await getPatients();

      let patientsList: Patient[] = [];

      if (Array.isArray(response)) {
        patientsList = response;
      } else if (
        response !== null &&
        typeof response === "object" &&
        "data" in response &&
        Array.isArray((response as { data: unknown }).data)
      ) {
        patientsList = (response as { data: Patient[] }).data;
      }

      setPatients(patientsList);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  // Resetar a página para 1 sempre que a busca alterar
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Alternar a ordem alfabética (A-Z / Z-A)
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // 1. Filtragem + Ordenação (com useMemo para otimizar performance)
  const filteredAndSortedPatients = useMemo(() => {
    return patients
      .filter(
        (patient) =>
          patient.nome.toLowerCase().includes(search.toLowerCase()) ||
          patient.responsavel?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const comparison = a.nome.localeCompare(b.nome, "pt-BR", {
          sensitivity: "base",
        });
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [patients, search, sortOrder]);

  // 2. Cálculo da Paginação
  const totalPages = Math.ceil(filteredAndSortedPatients.length / ITEMS_PER_PAGE) || 1;
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedPatients.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedPatients, currentPage]);

  return (
    <div className="space-y-8 pb-10">
      {/* Cabeçalho da Página */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-xs">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Residentes
            </h1>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Gerencie e acompanhe os prontuários dos residentes cadastrados.
            </p>
          </div>
        </div>

        {/* Botão para Abrir o Modal de Cadastro */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4" />
          <span>Novo Residente</span>
        </button>
      </header>

      {/* Controles: Barra de Pesquisa + Botão de Ordenação */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar residente por nome ou responsável..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Botão de Ordenação */}
        <button
          type="button"
          onClick={toggleSortOrder}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          title="Alternar ordem alfabética"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
          <span>Ordem: {sortOrder === "asc" ? "A - Z" : "Z - A"}</span>
        </button>
      </div>

      {/* Conteúdo Principal / Listagem */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <span>Carregando lista de residentes...</span>
          </div>
        </div>
      ) : filteredAndSortedPatients.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <UserX className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">
            Nenhum residente encontrado
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {search
              ? "Tente ajustar os termos de busca para encontrar o registro."
              : "Não há residentes cadastrados no sistema no momento."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPatients.map((patient) => (
              <Link
                key={patient.id}
                to={`/patients/${patient.id}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md"
              >
                <div className="space-y-3">
                  {/* Header do Card */}
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="line-clamp-1 font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
                      {patient.nome}
                    </h2>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        patient.ativo !== false
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border border-slate-200 bg-slate-100 text-slate-600"
                      }`}
                    >
                      {patient.ativo !== false ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  {/* Detalhes do Residente */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">
                        <strong className="font-semibold text-slate-700">Resp:</strong>{" "}
                        {patient.responsavel || "Não informado"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {patient.telefone || "Sem telefone cadastrado"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rodapé do Card */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-emerald-600">
                  <span>Acessar prontuário</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          {/* Componente de Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200/80 pt-4">
              <span className="text-xs text-slate-500">
                Página <strong className="text-slate-700">{currentPage}</strong> de{" "}
                <strong className="text-slate-700">{totalPages}</strong> ({filteredAndSortedPatients.length} residentes)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-xs hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-xs hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Próxima</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de Cadastro de Residente */}
      <RegisterPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadPatients}
      />
    </div>
  );
}