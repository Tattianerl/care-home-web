import { useState } from "react";
import type { FormEvent } from "react";
import { AxiosError } from "axios";
import {
  UserPlus,
  X,
  User,
  ShieldCheck,
  HeartPulse,
  Utensils,
  Loader2,
} from "lucide-react";
import { createPatient, type PatientData } from "../../services/patients";

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RegisterPatientModal({
  isOpen,
  onClose,
  onSuccess,
}: RegisterPatientModalProps) {
  const [loading, setLoading] = useState(false);

  // Estados dos Campos
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [cartaoSus, setCartaoSus] = useState("");
  const [quartoLeito, setQuartoLeito] = useState("");
  const [genero, setGenero] = useState("");

  // Responsável
  const [responsavel, setResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");
  const [responsavelCpf, setResponsavelCpf] = useState("");
  const [responsavelGrauParentesco, setResponsavelGrauParentesco] =
    useState("");
  const [responsavelEmail, setResponsavelEmail] = useState("");

  // Saúde e Emergência
  const [tipoSanguineo, setTipoSanguineo] = useState("");
  const [planoSaude, setPlanoSaude] = useState("");
  const [contatoEmergencia, setContatoEmergencia] = useState("");
  const [grauDependencia, setGrauDependencia] = useState("Grau I");

  // Clínico e Nutrição
  const [alergias, setAlergias] = useState("");
  const [restricaoAlimentar, setRestricaoAlimentar] = useState("");
  const [observacoes, setObservacoes] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!nome || !dataNascimento || !responsavel || !telefone) {
      alert("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    try {
      setLoading(true);

      const payload: PatientData = {
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
      };

      await createPatient(payload);

      alert("Residente cadastrado com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data?.error || "Erro ao cadastrar residente.");
      } else {
        alert("Erro inesperado no sistema.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-100 bg-white shadow-xl transition-all">
        {/* Cabeçalho Fixado */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Cadastrar Novo Residente
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Preencha a ficha com os dados pessoais, contratuais e de saúde.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form com Scroll do Conteúdo */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="space-y-6 overflow-y-auto p-6 text-xs text-slate-700">
            {/* SEÇÃO 1: Identificação e Acomodação */}
            <section className="space-y-3.5">
              <h3 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <User className="h-4 w-4" />
                1. Identificação e Acomodação
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700">
                    Nome Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">RG</label>
                  <input
                    type="text"
                    placeholder="Número do RG"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                    value={quartoLeito}
                    onChange={(e) => setQuartoLeito(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">
                    Gênero
                  </label>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
            </section>

            {/* SEÇÃO 2: Responsável Legal */}
            <section className="space-y-3.5">
              <h3 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                2. Responsável Legal / Familiar
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700">
                    Nome do Responsável <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                    value={responsavelEmail}
                    onChange={(e) => setResponsavelEmail(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* SEÇÃO 3: Saúde e Emergência */}
            <section className="space-y-3.5">
              <h3 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <HeartPulse className="h-4 w-4" />
                3. Saúde e Emergência
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700">
                    Grau de Dependência (ANVISA)
                  </label>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                    value={planoSaude}
                    onChange={(e) => setPlanoSaude(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">
                    Tipo Sanguíneo
                  </label>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                    value={contatoEmergencia}
                    onChange={(e) => setContatoEmergencia(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* SEÇÃO 4: Nutrição e Restrições */}
            <section className="space-y-3.5">
              <h3 className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <Utensils className="h-4 w-4" />
                4. Perfil Nutricional e Alergias
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700">
                    Alergias Conhecidas
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Lactose, Dipirona, Frutos do mar"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                    value={restricaoAlimentar}
                    onChange={(e) => setRestricaoAlimentar(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700">
                    Observações Gerais
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Informações adicionais relevantes para a rotina de cuidados..."
                    className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Rodapé Fixado com Ações */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 p-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-800 active:scale-[0.98]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Salvar Residente</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}