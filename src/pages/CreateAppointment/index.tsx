import { useEffect, useMemo, useState, useRef } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check, ChevronsUpDown, Loader2, Save, User, AlertCircle } from "lucide-react";

import type { Patient } from "../../types/patient";
import { createAppointment } from "../../services/appointments";
import { getPatients } from "../../services/patients";
import { Button } from "../../components/ui/Button";

export function CreateAppointment() {
  const navigate = useNavigate();

  // Estados do formulário
  const [titulo, setTitulo] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [patientId, setPatientId] = useState("");

  // Estados dos pacientes e busca integrada
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Carrega pacientes
  useEffect(() => {
    let isMounted = true;

    async function loadPatients() {
      try {
        setLoading(true);
        const response = await getPatients();

        if (isMounted) {
          const actualData = Array.isArray(response)
            ? response
            : response?.data && Array.isArray(response.data)
            ? response.data
            : [];

          setPatients(actualData);
        }
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
        if (isMounted) {
          setErrorMessage("Erro ao carregar a lista de pacientes.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPatients();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtra pacientes dinamicamente
  const filteredPatients = useMemo(() => {
    const term = search.toLowerCase().trim();
    return patients.filter((patient) => {
      const name = (patient.nome || (patient as unknown as { name?: string }).name || "").toLowerCase();
      return name.includes(term);
    });
  }, [patients, search]);

  // Paciente atualmente selecionado
  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === patientId);
  }, [patients, patientId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!patientId) {
      setErrorMessage("Por favor, selecione um paciente para continuar.");
      return;
    }

    setErrorMessage(null);

    try {
      setSaving(true);

      await createAppointment({
        titulo,
        dataHora: new Date(dataHora).toISOString(),
        observacoes,
        patientId,
      });

      navigate("/appointments");
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      setErrorMessage("Erro ao salvar o agendamento. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      {/* CABEÇALHO */}
      <div className="flex items-center gap-3">
        <Link
          to="/appointments"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Novo Agendamento
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Cadastre consultas, exames ou procedimentos para os residentes.
          </p>
        </div>
      </div>

      {/* FEEDBACK DE ERRO */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs font-medium text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FORMULÁRIO */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* TÍTULO */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Título do Agendamento *
              </label>
              <input
                type="text"
                placeholder="Ex: Consulta Geriatria, Exame de Sangue..."
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                required
              />
            </div>

            {/* DATA E HORA */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Data e Hora *
              </label>
              <input
                type="datetime-local"
                value={dataHora}
                onChange={(e) => setDataHora(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                required
              />
            </div>
          </div>

          {/* PACIENTE - SELETOR ÚNICO COM BUSCA INTEGRADA */}
          <div className="space-y-1.5 border-t border-slate-100 pt-5">
            <label className="block text-xs font-semibold text-slate-700">
              Paciente / Residente *
            </label>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                disabled={loading}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
              >
                <span className="flex items-center gap-2 truncate">
                  <User className="h-4 w-4 shrink-0 text-slate-400" />
                  {selectedPatient ? (
                    <span className="text-slate-900 font-semibold">
                      {selectedPatient.nome || (selectedPatient as unknown as { name?: string }).name}
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      {loading ? "Carregando pacientes..." : "Selecione ou busque um paciente..."}
                    </span>
                  )}
                </span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" />
              </button>

              {/* PAINEL DO DROPDOWN */}
              {isOpen && (
                <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* INPUT DE BUSCA */}
                  <div className="border-b border-slate-100 p-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Digite o nome para buscar..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* LISTA DE OPÇÕES */}
                  <div className="max-h-52 overflow-y-auto p-1">
                    {filteredPatients.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">
                        Nenhum paciente encontrado.
                      </div>
                    ) : (
                      filteredPatients.map((patient) => {
                        const name = patient.nome || (patient as unknown as { name?: string }).name;
                        const isSelected = patient.id === patientId;

                        return (
                          <button
                            key={patient.id}
                            type="button"
                            onClick={() => {
                              setPatientId(patient.id);
                              setIsOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                              isSelected
                                ? "bg-emerald-50 font-bold text-emerald-900"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span>{name}</span>
                            {isSelected && <Check className="h-4 w-4 text-emerald-600" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* OBSERVAÇÕES */}
          <div className="space-y-1.5 border-t border-slate-100 pt-5">
            <label className="block text-xs font-semibold text-slate-700">
              Observações
            </label>
            <textarea
              rows={4}
              placeholder="Recomendações, transporte, jejum ou detalhes do agendamento..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-y"
            />
          </div>
        </div>

        {/* BARRAS DE AÇÃO */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => navigate("/appointments")}
          >
            Cancelar
          </Button>

          <Button type="submit" variant="success" disabled={saving || loading}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Salvar Agendamento</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}