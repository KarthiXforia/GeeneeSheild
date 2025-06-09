// src/lib/api/apps.ts
import type { AxiosRequestConfig } from "axios";
import type {
  BlockedAppSummaryResponse,
  BlockedAppTrendsParams,
  BlockedAppTrendsResponse,
  TopBlockedAppsResponse,
} from "@/types/apps";
import type { ApiError } from "./client";
import apiClient from "./client";

// Result type for safe API calls
export type ApiResult<T> = {
  data: T | null;
  error: ApiError | null;
  success: boolean;
};

/**
 * Fetches blocked apps summary data
 * @param config - Optional Axios request config
 * @returns Promise resolving to BlockedAppSummaryResponse
 * @throws {ApiError} When the request fails
 */
export async function fetchBlockedAppSummary(
  config?: AxiosRequestConfig,
): Promise<BlockedAppSummaryResponse> {
  const response = await apiClient.get<BlockedAppSummaryResponse>(
    "/blocked-app/summary",
    config,
  );
  return response.data;
}

/**
 * Fetches top blocked apps
 * @param limit - Maximum number of apps to return
 * @param config - Optional Axios request config
 * @returns Promise resolving to TopBlockedAppsResponse
 * @throws {ApiError} When the request fails
 */
export async function fetchTopBlockedApps(
  limit: number = 10,
  config?: AxiosRequestConfig,
): Promise<TopBlockedAppsResponse> {
  const response = await apiClient.get<TopBlockedAppsResponse>(
    "/blocked-app/top",
    {
      ...config,
      params: {
        limit,
        ...config?.params,
      },
    },
  );
  return response.data;
}

/**
 * Fetches blocked app trends data
 * @param params - Query parameters including period, startDate, and endDate
 * @param config - Optional Axios request config
 * @returns Promise resolving to BlockedAppTrendsResponse
 * @throws {ApiError} When the request fails
 */
export async function fetchBlockedAppTrends(
  params: BlockedAppTrendsParams,
  config?: AxiosRequestConfig,
): Promise<BlockedAppTrendsResponse> {
  const response = await apiClient.get<BlockedAppTrendsResponse>(
    "/blocked-app/trends",
    {
      ...config,
      params: {
        period: params.period,
        startDate: params.startDate,
        endDate: params.endDate,
        ...config?.params,
      },
    },
  );
  return response.data;
}

// React Suspense utilities
/**
 * Fetches blocked apps summary for React Suspense
 * @param config - Optional Axios request config
 * @returns An object with a read() method for Suspense
 */
export function fetchBlockedAppSummaryForSuspense(config?: AxiosRequestConfig) {
  const promise = fetchBlockedAppSummary(config);
  return {
    read() {
      return promise;
    },
  };
}

/**
 * Fetches top blocked apps for React Suspense
 * @param limit - Maximum number of apps to return
 * @param config - Optional Axios request config
 * @returns An object with a read() method for Suspense
 */
export function fetchTopBlockedAppsForSuspense(
  limit: number = 10,
  config?: AxiosRequestConfig,
) {
  const promise = fetchTopBlockedApps(limit, config);
  return {
    read() {
      return promise;
    },
  };
}

/**
 * Fetches blocked app trends for React Suspense
 * @param params - Query parameters including period, startDate, and endDate
 * @param config - Optional Axios request config
 * @returns An object with a read() method for Suspense
 */
export function fetchBlockedAppTrendsForSuspense(
  params: BlockedAppTrendsParams,
  config?: AxiosRequestConfig,
) {
  const promise = fetchBlockedAppTrends(params, config);
  return {
    read() {
      return promise;
    },
  };
}

// Safe API functions that never throw
/**
 * Safely fetches blocked apps summary with error handling
 * @param config - Optional Axios request config
 * @returns Promise resolving to result object with data/error info
 */
export async function fetchBlockedAppSummarySafe(
  config?: AxiosRequestConfig,
): Promise<ApiResult<BlockedAppSummaryResponse>> {
  try {
    const data = await fetchBlockedAppSummary(config);
    return { data, error: null, success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return { data: null, error: apiError, success: false };
  }
}

/**
 * Safely fetches top blocked apps with error handling
 * @param limit - Maximum number of apps to return
 * @param config - Optional Axios request config
 * @returns Promise resolving to result object with data/error info
 */
export async function fetchTopBlockedAppsSafe(
  limit: number = 10,
  config?: AxiosRequestConfig,
): Promise<ApiResult<TopBlockedAppsResponse>> {
  try {
    const data = await fetchTopBlockedApps(limit, config);
    return { data, error: null, success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return { data: null, error: apiError, success: false };
  }
}

/**
 * Safely fetches blocked app trends with error handling
 * @param params - Query parameters including period, startDate, and endDate
 * @param config - Optional Axios request config
 * @returns Promise resolving to result object with data/error info
 */
export async function fetchBlockedAppTrendsSafe(
  params: BlockedAppTrendsParams,
  config?: AxiosRequestConfig,
): Promise<ApiResult<BlockedAppTrendsResponse>> {
  try {
    const data = await fetchBlockedAppTrends(params, config);
    return { data, error: null, success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return { data: null, error: apiError, success: false };
  }
}
