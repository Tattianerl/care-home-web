import { useState, useEffect, useCallback } from "react";
import type { FormEvent, MouseEvent, ChangeEvent } from "react";

import {
  UserPlus,
  X,
  User,
  ShieldCheck,
  HeartPulse,
  Utensils,
  Loader2,
  FileText,
} from "lucide-react";

import { AxiosError } from "axios";

import {
  createPatient,
  type PatientData,
} from "../../services/patients";

import {
  BloodType,
  DependencyLevel,
  Gender,
  MaritalStatus,
} from "../../types/enums";

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PatientFormData {
  nome: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  naturalidade: string;
  estadoCivil: MaritalStatus | "";
  cartaoSus: string;
  quartoLeito: string;
  genero: Gender | "";

  responsavel: string;
  telefone: string;
  responsavelCpf: string;
  responsavelGrauParentesco: string;
  responsavelEmail: string;
  responsavelEndereco: string;

  tipoSanguineo: BloodType | "";
  planoSaude: string;
  contatoEmergencia: string;
  grauDependencia: DependencyLevel | "";

  historicoMedico: string;
  alergias: string;
  diagnosticos: string;
  restricaoAlimentar: string;
  observacoes: string;

  dataInternacao: string;
}

const INITIAL_FORM_STATE: PatientFormData = {
  nome: "",
  dataNascimento: "",
  cpf: "",
  rg: "",
  naturalidade: "",
  estadoCivil: "",

  cartaoSus: "",
  quartoLeito: "",
  genero: "",

  responsavel: "",
  telefone: "",
  responsavelCpf: "",
  responsavelGrauParentesco: "",
  responsavelEmail: "",
  responsavelEndereco: "",

  tipoSanguineo: "",
  planoSaude: "",
  contatoEmergencia: "",
  grauDependencia: "",

  historicoMedico: "",
  alergias: "",
  diagnosticos: "",
  restricaoAlimentar: "",
  observacoes: "",

  dataInternacao: "",
};

