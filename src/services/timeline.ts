import type { TimelineItem } from "../types/timeline";
import { api } from "./api";


export async function getTimeline(patientId: string) {
  const response = await api.get<TimelineItem[]>(
    `/patients/${patientId}/timeline`
  );

  return response.data;
}