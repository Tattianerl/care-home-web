import { api } from "./api";

import type {
    AuditResponse,
    AuditSummary,
} from "../types/audit";

export async function getAuditLogs(params?: {
  page?: number;
  limit?: number;
  acao?: string;
  entidade?: string;
  userId?: string;
  usuario?: string;
  startDate?: string;
  endDate?: string;
}) {
  const { data } = await api.get<AuditResponse>(
   "/audit-logs",
    {
      params,
    }
  );

  return data;
}

export async function getAuditSummary(
  year?: string,
  month?: string
) {
  const { data } = await api.get<AuditSummary>(
    "/dashboard/audit-summary",
    {
      params: {
        year,
        month,
      },
    }
  );

  return data;
}

export async function exportAuditLogs() {
  const response = await api.get(
    "/export/audit-logs",
    {
      responseType: "blob",
    }
  );

  return response.data;
}