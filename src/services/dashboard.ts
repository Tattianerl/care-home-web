import { api } from "./api";

export async function getDashboardToday() {
    const response = await api.get("/dashboard/today");

    return response.data;
}