import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MainLayout } from "../../layouts/MainLayout";

import {
  deleteDocument,
  downloadDocument,
  getPatientDocuments,
} from "../../services/documents";

import type { Document } from "../../types/document";

export function PatientDocuments() {

  const { id } = useParams();

  const [documents, setDocuments] =
    useState<Document[]>([]);

  async function handleDelete(documentId: string) {
  const confirmed = window.confirm(
    "Tem certeza que deseja excluir este documento?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteDocument(documentId);

    setDocuments((previousDocuments) =>
      previousDocuments.filter(
        (document) => document.id !== documentId
      )
    );

    alert("Documento excluído com sucesso.");
  } catch (error) {
    console.error(error);
    alert("Erro ao excluir documento.");
  }
}  

  useEffect(() => {
    async function loadDocuments() {
      if (!id) return;

      try{
        const data = await getPatientDocuments(id);
        setDocuments(data);

      }catch(error){
        console.error(error);
         alert("Erro ao carregar documentos.");
      }
    }
      loadDocuments();

    }, [id]);

  return (

    <MainLayout>

      <div className="flex justify-between items-center mb-6">

        <div>

          <Link
            to={`/patients/${id}`}
            className="text-blue-600 hover:underline"
          >
            ← Voltar
          </Link>

          <h1 className="text-3xl font-bold mt-2">
            Documentos
          </h1>

        </div>

        <Link
          to={`/patients/${id}/documents/new`}
          className="
            bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
            hover:bg-blue-700
          "
        >
          Novo Documento
        </Link>

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        {documents.length === 0 ? (

          <p>Nenhum documento enviado.</p>

        ) : (

          documents.map((document) => (

            <div
              key={document.id}
              className="border-b py-4 flex justify-between"
            >

              <div>

                <h2 className="font-semibold">
                  {document.nome}
                </h2>

                <small>

                  {new Date(
                    document.createdAt
                  ).toLocaleString("pt-BR")}

                </small>

              </div>
                <button
              onClick={async () => {
                try {
                  await downloadDocument(document.id);
                } catch (error) {
                  console.error(error);
                  alert("Erro ao baixar documento.");
                }
              }}
            >
               Download
              </button>
              <button
                  onClick={() => handleDelete(document.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Excluir
              </button>

            </div>

          ))

        )}

      </div>

    </MainLayout>

  );

}