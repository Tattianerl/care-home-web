import { useEffect, useMemo, useRef } from "react";
import {
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

interface SignatureUploadTabProps {
  file: File | null;
  loading: boolean;
  setFile(file: File | null): void;
  onSubmit(e: React.FormEvent): void;
}

export function SignatureUploadTab({
  file,
  loading,
  setFile,
  onSubmit,
}: SignatureUploadTabProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleRemoveFile() {
    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5"
    >
      <p className="text-xs text-slate-500">
        Envie uma imagem da sua assinatura
        (PNG ou JPG).
      </p>

      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-colors hover:bg-slate-50">

        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <ImageIcon className="h-6 w-6" />
        </div>

        <label
          htmlFor="signature-upload"
          className="cursor-pointer"
        >
          <span className="text-xs font-bold text-emerald-600 hover:underline">
            Selecionar imagem da assinatura
          </span>

          <input
            ref={inputRef}
            id="signature-upload"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="sr-only"
            onChange={(e) => {
              const selected =
                e.target.files?.[0];

              if (!selected) return;

              if (
                !selected.type.startsWith(
                  "image/"
                )
              ) {
                return;
              }

              setFile(selected);
            }}
          />
        </label>

        <p className="mt-1 text-[10px] text-slate-400">
          PNG ou JPG • até 5 MB
        </p>

        {file && (
          <div className="mt-5 flex w-full max-w-sm flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">

            {preview && (
              <img
                src={preview}
                alt="Pré-visualização da assinatura"
                className="h-24 w-full rounded-lg border border-slate-200 object-contain"
              />
            )}

            <div className="text-center">
              <p className="text-xs font-semibold text-slate-700">
                {file.name}
              </p>

              <p className="text-[10px] text-slate-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              className="inline-flex items-center gap-1 rounded-lg text-xs font-medium text-rose-600 transition-colors hover:text-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              Remover arquivo
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !file}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}

          Enviar Assinatura
        </button>
      </div>
    </form>
  );
}