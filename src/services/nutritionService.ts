import { api } from "./api";

import type {
  NutritionalAssessment,
  CreateNutritionalAssessmentInput,
  UpdateNutritionalAssessmentInput,
} from "../types/nutritionalAssessment";

export const nutritionService = {
  // Criar nova avaliação
  async create(
    data: CreateNutritionalAssessmentInput
  ): Promise<NutritionalAssessment> {
    const response = await api.post<NutritionalAssessment>(
      "/nutritional-assessments",
      data
    );

    return response.data;
  },

  // Listar todas as avaliações de um paciente
  async listByPatient(
    patientId: string
  ): Promise<NutritionalAssessment[]> {
    const response = await api.get<NutritionalAssessment[]>(
      `/patients/${patientId}/nutritional-assessments`
    );

    return response.data;
  },

  // Buscar a avaliação mais recente de um paciente
  async getLatestByPatient(
    patientId: string
  ): Promise<NutritionalAssessment | null> {
    const response = await api.get<NutritionalAssessment | null>(
      `/patients/${patientId}/nutritional-assessments/latest`
    );

    return response.data;
  },

  // Atualizar uma avaliação existente
  async update(
    assessmentId: string,
    data: UpdateNutritionalAssessmentInput
  ): Promise<NutritionalAssessment> {
    const response = await api.put<NutritionalAssessment>(
      `/nutritional-assessments/${assessmentId}`,
      data
    );

    return response.data;
  },

  // Excluir uma avaliação
  async delete(assessmentId: string): Promise<void> {
    await api.delete(`/nutritional-assessments/${assessmentId}`);
  },
};