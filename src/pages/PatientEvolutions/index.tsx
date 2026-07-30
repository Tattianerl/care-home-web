import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FileText,
  Loader2,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  deleteEvolution,
  getPatientEvolutions,
} from "../../services/evolutions";

import type {
  Evolution,
} from "../../types/evolution";

import { EvolutionCard } from "../../components/evolutions/EvolutionCard";
import { EvolutionFilters } from "../../components/evolutions/EvolutionFilters";
import { EmptyEvolution } from "../../components/evolutions/EmptyEvolution";

export function PatientEvolutions() {
  const { id } = useParams<{ id: string }>();

  const [patientName, setPatientName] = useState("");

  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [professional, setProfessional] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function loadEvolutions(patientId: string) {
    const response =
      await getPatientEvolutions(patientId);

    setPatientName(response.patient.nome);
    setEvolutions(response.evolutions);
  }

  useEffect(() => {
    if (!id) return;

    const patientId = id;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const response =
          await getPatientEvolutions(patientId);

        if (cancelled) return;

        setPatientName(response.patient.nome);
        setEvolutions(response.evolutions);
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function refresh() {
    if (!id) return;

    const patientId = id;

    try {
      await loadEvolutions(patientId);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(evolutionId: string) {
    const confirmed = window.confirm(
      "Deseja excluir esta evolução?"
    );

    if (!confirmed) return;

    try {
      await deleteEvolution(evolutionId);

      await refresh();
    } catch (error) {
      console.error(error);
    }
  }

  function clearFilters() {
    setSearch("");
    setProfessional("");
    setStartDate("");
    setEndDate("");
  }

  const filtered = useMemo(() => {
    return evolutions.filter((item) => {
      const searchMatch =
        item.descricao
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.user.nome
          .toLowerCase()
          .includes(search.toLowerCase());

      const professionalMatch =
        !professional ||
        item.user.nome
          .toLowerCase()
          .includes(professional.toLowerCase());

      const created =
        new Date(item.createdAt);

      const startMatch =
        !startDate ||
        created >= new Date(startDate);

      const endMatch =
        !endDate ||
        created <=
          new Date(`${endDate}T23:59:59`);

      return (
        searchMatch &&
        professionalMatch &&
        startMatch &&
        endMatch
      );
    });
  }, [
    evolutions,
    search,
    professional,
    startDate,
    endDate,
  ]);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <FileText className="text-emerald-600" />
            Evoluções do Residente
          </h1>

          <p className="mt-1 text-slate-500">
            {patientName}
          </p>

        </div>

        <Link
          to={`/patients/${id}/evolutions/new`}
          className="
            rounded-xl
            bg-emerald-600
            px-4
            py-2
            text-sm
            font-semibold
            text-white
            hover:bg-emerald-700
          "
        >
          Nova Evolução
        </Link>

      </div>

      <EvolutionFilters
        search={search}
        professional={professional}
        startDate={startDate}
        endDate={endDate}
        onSearchChange={setSearch}
        onProfessionalChange={setProfessional}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClear={clearFilters}
      />

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyEvolution />
      ) : (
        <div className="space-y-4">

          {filtered.map((evolution) => (
            <EvolutionCard
              key={evolution.id}
              evolution={evolution}
              deleting={false}
              onDelete={handleDelete}
            />
          ))}

        </div>
      )}

    </div>
  );
}