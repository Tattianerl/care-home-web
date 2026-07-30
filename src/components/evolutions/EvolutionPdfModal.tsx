import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, X, FileSignature } from "lucide-react";
import { useAuth } from "../../context/useAuth";

interface Evolution {
  id: string;
  descricao: string;
  createdAt: string;
  user?: {
    nome: string;
    cargo: string;
  };
}

interface EvolutionPdfModalProps {
  patientName: string;
  patientCpf?: string;
  evolutions: Evolution[];
  isOpen: boolean;
  onClose: () => void;
}

export function EvolutionPdfModal({
  patientName,
  patientCpf,
  evolutions,
  isOpen,
  onClose,
}: EvolutionPdfModalProps) {
  const { user } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Evolucoes_${patientName.replace(/\s+/g, "_")}`,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <FileSignature className="h-5 w-5" />
            <span>Pré-visualização do Documento Oficial (PDF)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePrint()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Área Visual do Relatório (Com barra de rolagem no Modal) */}
        <div className="overflow-y-auto p-6 bg-slate-100">
          <div
            ref={printRef}
            className="mx-auto max-w-[210mm] bg-white p-10 shadow-md text-slate-800 space-y-6 min-h-[297mm] flex flex-col justify-between print:p-8 print:shadow-none print:w-full"
          >
            <div>
              {/* Cabeçalho do Documento */}
              <header className="border-b-2 border-emerald-600 pb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold text-emerald-800 tracking-tight">CAREHOME</h1>
                  <p className="text-xs font-semibold text-slate-600">Relatório de Evoluções Clínicas e Anotações</p>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <p><strong>Emissão:</strong> {new Date().toLocaleDateString("pt-BR")}</p>
                </div>
              </header>

              {/* Informações do Residente/Paciente */}
              <section className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs grid grid-cols-2 gap-2">
                <p><strong>Residente:</strong> {patientName}</p>
                {patientCpf && <p><strong>CPF:</strong> {patientCpf}</p>}
              </section>

              {/* Lista de Evoluções */}
              <section className="mt-6 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
                  Anotações de Enfermagem / Evoluções
                </h2>

                {evolutions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Nenhuma evolução registrada no período.</p>
                ) : (
                  evolutions.map((item) => (
                    <div key={item.id} className="border-l-2 border-emerald-500 pl-4 py-1 text-xs space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                        <span>{new Date(item.createdAt).toLocaleString("pt-BR")}</span>
                        {item.user && <span>Profissional: {item.user.nome}</span>}
                      </div>
                      <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{item.descricao}</p>
                    </div>
                  ))
                )}
              </section>
            </div>

            {/* RODAPÉ COM A ASSINATURA DIGITAL STAMPADA */}
            <footer className="pt-8 border-t border-slate-200 text-center space-y-2 print:break-inside-avoid">
              <div className="flex flex-col items-center justify-center">
                {user?.assinatura ? (
                  <img
                    src={user.assinatura}
                    alt="Assinatura Digital"
                    className="h-16 max-w-[220px] object-contain mb-1"
                  />
                ) : (
                  <div className="h-16 flex items-center justify-center text-xs text-rose-500 italic">
                    [Sem Assinatura Cadastrada]
                  </div>
                )}
                <div className="w-56 border-t border-slate-400"></div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900">{user?.nome}</p>
                <p className="text-[10px] font-medium text-slate-500">
                  Cargo: {user?.cargo?.toUpperCase()}
                </p>
                <p className="text-[9px] text-emerald-700 flex items-center justify-center gap-1 mt-1 font-semibold">
                  <FileSignature className="h-3 w-3 inline" /> Documento assinado digitalmente via CareHome
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}