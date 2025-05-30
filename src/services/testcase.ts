import axios from 'axios';
import { API_URL } from '../config/constants';

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

export const getTestcasesByFileId = async (
  fileId: string,
  page: number = 1,
  limit: number = 10
): Promise<TestcasePaginationResponse> => {
  const response = await axios.get<TestcaseResponse>(
    `${API_URL}/test-files/testcases`,
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