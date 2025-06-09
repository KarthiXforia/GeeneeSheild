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
  details?: string;
  isCanceled?: boolean;
}

// Define configuration interface
interface ApiClientConfig {
  baseURL: string;
  apiKey: string;
  timeout: number;
}

// Error codes enum for better maintainability
export enum ErrorCodes {
  CANCELED = "CANCELED",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  CONNECTION_ERROR = "CONNECTION_ERROR",
  NO_RESPONSE = "NO_RESPONSE",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  SERVER_ERROR = "SERVER_ERROR",
}

// Logger utility to avoid ESLint no-console warnings
const logger = {
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug(message, data);
    }
  },
  warn: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn(message, data);
    }
  },
  error: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(message, data);
    }
  },
};

// Configuration with validation
const createConfig = (): ApiClientConfig => {
  const baseURL = process.env.NEXT_PUBLIC_API_PROXY_PATH || "/api/proxy";
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  const timeout = 30000; // 30 seconds

  // Warn in development if API key is missing
  if (process.env.NODE_ENV === "development" && !apiKey) {
    logger.warn(
      "⚠️ API key is not configured. Set NEXT_PUBLIC_API_KEY environment variable.",
    );
  }

  return { baseURL, apiKey, timeout };
};

const config = createConfig();

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-store",
  },
});

// Enhanced request interceptor
apiClient.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    // Ensure headers exist
    requestConfig.headers = requestConfig.headers || {};

    // Add API key to all requests
    if (config.apiKey) {
      requestConfig.headers["x-api-key"] = config.apiKey;
    }

    // Add request tracing
    requestConfig.headers["x-request-id"] = uuidv4();
    requestConfig.headers["x-request-timestamp"] = Date.now().toString();

    // Log request in development
    logger.debug("🚀 API Request:", {
      method: requestConfig.method?.toUpperCase(),
      url: requestConfig.url,
      headers: requestConfig.headers,
    });

    return requestConfig;
  },
  (error: AxiosError): Promise<never> => {
    logger.error("❌ Request Interceptor Error:", error.message);
    return Promise.reject(createApiError(error));
  },
);

// Enhanced response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.debug("✅ API Response:", {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
    });
    return response;
  },
  (error: AxiosError): Promise<never> => {
    logger.debug("❌ API Error:", {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
    });

    return Promise.reject(createApiError(error));
  },
);

// Specialized error handlers
const handleCanceledRequest = (): ApiError => ({
  message: "Request was canceled",
  code: ErrorCodes.CANCELED,
  isCanceled: true,
});

const handleNetworkError = (error: AxiosError): ApiError => {
  if (error.code === "ECONNABORTED") {
    return {
      message: "Request timeout. The server took too long to respond.",
      code: ErrorCodes.TIMEOUT_ERROR,
    };
  }

  if (error.code === "ERR_NETWORK") {
    return {
      message: "Network error. Please check your internet connection.",
      code: ErrorCodes.NETWORK_ERROR,
    };
  }

  return {
    message: "Unable to connect to the server. Please try again later.",
    code: ErrorCodes.CONNECTION_ERROR,
  };
};

const handleHttpError = (error: AxiosError): ApiError => {
  if (!error.response) {
    return {
      message: "No response received from server",
      code: ErrorCodes.NO_RESPONSE,
    };
  }

  const { status, statusText } = error.response;
  const errorData = (error.response.data || {}) as {
    message?: string;
    error?: string;
    details?: string;
  };

  // Status-specific error handling
  const statusErrorMap: Record<number, { message: string; code: string }> = {
    401: {
      message: "Authentication required. Please log in again.",
      code: ErrorCodes.UNAUTHORIZED,
    },
    403: {
      message: "You do not have permission to access this resource.",
      code: ErrorCodes.FORBIDDEN,
    },
    404: {
      message: "The requested resource was not found.",
      code: ErrorCodes.NOT_FOUND,
    },
  };

  const statusError = statusErrorMap[status];

  if (statusError) {
    return {
      message: statusError.message,
      code: statusError.code,
      status,
      data: errorData,
      details: errorData?.details,
    };
  }

  // Handle server errors (5xx)
  if (status >= 500) {
    return {
      message: "A server error occurred. Please try again later.",
      code: ErrorCodes.SERVER_ERROR,
      status,
      data: errorData,
      details: errorData?.details,
    };
  }

  // Handle other client errors (4xx)
  const message =
    errorData?.message ||
    errorData?.error ||
    statusText ||
    "An unknown error occurred";

  return {
    message,
    code: `HTTP_${status}`,
    status,
    data: errorData,
    details: errorData?.details,
  };
};

const handleGenericError = (error: Error): ApiError => ({
  message: error.message || "An unexpected error occurred",
  code: ErrorCodes.UNKNOWN_ERROR,
});

// Main error creation function - now much cleaner
function createApiError(error: AxiosError | Error | unknown): ApiError {
  // Handle canceled requests first
  if (
    axios.isCancel(error) ||
    (error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ERR_CANCELED")
  ) {
    return handleCanceledRequest();
  }

  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    // Network errors (no response)
    if (!error.response) {
      return handleNetworkError(error);
    }
    // HTTP errors (4xx, 5xx)
    return handleHttpError(error);
  }

  // Handle generic errors
  if (error instanceof Error) {
    return handleGenericError(error);
  }

  // Fallback for unknown error types
  return {
    message: "An unexpected error occurred",
    code: ErrorCodes.UNKNOWN_ERROR,
  };
}

// Request cancellation utilities
export const createCancelToken = () => {
  const controller = new AbortController();
  return {
    signal: controller.signal,
    cancel: (reason?: string) => {
      logger.debug("🚫 Request canceled:", reason || "No reason provided");
      controller.abort(reason);
    },
  };
};

// Utility function to check if an error is a cancellation
export const isCanceledError = (error: ApiError): boolean => {
  return error.code === ErrorCodes.CANCELED || !!error.isCanceled;
};

// Utility function to check if an error is retryable
export const isRetryableError = (error: ApiError): boolean => {
  const retryableCodes = [
    ErrorCodes.TIMEOUT_ERROR,
    ErrorCodes.NETWORK_ERROR,
    ErrorCodes.CONNECTION_ERROR,
    ErrorCodes.SERVER_ERROR,
  ];

  return (
    retryableCodes.includes(error.code as ErrorCodes) ||
    (error.status !== undefined && error.status >= 500)
  );
};

// Enhanced API client with additional utilities
export const api = {
  client: apiClient,

  // Helper method for retrying requests
  async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    maxRetries: number = 3,
    retryDelay: number = 1000,
  ): Promise<AxiosResponse<T>> {
    let lastError: ApiError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as ApiError;

        // Don't retry if it's not a retryable error or if it's the last attempt
        if (!isRetryableError(lastError) || attempt === maxRetries) {
          throw lastError;
        }

        // Wait before retrying (exponential backoff)
        const delay = retryDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));

        logger.debug(
          `🔄 Retrying request (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms`,
        );
      }
    }

    throw lastError!;
  },

  // Health check utility
  async healthCheck(): Promise<boolean> {
    try {
      await apiClient.get("/health");
      return true;
    } catch {
      return false;
    }
  },
};

// Export the configured client as default
export default apiClient;
export type { ApiClientConfig };
