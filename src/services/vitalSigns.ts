import { api } from "./api";

import type {
  CreateVitalSignInput,
  HealthStatus,
  VitalSignsOverviewItem,
} from "../types/vitalSigns";

interface Filters {
  search?: string;
  status?: HealthStatus;
}

export async function getVitalSigns(
  filters?: Filters
): Promise<VitalSignsOverviewItem[]> {
  const { data } = await api.get<VitalSignsOverviewItem[]>(
    "/vital-signs",
    {
      params: filters,
    }
  );

  return data;
}

export async function createVitalSign(
  patientId: string,
  data: CreateVitalSignInput
): Promise<void> {
  await api.post(`/patients/${patientId}/vital-signs`, data);
}