import { api } from "./api";

export async function exportReport(
  endpoint: string,
  fileName: string
) {
  const response = await api.get(endpoint, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: "application/pdf",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `${fileName}.pdf`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}