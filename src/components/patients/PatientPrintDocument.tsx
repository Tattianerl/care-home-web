import React from "react";
import type { PatientDetails } from "../../types/patientDetails";

interface Props {
  patient: PatientDetails;
}

export const PatientPrintDocument = React.forwardRef<HTMLDivElement, Props>(
  ({ patient }, ref) => {
    const dataNascimentoFormatted = patient.dataNascimento
      ? new Date(patient.dataNascimento).toLocaleDateString("pt-BR")
      : "Não informada";

    const sexo = patient.genero ?? "Não informado";
    const quarto = patient.quartoLeito ?? "Não alocado";
    const cartaoSus = patient.cartaoSus ?? "Não informado";

    const responsavelCpf = patient.responsavelCpf ?? "Não informado";
    const parentesco = patient.responsavelGrauParentesco ?? "Não informado";
    const emailResp = patient.responsavelEmail ?? "Não informado";

    const tipoSangue = patient.tipoSanguineo ?? "Não informado";
    const plano = patient.planoSaude ?? "Não informado";
    const emergencia = patient.contatoEmergencia ?? "Não informado";

    const grau = patient.grauDependencia ?? "Grau I";
    const restricao = patient.restricaoAlimentar ?? "Nenhuma";

    const dataEmissao = new Date().toLocaleDateString("pt-BR");
    const horaEmissao = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div
        ref={ref}
        className="w-[210mm] min-h-[297mm] p-8 mx-auto bg-white text-slate-800 text-xs font-sans print:p-6 print:m-0 print:w-full print:min-h-0 flex flex-col justify-between box-border"
      >
        {/* Estilos específicos de impressão para A4 */}
        <style font-sans>{`
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          @media print {
            body {
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}</style>

        {/* Conteúdo Principal */}
        <div>
          {/* Cabeçalho da Ficha */}
          <header className="text-center border-b border-slate-300 pb-3 mb-4">
            <h1 className="text-lg font-bold uppercase text-slate-900 tracking-wide">
              Care Home — Ficha do Residente
            </h1>
            <p className="text-[10px] text-slate-500 mt-1">
              Documento emitido em {dataEmissao} às {horaEmissao}
            </p>
          </header>

          <main className="space-y-3">
            {/* 1. Identificação e Acomodação */}
            <section className="border border-slate-200 rounded-md p-3 bg-white">
              <h2 className="text-[11px] font-bold text-emerald-700 uppercase border-b border-slate-100 pb-1 mb-2 tracking-wide">
                1. Identificação e Acomodação
              </h2>
              <div className="grid grid-cols-3 gap-y-3 gap-x-2">
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Nome Completo
                  </span>
                  <span className="block text-xs font-bold text-slate-900">
                    {patient.nome}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Data de Nascimento
                  </span>
                  <span className="block text-xs text-slate-800">
                    {dataNascimentoFormatted}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Gênero / Sexo
                  </span>
                  <span className="block text-xs text-slate-800">{sexo}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    CPF
                  </span>
                  <span className="block text-xs text-slate-800">
                    {patient.cpf || "Não informado"}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    RG
                  </span>
                  <span className="block text-xs text-slate-800">
                    {patient.rg || "Não informado"}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Quarto / Leito
                  </span>
                  <span className="block text-xs font-bold text-slate-900">
                    {quarto}
                  </span>
                </div>
              </div>
            </section>

            {/* 2. Responsável Legal / Familiar */}
            <section className="border border-slate-200 rounded-md p-3 bg-white">
              <h2 className="text-[11px] font-bold text-emerald-700 uppercase border-b border-slate-100 pb-1 mb-2 tracking-wide">
                2. Responsável Legal / Familiar
              </h2>
              <div className="grid grid-cols-6 gap-y-3 gap-x-2">
                <div className="col-span-2">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Nome do Responsável
                  </span>
                  <span className="block text-xs font-bold text-slate-900">
                    {patient.responsavel || "Não informado"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Telefone Principal
                  </span>
                  <span className="block text-xs text-slate-800">
                    {patient.telefone || "Não informado"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Grau de Parentesco
                  </span>
                  <span className="block text-xs text-slate-800">
                    {parentesco}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    CPF do Responsável
                  </span>
                  <span className="block text-xs text-slate-800">
                    {responsavelCpf}
                  </span>
                </div>
                <div className="col-span-4">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    E-mail do Responsável
                  </span>
                  <span className="block text-xs text-slate-800">
                    {emailResp}
                  </span>
                </div>
              </div>
            </section>

            {/* 3. Saúde e Emergência */}
            <section className="border border-slate-200 rounded-md p-3 bg-white">
              <h2 className="text-[11px] font-bold text-emerald-700 uppercase border-b border-slate-100 pb-1 mb-2 tracking-wide">
                3. Saúde e Emergência
              </h2>
              <div className="grid grid-cols-6 gap-y-3 gap-x-2">
                <div className="col-span-2">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Grau de Dependência (ANVISA)
                  </span>
                  <span className="block text-xs font-bold text-slate-900">
                    {grau}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Cartão do SUS
                  </span>
                  <span className="block text-xs text-slate-800">
                    {cartaoSus}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Plano de Saúde
                  </span>
                  <span className="block text-xs text-slate-800">
                    {plano}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Tipo Sanguíneo
                  </span>
                  <span className="block text-xs font-bold text-rose-600">
                    {tipoSangue}
                  </span>
                </div>
                <div className="col-span-4">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Contato Secundário / Emergência
                  </span>
                  <span className="block text-xs text-slate-800">
                    {emergencia}
                  </span>
                </div>
              </div>
            </section>

            {/* 4. Perfil Nutricional e Observações */}
            <section className="border border-slate-200 rounded-md p-3 bg-white">
              <h2 className="text-[11px] font-bold text-emerald-700 uppercase border-b border-slate-100 pb-1 mb-2 tracking-wide">
                4. Perfil Nutricional e Observações
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Alergias Conhecidas
                  </span>
                  <span className="block text-xs font-bold text-rose-600">
                    {patient.alergias || "Nenhuma alergia cadastrada."}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Restrições Alimentares / Dieta
                  </span>
                  <span className="block text-xs text-slate-800">
                    {restricao}
                  </span>
                </div>
                <div className="col-span-2 pt-1">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Observações Gerais / Rotina de Cuidados
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line mt-0.5">
                    {patient.observacoes || "Sem observações registradas."}
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* Rodapé da folha */}
        <footer className="mt-6 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-400">
          Care Home Management System — Ficha Cadastral Oficial
        </footer>
      </div>
    );
  }
);

PatientPrintDocument.displayName = "PatientPrintDocument";