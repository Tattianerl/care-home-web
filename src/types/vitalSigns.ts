import { z } from "zod";

export interface UserSummary {
  nome: string;
  cargo: string;
}

export interface VitalSign {
  id: string;
  pressao: string;
  temperatura: number;
  glicemia: number | null;
  frequenciaCardiaca: number | null;
  saturacao: number | null;
  observacoes: string | null;
  createdAt: string;
  patientId: string;
  userId: string;
  user: UserSummary;
}

export type HealthStatus =
  | "normal"
  | "alerta"
  | "critico";

// Schema Zod para validação do formulário no Frontend
export const createVitalSignSchema = z.object({
  pressao: z
    .string()
    .regex(/^\d{2,3}\/\d{2,3}$/, "Formato inválido. Use Ex: 120/80"),
  temperatura: z.coerce
    .number()
    .min(30, "Mínimo 30°C")
    .max(45, "Máximo 45°C"),
  frequenciaCardiaca: z.coerce
    .number()
    .min(30, "Mínimo 30 bpm")
    .max(250, "Máximo 250 bpm")
    .optional()
    .nullable(),
  saturacao: z.coerce
    .number()
    .min(50, "Mínimo 50%")
    .max(100, "Máximo 100%")
    .optional()
    .nullable(),
  glicemia: z.coerce.number().positive().optional().nullable(),
  observacoes: z.string().max(500, "Máximo de 500 caracteres").optional(),
});

export type CreateVitalSignInput = z.infer<typeof createVitalSignSchema>;
export function evaluateVitalStatus(
  vital: Partial<VitalSign>
): HealthStatus {

  if (!vital) return "normal";

  const { frequenciaCardiaca, saturacao, temperatura } = vital;

  // Critérios Críticos
  if (
    (saturacao && saturacao < 92) ||
    (frequenciaCardiaca && (frequenciaCardiaca < 50 || frequenciaCardiaca > 120)) ||
    (temperatura && (temperatura < 35 || temperatura > 38.5))
  ) {
    return "critico";
  }

  // Critérios de Atenção
  if (
    (saturacao && saturacao <= 95) ||
    (frequenciaCardiaca && (frequenciaCardiaca < 60 || frequenciaCardiaca > 100)) ||
    (temperatura && (temperatura >= 37.5 || temperatura <= 35.5))
  ) {
    return "alerta";
  }

  return "normal";
}

export interface VitalSignsOverviewItem {
  id: string;

  patientId: string;
  patientName: string;

  pressao: string;
  temperatura: number;
  glicemia: number | null;
  frequenciaCardiaca: number | null;
  saturacao: number | null;

  createdAt: string;

  status: "normal" | "alerta" | "critico";

  user: UserSummary;
}