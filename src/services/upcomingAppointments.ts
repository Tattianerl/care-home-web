import { api } from "./api";

export async function getUpcomingAppointments() {
  const response = await api.get(
    "/appointments/upcoming"
  );

  return response.data;
}