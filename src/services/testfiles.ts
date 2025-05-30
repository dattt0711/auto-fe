import axios from 'axios';
import { API_CONFIG } from '@/config/env';

export interface TestFile {
  _id: string;
  test_file_name: string;
  url: string;
  status: "success" | "failed" | "pending" | "processing";
  input_variables: string;
}

export interface UploadTestFileResponse {
  file_id: string;
  isSuccess: boolean;
}

export interface ListTestFilesResponse {
  file_id: string;
  isSuccess: boolean;
  data: {
    total: number;
    page: number;
    limit: number;
    data: TestFile[];
  }
}

export interface GetTestFilesParams {
  page?: number;
  limit?: number;
}

export const testFilesService = {
  uploadTestFile: async (file: File, testFileName: string): Promise<UploadTestFileResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("test_file_name", testFileName);

    const response = await axios.post<UploadTestFileResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEST_FILES.UPLOAD}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  getTestFiles: async (params?: GetTestFilesParams): Promise<ListTestFilesResponse> => {
    const response = await axios.get<ListTestFilesResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEST_FILES.LIST}`,
      {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
        },
      }
    );
    return response.data;
  },

  getTestFileById: async (id: string): Promise<TestFile> => {
    const response = await axios.get<{ isSuccess: boolean, data: TestFile }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEST_FILES.DETAIL(id)}`
    );
    // Mock data for testing
    const mockData = {
      ...response.data.data,
      input_variables: JSON.stringify({
        environment: "production",
        timeout: 30000,
        retryCount: 3,
        features: ["auth", "payment", "notifications"],
        config: {
          apiVersion: "v2",
          debug: true
        }
      })
    };
    return mockData;
  }
}; 