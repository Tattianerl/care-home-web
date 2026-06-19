import { api } from "./api";

export async function updatePatient(
  id: string,
  data: unknown
) {
  const response = await api.put(
    `/patients/${id}`,
    data
  );

  return response.data;
}