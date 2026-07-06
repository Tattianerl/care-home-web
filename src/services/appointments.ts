import { api } from "./api";

export async function createAppointment(data: {
  titulo: string;
  dataHora: string;
  observacoes: string;
  patientId: string;
}) {
  const response = await api.post(
    "/appointments",
    data
  );

  return response.data;
}