import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Loader2,
  Pill,
} from "lucide-react";

import {
  getMedication,
  updateMedication,
  type UpdateMedicationInput,
} from "../../services/medications";

import type { Medication } from "../../types/medication";
import type { MedicationStatus } from "../../types/enums";

const medicationStatuses: {
  value: MedicationStatus;
  label: string;
}[] = [
  {
    value: "ATIVO",
    label: "Ativo",
  },
  {
    value: "SUSPENSO",
    label: "Suspenso",
  },
  {
    value: "FINALIZADO",
    label: "Finalizado",
  },
];

export function EditMedication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [medication, setMedication] =
    useState<Medication | null>(null);

  const [form, setForm] =
    useState<UpdateMedicationInput | null>(null);

  const [horario, setHorario] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMedication() {
      if (!id) {
        setError("Medicação não identificada.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getMedication(id);

        setMedication(data);

        setForm({
          nome: data.nome,
          dosagem: data.dosagem,
          frequencia: data.frequencia,
          viaAdministracao: data.viaAdministracao,
          horarios: data.horarios ?? [],

          // O backend retorna ISO:
          // 2026-05-15T00:00:00.000Z
          // O input type="date" precisa de:
          // 2026-05-15
          inicioTratamento: data.inicioTratamento
            ? data.inicioTratamento.slice(0, 10)
            : null,

          fimTratamento: data.fimTratamento
            ? data.fimTratamento.slice(0, 10)
            : null,

          status: data.status,
          controlado: data.controlado,
          usoContinuo: data.usoContinuo,
          observacoes: data.observacoes ?? null,
          prescritoPorId:
            data.prescritoPorId ?? null,
        });
      } catch (err) {
        console.error(
          "Erro ao carregar medicação:",
          err
        );

        setError(
          "Não foi possível carregar a medicação."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMedication();
  }, [id]);

  function handleChange(
    field: keyof UpdateMedicationInput,
    value: string | boolean | MedicationStatus
  ) {
    setForm((current) => {
      if (!current) return current;

      return {
        ...current,
        [field]: value,
      };
    });
  }

  function handleAddHorario() {
    if (!horario || !form) return;

    if (form.horarios?.includes(horario)) {
      setError("Este horário já foi adicionado.");
      return;
    }

    setForm({
      ...form,
      horarios: [
        ...(form.horarios ?? []),
        horario,
      ],
    });

    setHorario("");
    setError("");
  }

  function handleRemoveHorario(index: number) {
    if (!form) return;

    setForm({
      ...form,
      horarios: (form.horarios ?? []).filter(
        (_, horarioIndex) =>
          horarioIndex !== index
      ),
    });
  }

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    if (!id || !medication || !form) {
      setError("Medicação não identificada.");
      return;
    }

    if (
      !form.nome?.trim() ||
      !form.dosagem?.trim() ||
      !form.frequencia?.trim() ||
      !form.viaAdministracao?.trim()
    ) {
      setError(
        "Preencha os campos obrigatórios."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data: UpdateMedicationInput = {
        ...form,
        nome: form.nome.trim(),
        dosagem: form.dosagem.trim(),
        frequencia: form.frequencia.trim(),
        viaAdministracao:
          form.viaAdministracao.trim(),

        inicioTratamento:
          form.inicioTratamento || null,

        fimTratamento:
          form.fimTratamento || null,

        observacoes:
          form.observacoes?.trim() || null,

        prescritoPorId:
          form.prescritoPorId || null,
      };

      await updateMedication(id, data);

      navigate(
        `/patients/${medication.patientId}/medications`
      );
    } catch (err) {
      console.error(
        "Erro ao atualizar medicação:",
        err
      );

      setError(
        "Não foi possível atualizar a medicação."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>
            Carregando medicação...
          </span>
        </div>
      </div>
    );
  }

  if (!form || !medication) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-medium text-rose-700">
          {error ||
            "Não foi possível carregar a medicação."}
        </div>
      </div>
    );
  }

  const patientId = medication.patientId;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-10">
      <header className="space-y-3">
        <Link
          to={`/patients/${patientId}/medications`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para medicações
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Pill className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Editar Medicação
            </h1>

            <p className="text-xs font-medium text-slate-500">
              Atualize os dados do tratamento
              medicamentoso.
            </p>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <section className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Dados da Medicação
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="Nome da medicação"
              required
              value={form.nome ?? ""}
              onChange={(value) =>
                handleChange("nome", value)
              }
              placeholder="Ex.: Losartana"
            />

            <Field
              label="Dosagem"
              required
              value={form.dosagem ?? ""}
              onChange={(value) =>
                handleChange("dosagem", value)
              }
              placeholder="Ex.: 50 mg"
            />

            <Field
              label="Frequência"
              required
              value={form.frequencia ?? ""}
              onChange={(value) =>
                handleChange(
                  "frequencia",
                  value
                )
              }
              placeholder="Ex.: 12/12 horas"
            />

            <Field
              label="Via de administração"
              required
              value={
                form.viaAdministracao ?? ""
              }
              onChange={(value) =>
                handleChange(
                  "viaAdministracao",
                  value
                )
              }
              placeholder="Ex.: Oral"
            />

            <Field
              label="Início do tratamento"
              type="date"
              value={
                form.inicioTratamento ?? ""
              }
              onChange={(value) =>
                handleChange(
                  "inicioTratamento",
                  value
                )
              }
            />

            <Field
              label="Fim do tratamento"
              type="date"
              value={
                form.fimTratamento ?? ""
              }
              onChange={(value) =>
                handleChange(
                  "fimTratamento",
                  value
                )
              }
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                Status
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  handleChange(
                    "status",
                    event.target
                      .value as MedicationStatus
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                {medicationStatuses.map(
                  (status) => (
                    <option
                      key={status.value}
                      value={status.value}
                    >
                      {status.label}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-5">
            <label className="block text-xs font-semibold text-slate-600">
              Horários
            </label>

            <div className="flex gap-2">
              <input
                type="time"
                value={horario}
                onChange={(event) =>
                  setHorario(
                    event.target.value
                  )
                }
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

              <button
                type="button"
                onClick={handleAddHorario}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Adicionar
              </button>
            </div>

            {(form.horarios ?? []).length >
              0 && (
              <div className="flex flex-wrap gap-2">
                {form.horarios?.map(
                  (item, index) => (
                    <button
                      key={`${item}-${index}`}
                      type="button"
                      onClick={() =>
                        handleRemoveHorario(
                          index
                        )
                      }
                      className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-rose-50 hover:text-rose-700"
                      title="Clique para remover"
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3">
              <input
                type="checkbox"
                checked={
                  form.controlado ?? false
                }
                onChange={(event) =>
                  handleChange(
                    "controlado",
                    event.target.checked
                  )
                }
                className="h-4 w-4 accent-emerald-600"
              />

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Medicamento controlado
                </p>

                <p className="text-[11px] text-slate-400">
                  Requer controle especial.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3">
              <input
                type="checkbox"
                checked={
                  form.usoContinuo ?? false
                }
                onChange={(event) =>
                  handleChange(
                    "usoContinuo",
                    event.target.checked
                  )
                }
                className="h-4 w-4 accent-emerald-600"
              />

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Uso contínuo
                </p>

                <p className="text-[11px] text-slate-400">
                  Medicação de uso contínuo.
                </p>
              </div>
            </label>
          </div>

          <div className="space-y-1.5 border-t border-slate-100 pt-5">
            <label className="block text-xs font-semibold text-slate-600">
              Observações
            </label>

            <textarea
              value={form.observacoes ?? ""}
              onChange={(event) =>
                handleChange(
                  "observacoes",
                  event.target.value
                )
              }
              rows={4}
              placeholder="Orientações ou observações sobre a medicação..."
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Link
            to={`/patients/${patientId}/medications`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-600">
        {label}

        {required && (
          <span className="ml-1 text-rose-500">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}
