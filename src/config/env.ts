export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3005',
  ENDPOINTS: {
    TEST_FILES: {
      LIST: '/test-files',
      UPLOAD: '/test-files/upload',
      DETAIL: (id: string) => `/test-files/${id}`,
    },
    REPORTS: {
      LIST: '/reports',
      DETAIL: (id: string) => `/reports/${id}`,
      DETAIL_TESTCASES: (id: string) => `/reports/testcases/${id}`,
    },
  },
  SOCKET: {
    URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3005',
  },
} as const; 