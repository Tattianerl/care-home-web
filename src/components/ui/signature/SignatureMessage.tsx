import {
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface SignatureMessageProps {
  message: {
    type: "success" | "error";
    text: string;
  } | null;
}

export function SignatureMessage({
  message,
}: SignatureMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-4 text-xs font-semibold ${
        message.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-rose-200 bg-rose-50 text-rose-800"
      }`}
    >
      {message.type === "success" ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
      )}

      <span>{message.text}</span>
    </div>
  );
}