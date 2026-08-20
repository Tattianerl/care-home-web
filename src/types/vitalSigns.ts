import { z } from "zod";

import type { PatientSummary, UserSummary } from "./common";

export interface VitalSign {
  id: string;

  pressaoSistolica: number;
  pressaoDiastolica: number;

  temperatura: number;

  frequenciaCardiaca: number | null;
  frequenciaRespiratoria: number | null;
  saturacao: number | null;
  glicemia: number | null;

  peso: number | null;
  altura: number | null;
  imc: number | null;

  dor: number | null;
  observacoes: string | null;

  createdAt: string;

  patientId: string;
  userId: string;

  patient?: PatientSummary;
  user?: UserSummary;
}

export type HealthStatus =
  | "normal"
  | "alerta"
  | "critico";

export const createVitalSignSchema = z.object({
  pressaoSistolica: z.coerce
    .number()
    .min(40, "Pressão sistólica inválida")
    .max(300, "Pressão sistólica inválida"),

  pressaoDiastolica: z.coerce
    .number()
    .min(20, "Pressão diastólica inválida")
    .max(200, "Pressão diastólica inválida"),

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

  frequenciaRespiratoria: z.coerce
    .number()
    .min(5, "Frequência respiratória inválida")
    .max(60, "Frequência respiratória inválida")
    .optional()
    .nullable(),

  saturacao: z.coerce
    .number()
    .min(50, "Mínimo 50%")
    .max(100, "Máximo 100%")
    .optional()
    .nullable(),

  glicemia: z.coerce
    .number()
    .positive()
    .optional()
    .nullable(),

  peso: z.coerce
    .number()
    .positive()
    .optional()
    .nullable(),

  altura: z.coerce
    .number()
    .positive()
    .optional()
    .nullable(),

  dor: z.coerce
    .number()
    .min(0)
    .max(10)
    .optional()
    .nullable(),

  observacoes: z.string()
    .max(500)
    .optional()
    .nullable(),
});

export type CreateVitalSignInput =
  z.infer<typeof createVitalSignSchema>;

export function evaluateVitalStatus(
  vital: Partial<VitalSign>
): HealthStatus {
  const {
    frequenciaCardiaca,
    saturacao,
    temperatura,
    pressaoSistolica,
    pressaoDiastolica,
  } = vital;

  /*
   * CRÍTICO
   */
  if (
    (saturacao != null && saturacao < 90) ||
    (frequenciaCardiaca != null &&
      (frequenciaCardiaca < 50 ||
        frequenciaCardiaca > 120)) ||
    (temperatura != null &&
      (temperatura >= 39 || temperatura < 35)) ||
    (pressaoSistolica != null &&
      pressaoSistolica >= 180) ||
    (pressaoDiastolica != null &&
      pressaoDiastolica >= 120)
  ) {
    return "critico";
  }

  /*
   * ALERTA
   */
  if (
    (saturacao != null && saturacao < 95) ||
    (frequenciaCardiaca != null &&
      (frequenciaCardiaca < 60 ||
        frequenciaCardiaca > 100)) ||
    (temperatura != null &&
      temperatura >= 37.8) ||
    (pressaoSistolica != null &&
      pressaoSistolica >= 140) ||
    (pressaoDiastolica != null &&
      pressaoDiastolica >= 90)
  ) {
    return "alerta";
  }

  return "normal";
}

export interface VitalSignsOverviewItem {
  id: string;

  patientId: string;
  patientName: string;

  pressaoSistolica: number;
  pressaoDiastolica: number;
  pressao: string;

  temperatura: number;
  glicemia: number | null;
  frequenciaCardiaca: number | null;
  frequenciaRespiratoria: number | null;
  saturacao: number | null;

  peso: number | null;
  altura: number | null;
  imc: number | null;

  dor: number | null;
  observacoes: string | null;

  createdAt: string;

  status: HealthStatus;

  user: UserSummary;
}