import { api } from "./api";

export async function getPatient(
  id: string
) {
  const response =
    await api.get(`/patients/${id}`);

  return response.data;
}