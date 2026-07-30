import { api } from "./api";
import type { VitalSignsOverviewItem } from "../types/vitalSigns";

interface Filters {
  search?: string;
  status?: string;
}

export async function getVitalSigns(filters?: Filters) {
  const { data } = await api.get<VitalSignsOverviewItem[]>("/vital-signs", {
    params: filters,
  });

  return data;
}