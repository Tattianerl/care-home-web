import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AxiosError } from "axios";

import {
  User,
  ShieldCheck,
  HeartPulse,
  Utensils,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

import { getPatient, updatePatient } from "../../services/patients";

import type { Patient } from "../../types/patient";

import {
  BloodType,
  DependencyLevel,
  Gender,
  MaritalStatus,
} from "../../types/enums";

import type {
  BloodType as BloodTypeType,
  DependencyLevel as DependencyLevelType,
  Gender as GenderType,
  MaritalStatus as MaritalStatusType,
} from "../../types/enums";

import { Button } from "../../components/ui/Button";

const EMPTY_FORM = {
  // Identificação
  nome: "",
  dataNascimento: "",
  cpf: "",
  rg: "",
  naturalidade: "",
  estadoCivil: "" as MaritalStatusType | "",
  cartaoSus: "",
  fotoUrl: "",
  quartoLeito: "",
  genero: "" as GenderType | "",

  // Responsável
  responsavel: "",
  telefone: "",
  responsavelCpf: "",
  responsavelGrauParentesco: "",
  responsavelEmail: "",
  responsavelEndereco: "",

  // Saúde
  tipoSanguineo: "" as BloodTypeType | "",
  planoSaude: "",
  contatoEmergencia: "",
  grauDependencia: "" as DependencyLevelType | "",
  historicoMedico: "",
  alergias: "",
  diagnosticos: "",
  restricaoAlimentar: "",
  observacoes: "",

  // Internação
  dataInternacao: "",
  dataAlta: "",
};

type PatientFormData = typeof EMPTY_FORM;

function formatDateForInput(value?: string | null): string {
  if (!value) return "";

  return value.includes("T")
    ? value.split("T")[0]
    : value;
}

function valueOrEmpty<T>(value: T | null | undefined): T | "" {
  return value ?? "";
}

export function EditPatient() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] =
    useState<PatientFormData>(EMPTY_FORM);

  // Atualiza um campo do formulário
  function handleChange(
    field: keyof PatientFormData,
    value: string
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // Carrega paciente
  useEffect(() => {
    async function loadPatient() {
      if (!id) {
        setErrorMessage("Paciente não identificado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage(null);

        const patient = await getPatient(id);

        setFormData({
          // Identificação
          nome: patient.nome ?? "",

          dataNascimento: formatDateForInput(
            patient.dataNascimento
          ),

          cpf: valueOrEmpty(patient.cpf),

          rg: valueOrEmpty(patient.rg),

          naturalidade: valueOrEmpty(
            patient.naturalidade
          ),

          estadoCivil: valueOrEmpty(
            patient.estadoCivil
          ),

          cartaoSus: valueOrEmpty(
            patient.cartaoSus
          ),

          fotoUrl: valueOrEmpty(
            patient.fotoUrl
          ),

          quartoLeito: valueOrEmpty(
            patient.quartoLeito
          ),

          genero: valueOrEmpty(
            patient.genero
          ),

          // Responsável
          responsavel: patient.responsavel ?? "",

          telefone: patient.telefone ?? "",

          responsavelCpf: valueOrEmpty(
            patient.responsavelCpf
          ),

          responsavelGrauParentesco:
            valueOrEmpty(
              patient.responsavelGrauParentesco
            ),

          responsavelEmail: valueOrEmpty(
            patient.responsavelEmail
          ),

          responsavelEndereco:
            valueOrEmpty(
              patient.responsavelEndereco
            ),

          // Saúde
          tipoSanguineo: valueOrEmpty(
            patient.tipoSanguineo
          ),

          planoSaude: valueOrEmpty(
            patient.planoSaude
          ),

          contatoEmergencia:
            valueOrEmpty(
              patient.contatoEmergencia
            ),

          grauDependencia:
            valueOrEmpty(
              patient.grauDependencia
            ),

          historicoMedico:
            valueOrEmpty(
              patient.historicoMedico
            ),

          alergias: valueOrEmpty(
            patient.alergias
          ),

          diagnosticos:
            valueOrEmpty(
              patient.diagnosticos
            ),

          restricaoAlimentar:
            valueOrEmpty(
              patient.restricaoAlimentar
            ),

          observacoes:
            valueOrEmpty(
              patient.observacoes
            ),

          // Internação
          dataInternacao:
            formatDateForInput(
              patient.dataInternacao
            ),

          dataAlta:
            formatDateForInput(
              patient.dataAlta
            ),
        });
      } catch (error) {
        console.error(
          "Erro ao carregar paciente:",
          error
        );

        if (error instanceof AxiosError) {
          setErrorMessage(
            error.response?.data?.error ??
              "Não foi possível carregar os dados do residente."
          );
        } else {
          setErrorMessage(
            "Não foi possível carregar os dados do residente."
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadPatient();
  }, [id]);

  // Salvar alterações
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!id) {
      setErrorMessage(
        "Paciente não identificado."
      );
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    if (
      !formData.nome.trim() ||
      !formData.dataNascimento ||
      !formData.genero ||
      !formData.responsavel.trim() ||
      !formData.telefone.trim()
    ) {
      setErrorMessage(
        "Preencha todos os campos obrigatórios (*)."
      );
      return;
    }

    try {
      setSaving(true);

      const payload: Partial<Patient> = {
        // Identificação
        nome: formData.nome.trim(),

        dataNascimento:
          formData.dataNascimento,

        cpf:
          formData.cpf.replace(/\D/g, "") ||
          undefined,

        rg:
          formData.rg.trim() ||
          undefined,

        naturalidade:
          formData.naturalidade.trim() ||
          undefined,

        estadoCivil:
          formData.estadoCivil ||
          undefined,

        cartaoSus:
          formData.cartaoSus.trim() ||
          undefined,

        fotoUrl:
          formData.fotoUrl.trim() ||
          undefined,

        quartoLeito:
          formData.quartoLeito.trim() ||
          undefined,

        genero:
          formData.genero as GenderType,

        // Responsável
        responsavel:
          formData.responsavel.trim(),

        telefone:
          formData.telefone.trim(),

        responsavelCpf:
          formData.responsavelCpf.replace(
            /\D/g,
            ""
          ) || undefined,

        responsavelGrauParentesco:
          formData.responsavelGrauParentesco.trim() ||
          undefined,

        responsavelEmail:
          formData.responsavelEmail.trim() ||
          undefined,

        responsavelEndereco:
          formData.responsavelEndereco.trim() ||
          undefined,

        // Saúde
        tipoSanguineo:
          formData.tipoSanguineo ||
          undefined,

        planoSaude:
          formData.planoSaude.trim() ||
          undefined,

        contatoEmergencia:
          formData.contatoEmergencia.trim() ||
          undefined,

        grauDependencia:
          formData.grauDependencia ||
          undefined,

        historicoMedico:
          formData.historicoMedico.trim() ||
          undefined,

        alergias:
          formData.alergias.trim() ||
          undefined,

        diagnosticos:
          formData.diagnosticos.trim() ||
          undefined,

        restricaoAlimentar:
          formData.restricaoAlimentar.trim() ||
          undefined,

        observacoes:
          formData.observacoes.trim() ||
          undefined,

        // Internação
        dataInternacao:
          formData.dataInternacao ||
          undefined,

        dataAlta:
          formData.dataAlta ||
          undefined,
      };

      await updatePatient(id, payload);

      setSuccessMessage(
        "Prontuário do residente atualizado com sucesso!"
      );

      setTimeout(() => {
        navigate(`/patients/${id}`);
      }, 1200);
    } catch (error) {
      console.error(
        "Erro ao atualizar paciente:",
        error
      );

      if (error instanceof AxiosError) {
        setErrorMessage(
          error.response?.data?.error ??
            "Erro ao salvar as alterações."
        );
      } else {
        setErrorMessage(
          "Erro ao salvar as alterações. Tente novamente."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />

          <span>
            Carregando dados do residente...
          </span>
        </div>
      </div>
    );
  }

  // Tela
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/patients/${id}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Editar Prontuário
            </h1>

            <p className="text-xs font-medium text-slate-500">
              Atualize as informações cadastrais,
              familiares e de saúde do residente.
            </p>
          </div>
        </div>
      </div>

      {/* Erro */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs font-medium text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />

          <span>{errorMessage}</span>
        </div>
      )}

      {/* Sucesso */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

          <span>{successMessage}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 text-xs text-slate-700"
      >
        {/* ============================================================
            1. IDENTIFICAÇÃO
        ============================================================ */}

        <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <User className="h-4 w-4" />

            1. Identificação e Acomodação
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Nome */}
            <div>
              <label className="block font-semibold">
                Nome Completo{" "}
                <span className="text-rose-500">*</span>
              </label>

              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) =>
                  handleChange(
                    "nome",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            {/* Data nascimento */}
            <div>
              <label className="block font-semibold">
                Data de Nascimento{" "}
                <span className="text-rose-500">*</span>
              </label>

              <input
                type="date"
                required
                value={
                  formData.dataNascimento
                }
                onChange={(e) =>
                  handleChange(
                    "dataNascimento",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            {/* CPF */}
            <div>
              <label className="block font-semibold">
                CPF
              </label>

              <input
                type="text"
                maxLength={14}
                placeholder="Apenas números"
                value={formData.cpf}
                onChange={(e) =>
                  handleChange(
                    "cpf",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            {/* RG */}
            <div>
              <label className="block font-semibold">
                RG
              </label>

              <input
                type="text"
                value={formData.rg}
                onChange={(e) =>
                  handleChange(
                    "rg",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            {/* Naturalidade */}
            <div>
              <label className="block font-semibold">
                Naturalidade
              </label>

              <input
                type="text"
                placeholder="Cidade / Estado"
                value={
                  formData.naturalidade
                }
                onChange={(e) =>
                  handleChange(
                    "naturalidade",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            {/* Estado civil */}
            <div>
              <label className="block font-semibold">
                Estado Civil
              </label>

              <select
                value={formData.estadoCivil}
                onChange={(e) =>
                  handleChange(
                    "estadoCivil",
                    e.target.value
                  )
                }
                className="input"
              >
                <option value="">
                  Não informado
                </option>

                <option value={MaritalStatus.SOLTEIRO}>
                  Solteiro(a)
                </option>

                <option value={MaritalStatus.CASADO}>
                  Casado(a)
                </option>

                <option value={MaritalStatus.DIVORCIADO}>
                  Divorciado(a)
                </option>

                <option value={MaritalStatus.VIUVO}>
                  Viúvo(a)
                </option>

                <option value={MaritalStatus.UNIAO_ESTAVEL}>
                  União Estável
                </option>
              </select>
            </div>

            {/* Cartão SUS */}
            <div>
              <label className="block font-semibold">
                Cartão SUS
              </label>

              <input
                type="text"
                value={
                  formData.cartaoSus
                }
                onChange={(e) =>
                  handleChange(
                    "cartaoSus",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            {/* Quarto */}
            <div>
              <label className="block font-semibold">
                Quarto / Leito
              </label>

              <input
                type="text"
                placeholder="Ex: Quarto 102 - Leito B"
                value={
                  formData.quartoLeito
                }
                onChange={(e) =>
                  handleChange(
                    "quartoLeito",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            {/* Gênero */}
            <div>
              <label className="block font-semibold">
                Gênero{" "}
                <span className="text-rose-500">*</span>
              </label>

              <select
                required
                value={formData.genero}
                onChange={(e) =>
                  handleChange(
                    "genero",
                    e.target.value
                  )
                }
                className="input"
              >
                <option value="">
                  Selecione...
                </option>

                <option value={Gender.FEMININO}>
                  Feminino
                </option>

                <option value={Gender.MASCULINO}>
                  Masculino
                </option>

                <option value={Gender.OUTRO}>
                  Outro
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* ============================================================
            2. RESPONSÁVEL
        ============================================================ */}

        <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <ShieldCheck className="h-4 w-4" />

            2. Responsável Legal / Familiar
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block font-semibold">
                Nome do Responsável{" "}
                <span className="text-rose-500">*</span>
              </label>

              <input
                required
                type="text"
                value={
                  formData.responsavel
                }
                onChange={(e) =>
                  handleChange(
                    "responsavel",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            <div>
              <label className="block font-semibold">
                Telefone Principal{" "}
                <span className="text-rose-500">*</span>
              </label>

              <input
                required
                type="text"
                placeholder="(00) 00000-0000"
                value={
                  formData.telefone
                }
                onChange={(e) =>
                  handleChange(
                    "telefone",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            <div>
              <label className="block font-semibold">
                CPF do Responsável
              </label>

              <input
                type="text"
                maxLength={14}
                value={
                  formData.responsavelCpf
                }
                onChange={(e) =>
                  handleChange(
                    "responsavelCpf",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            <div>
              <label className="block font-semibold">
                Grau de Parentesco
              </label>

              <input
                type="text"
                placeholder="Ex: Filho(a), Tutor Legal"
                value={
                  formData.responsavelGrauParentesco
                }
                onChange={(e) =>
                  handleChange(
                    "responsavelGrauParentesco",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold">
                E-mail do Responsável
              </label>

              <input
                type="email"
                value={
                  formData.responsavelEmail
                }
                onChange={(e) =>
                  handleChange(
                    "responsavelEmail",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold">
                Endereço do Responsável
              </label>

              <input
                type="text"
                placeholder="Endereço completo"
                value={
                  formData.responsavelEndereco
                }
                onChange={(e) =>
                  handleChange(
                    "responsavelEndereco",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>
          </div>
        </section>

        {/* ============================================================
            3. SAÚDE
        ============================================================ */}

        <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <HeartPulse className="h-4 w-4" />

            3. Saúde e Emergência
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Dependência */}
            <div>
              <label className="block font-semibold">
                Grau de Dependência
              </label>

              <select
                value={
                  formData.grauDependencia
                }
                onChange={(e) =>
                  handleChange(
                    "grauDependencia",
                    e.target.value
                  )
                }
                className="input"
              >
                <option value="">
                  Não informado
                </option>

                <option value={DependencyLevel.INDEPENDENTE}>
                  Grau I — Independente
                </option>

                <option value={DependencyLevel.PARCIAL}>
                  Grau II — Dependência Parcial
                </option>

                <option value={DependencyLevel.TOTAL}>
                  Grau III — Dependência Total
                </option>
              </select>
            </div>

            {/* Tipo sanguíneo */}
            <div>
              <label className="block font-semibold">
                Tipo Sanguíneo
              </label>

              <select
                value={
                  formData.tipoSanguineo
                }
                onChange={(e) =>
                  handleChange(
                    "tipoSanguineo",
                    e.target.value
                  )
                }
                className="input"
              >
                <option value="">
                  Não informado
                </option>

                <option value={BloodType.A_POSITIVO}>
                  A+
                </option>

                <option value={BloodType.A_NEGATIVO}>
                  A-
                </option>

                <option value={BloodType.B_POSITIVO}>
                  B+
                </option>

                <option value={BloodType.B_NEGATIVO}>
                  B-
                </option>

                <option value={BloodType.AB_POSITIVO}>
                  AB+
                </option>

                <option value={BloodType.AB_NEGATIVO}>
                  AB-
                </option>

                <option value={BloodType.O_POSITIVO}>
                  O+
                </option>

                <option value={BloodType.O_NEGATIVO}>
                  O-
                </option>
              </select>
            </div>

            {/* Plano */}
            <div>
              <label className="block font-semibold">
                Plano de Saúde
              </label>

              <input
                type="text"
                value={
                  formData.planoSaude
                }
                onChange={(e) =>
                  handleChange(
                    "planoSaude",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            {/* Emergência */}
            <div>
              <label className="block font-semibold">
                Contato de Emergência
              </label>

              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={
                  formData.contatoEmergencia
                }
                onChange={(e) =>
                  handleChange(
                    "contatoEmergencia",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            {/* Histórico */}
            <div className="md:col-span-2">
              <label className="block font-semibold">
                Histórico Médico
              </label>

              <textarea
                rows={3}
                value={
                  formData.historicoMedico
                }
                onChange={(e) =>
                  handleChange(
                    "historicoMedico",
                    e.target.value
                  )
                }
                className="input resize-none"
              />
            </div>

            {/* Diagnósticos */}
            <div className="md:col-span-2">
              <label className="block font-semibold">
                Diagnósticos
              </label>

              <textarea
                rows={3}
                value={
                  formData.diagnosticos
                }
                onChange={(e) =>
                  handleChange(
                    "diagnosticos",
                    e.target.value
                  )
                }
                className="input resize-none"
              />
            </div>
          </div>
        </section>

        {/* ============================================================
            4. NUTRIÇÃO
        ============================================================ */}

        <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <Utensils className="h-4 w-4" />

            4. Perfil Nutricional e Alergias
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block font-semibold">
                Alergias Conhecidas
              </label>

              <input
                type="text"
                value={
                  formData.alergias
                }
                onChange={(e) =>
                  handleChange(
                    "alergias",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            <div>
              <label className="block font-semibold">
                Restrição / Dieta Alimentar
              </label>

              <input
                type="text"
                value={
                  formData.restricaoAlimentar
                }
                onChange={(e) =>
                  handleChange(
                    "restricaoAlimentar",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold">
                Observações Gerais
              </label>

              <textarea
                rows={3}
                value={
                  formData.observacoes
                }
                onChange={(e) =>
                  handleChange(
                    "observacoes",
                    e.target.value
                  )
                }
                className="input resize-none"
              />
            </div>
          </div>
        </section>

        {/* ============================================================
            5. INTERNAÇÃO
        ============================================================ */}

        <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <HeartPulse className="h-4 w-4" />

            5. Internação
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block font-semibold">
                Data de Internação
              </label>

              <input
                type="date"
                value={
                  formData.dataInternacao
                }
                onChange={(e) =>
                  handleChange(
                    "dataInternacao",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>

            <div>
              <label className="block font-semibold">
                Data de Alta
              </label>

              <input
                type="date"
                value={
                  formData.dataAlta
                }
                onChange={(e) =>
                  handleChange(
                    "dataAlta",
                    e.target.value
                  )
                }
                className="input"
              />
            </div>
          </div>
        </section>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="success"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                <span>
                  Salvando...
                </span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />

                <span>
                  Salvar Alterações
                </span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