export function RegisterPatientModal({
  isOpen,
  onClose,
  onSuccess,
}: RegisterPatientModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] =
    useState<PatientFormData>(INITIAL_FORM_STATE);

  /*
   * Fecha o modal e limpa o formulário.
   */
  const handleResetAndClose = useCallback(() => {
    if (loading) return;

    setFormData(INITIAL_FORM_STATE);
    onClose();
  }, [loading, onClose]);

  /*
   * Permite fechar com ESC.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        handleResetAndClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, loading, handleResetAndClose]);

  if (!isOpen) {
    return null;
  }

  /*
   * Atualiza qualquer campo do formulário.
   */
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * Clique no backdrop.
   */
  const handleBackdropClick = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (
      event.target === event.currentTarget &&
      !loading
    ) {
      handleResetAndClose();
    }
  };

  /*
   * Envio do formulário.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.nome.trim()) {
      alert("Informe o nome completo do residente.");
      return;
    }

    if (!formData.dataNascimento) {
      alert("Informe a data de nascimento.");
      return;
    }

    if (!formData.genero) {
      alert("Selecione o gênero.");
      return;
    }

    if (!formData.responsavel.trim()) {
      alert("Informe o responsável.");
      return;
    }

    if (!formData.telefone.trim()) {
      alert("Informe o telefone do responsável.");
      return;
    }

    try {
      setLoading(true);
      const payload: PatientData = {
        nome: formData.nome.trim(),

        dataNascimento: formData.dataNascimento,

        cpf:
          formData.cpf.replace(/\D/g, "") || undefined,

        rg:
          formData.rg.trim() || undefined,

        naturalidade:
          formData.naturalidade.trim() || undefined,

        estadoCivil:
          formData.estadoCivil || undefined,

        cartaoSus:
          formData.cartaoSus.replace(/\D/g, "") || undefined,

        quartoLeito:
          formData.quartoLeito.trim() || undefined,

        genero: formData.genero as Gender,

        responsavel:
          formData.responsavel.trim(),

        telefone:
          formData.telefone.trim(),

        responsavelCpf:
          formData.responsavelCpf.replace(/\D/g, "") ||
          undefined,

        responsavelGrauParentesco:
          formData.responsavelGrauParentesco.trim() ||
          undefined,

        responsavelEmail:
          formData.responsavelEmail.trim() ||
          undefined,

        responsavelEndereco:
          formData.responsavelEndereco.trim() ||
          undefined,

        tipoSanguineo:
          formData.tipoSanguineo || undefined,

        planoSaude:
          formData.planoSaude.trim() || undefined,

        contatoEmergencia:
          formData.contatoEmergencia.trim() ||
          undefined,

        grauDependencia:
          formData.grauDependencia || undefined,

        historicoMedico:
          formData.historicoMedico.trim() ||
          undefined,

        alergias:
          formData.alergias.trim() || undefined,

        diagnosticos:
          formData.diagnosticos.trim() ||
          undefined,

        restricaoAlimentar:
          formData.restricaoAlimentar.trim() ||
          undefined,

        observacoes:
          formData.observacoes.trim() ||
          undefined,

        dataInternacao:
          formData.dataInternacao || undefined,

        /*
         * Novo residente começa como não falecido.
         */
        falecido: false,
      };

      await createPatient(payload);

      alert("Residente cadastrado com sucesso!");

      setFormData(INITIAL_FORM_STATE);

      onSuccess();
      onClose();
    } catch (error) {
      console.error(
        "Erro ao cadastrar residente:",
        error
      );

      if (error instanceof AxiosError) {
        alert(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Erro ao cadastrar residente."
        );
      } else {
        alert("Erro inesperado no sistema.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
        {/* =====================================================
            CABEÇALHO
        ====================================================== */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200/60 bg-emerald-50 text-emerald-600">
              <UserPlus className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Cadastrar Novo Residente
              </h2>

              <p className="text-xs font-medium text-slate-500">
                Preencha os dados pessoais, familiares e
                clínicos do residente.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* =====================================================
            FORMULÁRIO
        ====================================================== */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-6 overflow-y-auto p-6 text-xs text-slate-700">
            {/* =================================================
                1. DADOS PESSOAIS
            ================================================== */}
            <section className="space-y-3.5">
              <h3 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <User className="h-4 w-4" />
                1. Dados Pessoais
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Nome */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700">
                    Nome Completo{" "}
                    <span className="text-rose-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome completo do residente"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Data nascimento */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Data de Nascimento{" "}
                    <span className="text-rose-500">*</span>
                  </label>

                  <input
                    type="date"
                    name="dataNascimento"
                    required
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Gênero */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Gênero{" "}
                    <span className="text-rose-500">*</span>
                  </label>

                  <select
                    name="genero"
                    required
                    value={formData.genero}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">
                      Selecione
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

                {/* CPF */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    CPF
                  </label>

                  <input
                    type="text"
                    name="cpf"
                    maxLength={14}
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* RG */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    RG
                  </label>

                  <input
                    type="text"
                    name="rg"
                    value={formData.rg}
                    onChange={handleChange}
                    placeholder="Número do RG"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Naturalidade */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Naturalidade
                  </label>

                  <input
                    type="text"
                    name="naturalidade"
                    value={formData.naturalidade}
                    onChange={handleChange}
                    placeholder="Cidade / Estado de nascimento"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Estado civil */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Estado Civil
                  </label>

                  <select
                    name="estadoCivil"
                    value={formData.estadoCivil}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                  <label className="block font-semibold text-slate-700">
                    Cartão SUS
                  </label>

                  <input
                    type="text"
                    name="cartaoSus"
                    value={formData.cartaoSus}
                    onChange={handleChange}
                    placeholder="Número do Cartão SUS"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Quarto */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Quarto / Leito
                  </label>

                  <input
                    type="text"
                    name="quartoLeito"
                    value={formData.quartoLeito}
                    onChange={handleChange}
                    placeholder="Ex.: Quarto 102 - Leito B"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                2. RESPONSÁVEL
            ================================================== */}
            <section className="space-y-3.5">
              <h3 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                2. Responsável Legal / Familiar
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Responsável */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Nome do Responsável{" "}
                    <span className="text-rose-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="responsavel"
                    required
                    value={formData.responsavel}
                    onChange={handleChange}
                    placeholder="Nome completo"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Telefone Principal{" "}
                    <span className="text-rose-500">*</span>
                  </label>

                  <input
                    type="tel"
                    name="telefone"
                    required
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* CPF responsável */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    CPF do Responsável
                  </label>

                  <input
                    type="text"
                    name="responsavelCpf"
                    maxLength={14}
                    value={formData.responsavelCpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Parentesco */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Grau de Parentesco
                  </label>

                  <input
                    type="text"
                    name="responsavelGrauParentesco"
                    value={formData.responsavelGrauParentesco}
                    onChange={handleChange}
                    placeholder="Ex.: Filho(a), Tutor Legal"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    E-mail do Responsável
                  </label>

                  <input
                    type="email"
                    name="responsavelEmail"
                    value={formData.responsavelEmail}
                    onChange={handleChange}
                    placeholder="nome@email.com"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Endereço */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Endereço do Responsável
                  </label>

                  <input
                    type="text"
                    name="responsavelEndereco"
                    value={formData.responsavelEndereco}
                    onChange={handleChange}
                    placeholder="Endereço completo"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                3. SAÚDE
            ================================================== */}
            <section className="space-y-3.5">
              <h3 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <HeartPulse className="h-4 w-4" />
                3. Saúde e Internação
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Grau dependência */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Grau de Dependência
                  </label>

                  <select
                    name="grauDependencia"
                    value={formData.grauDependencia}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">
                      Não informado
                    </option>

                    <option value={DependencyLevel.INDEPENDENTE}>
                      Independente
                    </option>

                    <option value={DependencyLevel.PARCIAL}>
                      Dependência Parcial
                    </option>

                    <option value={DependencyLevel.TOTAL}>
                      Dependência Total
                    </option>
                  </select>
                </div>

                {/* Tipo sanguíneo */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Tipo Sanguíneo
                  </label>

                  <select
                    name="tipoSanguineo"
                    value={formData.tipoSanguineo}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                  <label className="block font-semibold text-slate-700">
                    Plano de Saúde
                  </label>

                  <input
                    type="text"
                    name="planoSaude"
                    value={formData.planoSaude}
                    onChange={handleChange}
                    placeholder="Ex.: Unimed - nº 12345"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Data internação */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Data de Internação
                  </label>

                  <input
                    type="date"
                    name="dataInternacao"
                    value={formData.dataInternacao}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Contato emergência */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700">
                    Contato de Emergência
                  </label>

                  <input
                    type="tel"
                    name="contatoEmergencia"
                    value={formData.contatoEmergencia}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Histórico médico */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Histórico Médico
                  </label>

                  <textarea
                    name="historicoMedico"
                    rows={3}
                    value={formData.historicoMedico}
                    onChange={handleChange}
                    placeholder="Condições clínicas, cirurgias, internações anteriores..."
                    className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Diagnósticos */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Diagnósticos
                  </label>

                  <textarea
                    name="diagnosticos"
                    rows={3}
                    value={formData.diagnosticos}
                    onChange={handleChange}
                    placeholder="Diagnósticos relevantes..."
                    className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                4. NUTRIÇÃO E ALERGIAS
            ================================================== */}
            <section className="space-y-3.5">
              <h3 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <Utensils className="h-4 w-4" />
                4. Nutrição e Alergias
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Alergias */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Alergias Conhecidas
                  </label>

                  <input
                    type="text"
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleChange}
                    placeholder="Ex.: Lactose, Dipirona, Frutos do mar"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Restrição alimentar */}
                <div>
                  <label className="block font-semibold text-slate-700">
                    Restrição / Dieta Alimentar
                  </label>

                  <input
                    type="text"
                    name="restricaoAlimentar"
                    value={formData.restricaoAlimentar}
                    onChange={handleChange}
                    placeholder="Ex.: Hipossódica, Dieta Pastosa"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Observações */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700">
                    Observações Gerais
                  </label>

                  <textarea
                    name="observacoes"
                    rows={3}
                    value={formData.observacoes}
                    onChange={handleChange}
                    placeholder="Informações adicionais relevantes para a rotina de cuidados..."
                    className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                5. DOCUMENTAÇÃO / INFORMAÇÕES COMPLEMENTARES
            ================================================== */}
            <section className="space-y-3.5">
              <h3 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <FileText className="h-4 w-4" />
                5. Informações Complementares
              </h3>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="text-xs leading-relaxed text-slate-600">
                  Após o cadastro, documentos como receitas,
                  exames, contratos, documentos de identificação
                  e outros arquivos poderão ser adicionados ao
                  prontuário do residente.
                </p>
              </div>
            </section>
          </div>

          {/* ===================================================
              RODAPÉ
          ==================================================== */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 p-4">
            <button
              type="button"
              onClick={handleResetAndClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Salvar Residente</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}