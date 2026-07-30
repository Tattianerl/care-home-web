import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Loader2, Calendar, ArrowLeft } from "lucide-react";

import {
  getAppointmentById,
  updateAppointment,
} from "../../services/appointments";

// Função utilitária para converter Date em string compatível com <input type="datetime-local" />
function formatToDatetimeLocal(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
  return localISOTime;
}

export function EditAppointment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAppointment() {
      if (!id) return;

      try {
        setLoading(true);
        const appointment = await getAppointmentById(id);

        if (isMounted) {
          setTitulo(appointment.titulo || "");
          setDataHora(
            appointment.dataHora ? formatToDatetimeLocal(appointment.dataHora) : ""
          );
          setObservacoes(appointment.observacoes ?? "");
        }
      } catch (error) {
        console.error("Erro ao carregar agendamento:", error);
        alert("Não foi possível carregar os dados do agendamento.");
        navigate("/appointments");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAppointment();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!id) return;

    try {
      setSubmitting(true);

      await updateAppointment(id, {
        titulo,
        dataHora: new Date(dataHora).toISOString(),
        observacoes: observacoes.trim() || undefined,
      });

      alert("Agendamento atualizado com sucesso!");
      navigate("/appointments");
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      alert("Erro ao atualizar agendamento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium">Carregando dados do agendamento...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Editar Agendamento
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Altere os detalhes do compromisso agendado.
            </p>
          </div>
        </div>

        <Link
          to="/appointments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Link>
      </div>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5"
      >
        {/* TÍTULO */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Título do Compromisso *
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            placeholder="Ex: Consulta Médica de Rotina"
            required
          />
        </div>

        {/* DATA E HORA */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Data e Horário *
          </label>
          <input
            type="datetime-local"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            required
          />
        </div>

        {/* OBSERVAÇÕES */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Observações
          </label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            placeholder="Instruções ou detalhes adicionais..."
            rows={4}
          />
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/appointments"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <span>Salvar Alterações</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}