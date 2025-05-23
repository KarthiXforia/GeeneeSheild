import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { v4 as uuidv4 } from "uuid";

// Define error types for better type safety
export interface ApiError {
  message: string;
  code: string;
  status?: number;
  data?: unknown;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_PROXY_PATH || "/api/proxy";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-store",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add API key to all requests
    config.headers = config.headers || {};
    config.headers["x-api-key"] = API_KEY;

    // Add request ID for tracing
    config.headers["x-request-id"] = uuidv4();

    // Add timestamp
    config.headers["x-request-timestamp"] = Date.now().toString();

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(createApiError(error));
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError): Promise<ApiError> => {
    return Promise.reject(createApiError(error));
  },
);

// Helper to create standardized API errors
function createApiError(error: AxiosError | Error): ApiError {
  // Network errors (no response)
  if (!axios.isAxiosError(error) || !error.response) {
    return {
      message:
        "Unable to connect to the server. Please check your internet connection.",
      code: "NETWORK_ERROR",
    };
  }

  // API errors with response
  const status = error.response.status;
  let message = "An unexpected error occurred";
  let code = "UNKNOWN_ERROR";

  // Handle specific status codes
  switch (status) {
    case 400:
      message = "Invalid request: Please check your input data";
      code = "BAD_REQUEST";
      break;
    case 401:
      message = "Unauthorized: Please check your API key";
      code = "UNAUTHORIZED";
      break;
    case 403:
      message =
        "Access forbidden: You do not have permission to access this resource";
      code = "FORBIDDEN";
      break;
    case 404:
      message = "Resource not found";
      code = "NOT_FOUND";
      break;
    case 429:
      message = "Too many requests: Please try again later";
      code = "RATE_LIMITED";
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      message = "Server error: Please try again later";
      code = "SERVER_ERROR";
      break;
  }

  return {
    message,
    code,
    status,
    data: error.response.data,
  };
}

// Create controller for request cancellation
export const createCancelToken = () => {
  const controller = new AbortController();
  return {
    signal: controller.signal,
    cancel: () => controller.abort(),
  };
};

export default apiClient;
