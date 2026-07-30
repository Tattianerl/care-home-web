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

import { getPatient } from "../../services/patient";
import { updatePatient } from "../../services/patients";
import { Button } from "../../components/ui/Button";

export function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Identificação e Acomodação
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [cartaoSus, setCartaoSus] = useState("");
  const [quartoLeito, setQuartoLeito] = useState("");
  const [genero, setGenero] = useState("");

  // 2. Responsável Legal / Familiar
  const [responsavel, setResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");
  const [responsavelCpf, setResponsavelCpf] = useState("");
  const [responsavelGrauParentesco, setResponsavelGrauParentesco] = useState("");
  const [responsavelEmail, setResponsavelEmail] = useState("");

  // 3. Saúde e Emergência
  const [tipoSanguineo, setTipoSanguineo] = useState("");
  const [planoSaude, setPlanoSaude] = useState("");
  const [contatoEmergencia, setContatoEmergencia] = useState("");
  const [grauDependencia, setGrauDependencia] = useState("Grau I");

  // 4. Perfil Nutricional e Alergias
  const [alergias, setAlergias] = useState("");
  const [restricaoAlimentar, setRestricaoAlimentar] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    async function loadPatient() {
      if (!id) return;

      try {
        setLoading(true);
        const patient = await getPatient(id);

        // Preenchendo todos os campos a partir do objeto retornado
        setNome(patient.nome || "");
        setDataNascimento(
          patient.dataNascimento ? patient.dataNascimento.split("T")[0] : ""
        );
        setCpf(patient.cpf || "");
        setRg(patient.rg || "");
        setCartaoSus(patient.cartaoSus || "");
        setQuartoLeito(patient.quartoLeito || "");
        setGenero(patient.genero || "");

        setResponsavel(patient.responsavel || "");
        setTelefone(patient.telefone || "");
        setResponsavelCpf(patient.responsavelCpf || "");
        setResponsavelGrauParentesco(patient.responsavelGrauParentesco || "");
        setResponsavelEmail(patient.responsavelEmail || "");

        setTipoSanguineo(patient.tipoSanguineo || "");
        setPlanoSaude(patient.planoSaude || "");
        setContatoEmergencia(patient.contatoEmergencia || "");
        setGrauDependencia(patient.grauDependencia || "Grau I");

        setAlergias(patient.alergias || "");
        setRestricaoAlimentar(patient.restricaoAlimentar || "");
        setObservacoes(patient.observacoes || "");
      } catch (error) {
        console.error("Erro ao carregar paciente:", error);
        setErrorMessage("Não foi possível carregar os dados do residente.");
      } finally {
        setLoading(false);
      }
    }

    loadPatient();
  }, [id]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!id) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!nome || !dataNascimento || !responsavel || !telefone) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    try {
      setSaving(true);

      await updatePatient(id, {
        nome,
        dataNascimento,
        cpf: cpf.replace(/\D/g, "") || undefined,
        rg: rg || undefined,
        cartaoSus: cartaoSus || undefined,
        quartoLeito: quartoLeito || undefined,
        genero: genero || undefined,

        responsavel,
        telefone,
        responsavelCpf: responsavelCpf.replace(/\D/g, "") || undefined,
        responsavelGrauParentesco: responsavelGrauParentesco || undefined,
        responsavelEmail: responsavelEmail || undefined,

        tipoSanguineo: tipoSanguineo || undefined,
        planoSaude: planoSaude || undefined,
        contatoEmergencia: contatoEmergencia || undefined,
        grauDependencia,

        alergias: alergias || undefined,
        restricaoAlimentar: restricaoAlimentar || undefined,
        observacoes: observacoes || undefined,
      });

      setSuccessMessage("Prontuário do residente atualizado com sucesso!");

      setTimeout(() => {
        navigate(`/patients/${id}`);
      }, 1200);
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      if (error instanceof AxiosError) {
        setErrorMessage(
          error.response?.data?.error || "Erro ao salvar as alterações."
        );
      } else {
        setErrorMessage("Erro ao salvar as alterações. Tente novamente.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Carregando dados do residente...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/patients/${id}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Editar Prontuário
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Atualize as informações cadastrais e médicas do residente.
            </p>
          </div>
        </div>
      </div>

      {/* FEEDBACKS */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs font-medium text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* FORMULÁRIO */}
      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-700">
        {/* SEÇÃO 1: Identificação e Acomodação */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <User className="h-4 w-4" />
            1. Identificação e Acomodação
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700">
                Nome Completo <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                Data de Nascimento <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">CPF</label>
              <input
                type="text"
                maxLength={11}
                placeholder="Apenas números"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">RG</label>
              <input
                type="text"
                placeholder="Número do RG"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                value={rg}
                onChange={(e) => setRg(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                Quarto / Leito
              </label>
              <input
                type="text"
                placeholder="Ex: Quarto 102 - Leito B"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                value={quartoLeito}
                onChange={(e) => setQuartoLeito(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                Gênero
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: Responsável Legal / Familiar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            2. Responsável Legal / Familiar
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700">
                Nome do Responsável <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                Telefone Principal <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="(00) 00000-0000"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                CPF do Responsável
              </label>
              <input
                type="text"
                maxLength={11}
                placeholder="Apenas números"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                value={responsavelCpf}
                onChange={(e) => setResponsavelCpf(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                Grau de Parentesco
              </label>
              <input
                type="text"
                placeholder="Ex: Filho(a), Tutor Legal"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                value={responsavelGrauParentesco}
                onChange={(e) => setResponsavelGrauParentesco(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700">
                E-mail do Responsável
              </label>
              <input
                type="email"
                placeholder="nome@email.com"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                value={responsavelEmail}
                onChange={(e) => setResponsavelEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: Saúde e Emergência */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <HeartPulse className="h-4 w-4" />
            3. Saúde e Emergência
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700">
                Grau de Dependência (ANVISA)
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                value={grauDependencia}
                onChange={(e) => setGrauDependencia(e.target.value)}
              >
                <option value="Grau I">Grau I (Independente)</option>
                <option value="Grau II">Grau II (Dependência Parcial)</option>
                <option value="Grau III">
                  Grau III (Dependência Total / Acamado)
                </option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                Cartão do SUS
              </label>
              <input
                type="text"
                placeholder="Número do Cartão SUS"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                value={cartaoSus}
                onChange={(e) => setCartaoSus(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                Plano de Saúde
              </label>
              <input
                type="text"
                placeholder="Ex: Unimed - nº 12345"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                value={planoSaude}
                onChange={(e) => setPlanoSaude(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                Tipo Sanguíneo
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                value={tipoSanguineo}
                onChange={(e) => setTipoSanguineo(e.target.value)}
              >
                <option value="">Não informado</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700">
                Telefone Secundário / Emergência
              </label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                value={contatoEmergencia}
                onChange={(e) => setContatoEmergencia(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 4: Nutrição e Restrições */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <Utensils className="h-4 w-4" />
            4. Perfil Nutricional e Alergias
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700">
                Alergias Conhecidas
              </label>
              <input
                type="text"
                placeholder="Ex: Lactose, Dipirona, Frutos do mar"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                value={alergias}
                onChange={(e) => setAlergias(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">
                Restrição / Dieta Alimentar
              </label>
              <input
                type="text"
                placeholder="Ex: Diabético, Hipossódico, Dieta Pastosa"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                value={restricaoAlimentar}
                onChange={(e) => setRestricaoAlimentar(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700">
                Observações Gerais
              </label>
              <textarea
                rows={3}
                placeholder="Informações adicionais relevantes para a rotina de cuidados..."
                className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* BARRAS DE AÇÃO */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>

          <Button type="submit" variant="success" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Salvar Alterações</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}