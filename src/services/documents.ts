import { api } from "./api";

/**
 * 📄 Enviar documento para o paciente
 */
export async function createPatientDocument(
  patientId: string,
  nome: string,
  file: File
) {
  const formData = new FormData();

  formData.append("nome", nome);
  formData.append("file", file);

  const response = await api.post(
    `/patients/${patientId}/documents`,
    formData
  );

  return response.data;
}

/**
 * 📥 Listar documentos
 */
export async function getPatientDocuments(patientId: string) {
  const response = await api.get(
    `/patients/${patientId}/documents`
  );

  return response.data;
}

/**
 * ⬇ Download
 */
export async function downloadDocument(documentId: string) {
  try {
    const response = await api.get(
      `/documents/${documentId}/download`,
      {
        responseType: "blob", 
      }
    );

    // O Axios converte os headers para letras minúsculas
    const disposition = response.headers["content-disposition"];
    let fileName = "documento";

    if (disposition) {
      // Um regex mais seguro para capturar o filename com ou sem aspas
      const match = disposition.match(/filename=(?:"([^"]+)"|([^;]+))/);
      if (match) {
        fileName = match[1] || match[2];
      }
    }

    // Passamos o response.data direto 
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName.trim();

    document.body.appendChild(link);
    link.click();
    
    // Limpeza
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro no download:", error);
    alert("Arquivo não encontrado ou corrompido no servidor.");
  }
 }
  /**
 * 🗑 Excluir documento
 */
    export async function deleteDocument(documentId: string) {
      await api.delete(`/documents/${documentId}`);
    }

  
