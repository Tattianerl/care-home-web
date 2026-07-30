import { api } from "./api";


export async function exportReport(
  endpoint: string
) {

  const response =
    await api.get(endpoint, {
      responseType: "blob",
    });


  return response.data;
}