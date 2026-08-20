import { api } from "./api";

import type { DocumentType } from "../types/enums";
import type { PatientDocument } from "../types/patientDocument";

/**
 * Lista todos os documentos disponíveis.
 */
export async function getAllDocuments(): Promise<PatientDocument[]> {
  const { data } = await api.get<PatientDocument[]>("/documents");

  return data;
}

/**
 * Envia um novo documento para um residente.
 */
export async function createPatientDocument(
  patientId: string,
  nome: string,
  file: File,
  tipo: DocumentType
): Promise<PatientDocument> {
  const formData = new FormData();

  formData.append("nome", nome);
  formData.append("tipo", tipo);
  formData.append("file", file);

  const { data } = await api.post<PatientDocument>(
    `/patients/${patientId}/documents`,
    formData
  );

  return data;
}

/**
 * Lista os documentos de um residente.
 */
export async function getPatientDocuments(
  patientId: string
): Promise<PatientDocument[]> {
  const { data } = await api.get<PatientDocument[]>(
    `/patients/${patientId}/documents`
  );

  return data;
}

/**
 * Faz o download de um documento.
 */
export async function downloadDocument(
  documentId: string
): Promise<void> {
  const response = await api.get<Blob>(
    `/documents/${documentId}/download`,
    {
      responseType: "blob",
    }
  );

  const disposition = response.headers["content-disposition"];

  let fileName = "documento";

  if (disposition) {
    const match = disposition.match(
      /filename=(?:"([^"]+)"|([^;]+))/
    );

    if (match) {
      fileName = (match[1] || match[2]).trim();
    }
  }

  const url = window.URL.createObjectURL(response.data);

  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

/**
 * Exclui um documento.
 */
export async function deleteDocument(
  documentId: string
): Promise<void> {
  await api.delete(`/documents/${documentId}`);
}