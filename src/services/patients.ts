import { api } from "./api";

// 1. Tipagem para criação e edição de Pacientes
export interface PatientData {
  id?: string;
  nome: string;
  dataNascimento: string;
  
  // 🪪 Documentação e Acomodação
  cpf?: string;
  rg?: string;
  cartaoSus?: string;
  fotoUrl?: string;
  quartoLeito?: string;
  genero?: string;

  // 👨‍👩‍👧 Responsável Legal
  responsavel: string;
  telefone: string;
  responsavelCpf?: string;
  responsavelGrauParentesco?: string;
  responsavelEmail?: string;
  responsavelEndereco?: string;

  // 🏥 Saúde e Emergência
  tipoSanguineo?: string;
  planoSaude?: string;
  contatoEmergencia?: string;
  grauDependencia?: string;

  // 🩺 Histórico Clínico e Nutricional
  historicoMedico?: string;
  medicamentos?: string;
  alergias?: string;
  diagnosticos?: string;
  restricaoAlimentar?: string;
  observacoes?: string;
}

// 2. Função para Buscar Pacientes
export async function getPatients() {
  const response = await api.get("/patients");
  return response.data;
}

// 3. Função para Criar Paciente
export async function createPatient(data: PatientData) {
  const response = await api.post("/patients", data);
  return response.data;
}

// 4. Função para Atualizar Paciente (se precisar no futuro)
export async function updatePatient(id: string, data: Partial<PatientData>) {
  const response = await api.put(`/patients/${id}`, data);
  return response.data;
}