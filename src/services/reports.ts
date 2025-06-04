import axios from 'axios';
import { API_CONFIG } from '@/config/env';

export interface Report {
  _id: string;
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

export interface ReportDetail {
  id: string;
  test_case_id: {
    data: {
      item_no: string;
      step_confirm: string;
    }
  };
  status: "success" | "failed";
  error_message?: string;
  evidence_path?: string;
  detail_result: {
    step: string;
    isSuccess: boolean;
    description: string;
    errorMessage?: string;
  }[];
}

export interface ReportDetailsResponse {
  isSuccess: boolean;
  data: {
    total: number | any;
    page: number;
    limit: number;
    data: ReportDetail[];
  }
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
  },

  getReportDetails: async (
    reportId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ReportDetailsResponse> => {
    const response = await axios.get<ReportDetailsResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REPORTS.DETAIL_TESTCASES(reportId)}`,
      {
        params: {
          page,
          limit,
        },
      }
    );
    return response.data;
  }
}; 