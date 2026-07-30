// src/types/document.ts

// Documento genérico/padrão
export interface Document {
  id: string;
  nome: string;
  arquivo: string;
  createdAt: string;
}

// Interface para os dados resumidos do residente dentro do documento
export interface DocumentPatientInfo {
  id: string;
  nome: string;
}

// Documento associado a um residente
export interface PatientDocument {
  id: string;
  nome: string;
  arquivo?: string; 
  createdAt: string;
  patientId?: string;
  patient?: DocumentPatientInfo;
}