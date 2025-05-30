import axios from 'axios';
import { API_URL } from '../config/constants';

export interface TestFile {
  _id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TestFileResponse {
  data: TestFile;
}

export const getTestFileById = async (id: string): Promise<TestFile> => {
  const response = await axios.get<TestFileResponse>(`${API_URL}/test-files/${id}`);
  return response.data.data;
}; 