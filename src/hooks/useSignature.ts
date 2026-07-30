import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import { api } from "../services/api";

type Message = {
  type: "success" | "error";
  text: string;
};

function formatSignatureUrl(
  url: string | null |undefined
): string | null {
  if (!url) return null;

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  const baseURL = api.defaults.baseURL || "";

  return `${baseURL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
}

export function useSignature() {
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [fetchingCurrent, setFetchingCurrent] =
    useState(true);

  const [currentSignatureUrl, setCurrentSignatureUrl] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<Message | null>(null);

  useEffect(() => {
  let cancelled = false;

  async function loadSignature() {
    try {
      const response = await api.get("/me");

      if (cancelled) return;

      const signature =
        response.data?.user?.assinatura ??
        response.data?.assinatura;

      setCurrentSignatureUrl(formatSignatureUrl(signature));
    } catch (error) {
      console.error(error);
    } finally {
      if (!cancelled) {
        setFetchingCurrent(false);
      }
    }
  }

  void loadSignature();

  return () => {
    cancelled = true;
  };
}, []);

  async function uploadFile() {
    if (!file) {
      setMessage({
        type: "error",
        text: "Selecione um arquivo.",
      });

      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const formData = new FormData();

      formData.append("file", file);

      const { data } = await api.post(
        "/users/signature",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      const signature =
        data?.assinatura ??
        data?.user?.assinatura;

      setCurrentSignatureUrl(
        formatSignatureUrl(signature)
      );

      setMessage({
        type: "success",
        text: "Assinatura atualizada com sucesso.",
      });

      setFile(null);

     
    } catch (error) {
      const err =
        error as AxiosError<{
          error?: string;
          message?: string;
        }>;

      setMessage({
        type: "error",
        text:
          err.response?.data?.error ??
          err.response?.data?.message ??
          "Erro ao enviar assinatura.",
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    file,
    setFile,

    loading,
    fetchingCurrent,

    message,
    setMessage,

    currentSignatureUrl,

    uploadFile,

    
  };
}