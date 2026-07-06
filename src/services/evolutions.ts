import { api } from "./api";

export async function getPatientEvolutions(
  patientId: string
) {
  const response = await api.get(
    `/patients/${patientId}/evolutions`
  );

  return response.data;
}

export async function createEvolution(data: {
  descricao: string;
  assinatura: string;
  patientId: string;
}) {
  const response = await api.post(
    "/evolutions",
    data
  );

  return response.data;
}

export async function updateEvolution(
  id: string,
  data: {
    descricao: string;
    assinatura: string;
  }
) {
  
  const response = await api.put(`/evolutions/${id}`, data);
  
  return response.data;
}

export async function deleteEvolution(id: string) {
  const response = await api.delete(
    `/evolutions/${id}`
  );

  return response.data;
}