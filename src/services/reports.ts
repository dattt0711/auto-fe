import axios from 'axios';
import { API_CONFIG } from '@/config/env';

export interface Report {
  id: string;
  report_name: string;
  progress: number;
  status:  "running" | "success" | "failed";
}

export interface ListReportsResponse {
  file_id: string;
  isSuccess: boolean;
  data: {
    total: number;
    page: number;
    limit: number;
    data: Report[];
  }
}

export interface GetReportsParams {
  page?: number;
  limit?: number;
}

export const reportsService = {
  getReports: async (params?: GetReportsParams): Promise<ListReportsResponse> => {
    const response = await axios.get<ListReportsResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REPORTS.LIST}`,
      {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
        },
      }
    );
    return response.data;
  },

  getReportById: async (id: string): Promise<Report> => {
    const response = await axios.get<{ isSuccess: boolean, data: Report }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REPORTS.DETAIL(id)}`
    );
    return response.data.data;
  }
}; 