import type { RefObject } from "react";
import { Eraser, Loader2, PenLine } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

interface SignatureCanvasTabProps {
  sigCanvasRef: RefObject<SignatureCanvas | null>;
  loading: boolean;
  onClear: () => void;
  onSave: () => void | Promise<void>;
}

export function SignatureCanvasTab({
  sigCanvasRef,
  loading,
  onClear,
  onSave,
}: SignatureCanvasTabProps) {
  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-500">
        Desenhe sua assinatura no campo abaixo.
      </p>

      <div className="overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
        <SignatureCanvas
          ref={sigCanvasRef}
          penColor="#334155"
          canvasProps={{
            className: "h-48 w-full bg-white cursor-crosshair",
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onClear}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Eraser className="h-4 w-4" />
          Limpar
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PenLine className="h-4 w-4" />
          )}

          Salvar Assinatura
        </button>
      </div>
    </div>
  );
}