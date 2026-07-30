import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Plus, SearchX, AlertCircle } from "lucide-react";

import { AppointmentFilters } from "../../components/appointments/AppointmentFilters";
import { AppointmentTable } from "../../components/appointments/AppointmentTable";
import { Button } from "../../components/ui/Button";

import { AppointmentStatus } from "../../constants/appointmentStatus";

import {
  getAppointments,
  updateAppointmentStatus,
} from "../../services/appointments";

import type { Appointment } from "../../types/appointment";

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setErrorMessage(null);

        const data = await getAppointments({
          status: status || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });

        if (isMounted) {
          setAppointments(data);
        }
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        if (isMounted) {
          setErrorMessage(
            "Não foi possível carregar a lista de agendamentos. Tente novamente."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [status, startDate, endDate, reloadKey]);

  async function changeAppointmentStatus(
    id: string,
    newStatus: Appointment["status"],
    confirmationMessage: string
  ) {
    const confirmed = window.confirm(confirmationMessage);

    if (!confirmed) return;

    try {
      await updateAppointmentStatus(id, newStatus);
      setReloadKey((prev) => prev + 1);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Não foi possível atualizar o status do agendamento.");
    }
  }

  function handleFinish(id: string) {
    return changeAppointmentStatus(
      id,
      AppointmentStatus.REALIZADO,
      "Deseja marcar este agendamento como realizado?"
    );
  }

  function handleCancel(id: string) {
    return changeAppointmentStatus(
      id,
      AppointmentStatus.CANCELADO,
      "Deseja cancelar este agendamento?"
    );
  }

  function clearFilters() {
    setSearch("");
    setStatus("");
    setStartDate("");
    setEndDate("");
  }

  const hasActiveFilters = Boolean(search || status || startDate || endDate);

  const filteredAppointments = useMemo(() => {
    const term = search.toLowerCase();

    return appointments.filter(
      (appointment) =>
        appointment.titulo.toLowerCase().includes(term) ||
        appointment.patient.nome.toLowerCase().includes(term)
    );
  }, [appointments, search]);

  const hasAppointments = filteredAppointments.length > 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* CABEÇALHO */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-xs">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Agendamentos
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Gerencie consultas, exames e compromissos dos residentes.
            </p>
          </div>
        </div>

        <Link to="/appointments/new">
          <Button variant="success" className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            <span>Novo Agendamento</span>
          </Button>
        </Link>
      </header>

      {/* FEEDBACK DE ERRO DE CARREGAMENTO */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs font-medium text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FILTROS DE PESQUISA */}
      <AppointmentFilters
        search={search}
        status={status}
        startDate={startDate}
        endDate={endDate}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClear={clearFilters}
      />

      {/* TABELA / LISTA DE AGENDAMENTOS */}
      <AppointmentTable
        appointments={filteredAppointments}
        loading={loading}
        onFinish={handleFinish}
        onCancel={handleCancel}
      />

      {/* ESTADO VAZIO (EMPTY STATE) */}
      {!loading && !hasAppointments && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
            <SearchX className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold text-slate-800">
            Nenhum agendamento encontrado
          </h2>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            {hasActiveFilters
              ? "Não encontramos resultados para os filtros selecionados. Tente limpar a busca ou os períodos."
              : "Ainda não há compromissos cadastrados no sistema."}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {hasActiveFilters && (
              <Button type="button" variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            )}
            <Link to="/appointments/new">
              <Button variant="success">
                <Plus className="h-4 w-4" />
                <span>Novo Agendamento</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}