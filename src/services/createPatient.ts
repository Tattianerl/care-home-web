import { api } from "./api";

export async function createPatient(
  data: {
    nome: string;
    dataNascimento: string;
    responsavel: string;
    telefone: string;
    historicoMedico: string;
    medicamentos: string;
    alergias: string;
    diagnosticos: string;
    observacoes: string;
  }
) {
  const response = await api.post(
    "/patients",
    data
  );

  return response.data;
}