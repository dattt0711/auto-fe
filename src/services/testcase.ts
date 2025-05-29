import axios from 'axios';
import { baseUrl } from '@/config/app';

export interface Testcase {
  id: string;
  itemNo: string;
  stepConfirm: string;
  expectationResult: string;
}

export interface TestcaseResponse {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

export const getTestcases = async (page: number = 1, limit: number = 10): Promise<TestcaseResponse> => {
  try {
    const response = await axios.get(`http://localhost:3005/test-files/testcases`, {
      params: {
        page,
        limit,
      },
    });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching testcases:', error);
    throw error;
  }
}; 