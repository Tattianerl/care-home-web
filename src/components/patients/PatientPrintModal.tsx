import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { X, Printer } from "lucide-react";

import { Button } from "../ui/Button";
import { PatientPrintDocument } from "./PatientPrintDocument";

import type { PatientDetails } from "../../types/patientDetails";

interface PatientPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientDetails;
}

export function PatientPrintModal({
  isOpen,
  onClose,
  patient,
}: PatientPrintModalProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `ficha-${patient.nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase()}`,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="flex h-[95vh] w-[95vw] max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Ficha Cadastral do Residente
            </h2>
            <p className="text-xs text-slate-500">{patient.nome}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePrint()}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Printer className="h-4 w-4" />
              Imprimir / Salvar PDF
            </Button>

            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Visualizador da Folha A4 com Scroll */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-8 flex justify-center">
          <div className="shadow-lg bg-white rounded-sm">
            <PatientPrintDocument ref={componentRef} patient={patient} />
          </div>
        </div>
      </div>
    </div>
  );
}