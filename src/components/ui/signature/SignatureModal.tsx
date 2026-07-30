import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { X } from "lucide-react";
import { SignatureCanvasTab } from "./SignatureCanvasTab"; // ou o caminho correto do seu SignatureCanvasTab

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void | Promise<void>;
}

export function SignatureModal({ isOpen, onClose, onSave }: SignatureModalProps) {
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleClear = () => {
    sigCanvasRef.current?.clear();
  };

  const handleSave = async () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      alert("Por favor, desenhe uma assinatura antes de salvar.");
      return;
    }

    try {
      setLoading(true);
      // Pega a imagem da assinatura em formato PNG DataURL
      const dataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
      await onSave(dataUrl);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar assinatura:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Assinatura Profissional
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Reutiliza o seu componente SignatureCanvasTab aqui */}
        <SignatureCanvasTab
          sigCanvasRef={sigCanvasRef}
          loading={loading}
          onClear={handleClear}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}