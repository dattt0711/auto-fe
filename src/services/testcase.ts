import axios from 'axios';
import { API_CONFIG } from '@/config/env';

export interface Testcase {
  _id: string;
  file_id: string;
  row_index: number;
  data: Record<string, any>;
  is_processed: boolean;
  automation_code: any;
}

export interface TestcasePaginationResponse {
  data: Testcase[];
  total: number;
  limit: number;
  page: number;
}

export interface TestcaseResponse {
  isSuccess: boolean;
  data: TestcasePaginationResponse
}

export interface RunTestcaseResponse {
  isSuccess: boolean;
  report_id: string;
  message: string;
}

export const getTestcasesByFileId = async (
  fileId: string,
  page: number = 1,
  limit: number = 10
): Promise<TestcasePaginationResponse> => {
  const response = await axios.get<TestcaseResponse>(
    `${API_CONFIG.BASE_URL}/test-files/testcases`,
    {
      params: {
        page,
        limit,
        file_id: fileId,
      },
    }
  );
  return response.data.data;
};

export const runTestcase = async (
  testcaseId: string,
  reportName: string
): Promise<RunTestcaseResponse> => {
  const response = await axios.post<RunTestcaseResponse>(
    `${API_CONFIG.BASE_URL}/executor/run/testcase/${testcaseId}`,
    {
      report_name: reportName
    }
  );
  return response.data;
}; 