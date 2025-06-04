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

export interface RunAllTestFileResponse {
  isSuccess: boolean;
  report_id: string;
  message: string;
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
      // input_variables: JSON.stringify({
      //   environment: "production",
      //   timeout: 30000,
      //   retryCount: 3,
      //   features: ["auth", "payment", "notifications"],
      //   config: {
      //     apiVersion: "v2",
      //     debug: true
      //   },
      //   steps: [
      //     {
      //       step: "Initialize test environment",
      //       status: "pass",
      //       message: "",
      //       sub_steps: [
      //         {
      //           step: "Load configuration",
      //           status: "pass",
      //           message: "",
      //           sub_steps: [
      //             {
      //               step: "Validate config format",
      //               status: "pass",
      //               message: ""
      //             },
      //             {
      //               step: "Check required fields",
      //               status: "pass",
      //               message: ""
      //             }
      //           ]
      //         },
      //         {
      //           step: "Setup test database",
      //           status: "pass",
      //           message: "",
      //           sub_steps: [
      //             {
      //               step: "Create test tables",
      //               status: "pass",
      //               message: ""
      //             },
      //             {
      //               step: "Seed test data",
      //               status: "failed",
      //               message: "Failed to insert test records",
      //               sub_steps: [
      //                 {
      //                   step: "Insert user data",
      //                   status: "pass",
      //                   message: ""
      //                 },
      //                 {
      //                   step: "Insert transaction data",
      //                   status: "failed",
      //                   message: "Database connection timeout"
      //                 }
      //               ]
      //             }
      //           ]
      //         }
      //       ]
      //     },
      //     {
      //       step: "Execute test scenarios",
      //       status: "failed",
      //       message: "Test execution failed",
      //       sub_steps: [
      //         {
      //           step: "Authentication flow",
      //           status: "pass",
      //           message: "",
      //           sub_steps: [
      //             {
      //               step: "Login with valid credentials",
      //               status: "pass",
      //               message: ""
      //             },
      //             {
      //               step: "Verify token generation",
      //               status: "pass",
      //               message: ""
      //             }
      //           ]
      //         },
      //         {
      //           step: "Payment processing",
      //           status: "failed",
      //           message: "Payment gateway error",
      //           sub_steps: [
      //             {
      //               step: "Validate payment details",
      //               status: "pass",
      //               message: ""
      //             },
      //             {
      //               step: "Process payment",
      //               status: "failed",
      //               message: "Gateway timeout",
      //               sub_steps: [
      //                 {
      //                   step: "Connect to payment gateway",
      //                   status: "pass",
      //                   message: ""
      //                 },
      //                 {
      //                   step: "Submit payment request",
      //                   status: "failed",
      //                   message: "Connection timeout after 30s"
      //                 }
      //               ]
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // })
    };
    return mockData;
  },

  runAllTestFile: async (
    fileId: string,
    reportName: string
  ): Promise<RunAllTestFileResponse> => {
    const response = await axios.post<RunAllTestFileResponse>(
      `${API_CONFIG.BASE_URL}/executor/run-all/${fileId}`,
      {
        report_name: reportName
      }
    );
    return response.data;
  }
}; 