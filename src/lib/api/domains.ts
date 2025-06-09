// src/lib/api/domains.ts
import type { AxiosRequestConfig } from "axios";
import type {
  BlockedDomainHeatmapParams,
  BlockedDomainHeatmapResponse,
  BlockedDomainSummaryResponse,
  BlockedDomainTrendsParams,
  BlockedDomainTrendsResponse,
  TopBlockedDomainsResponse,
} from "@/types/domains";
import type { ApiError } from "./client";
import apiClient from "./client";

// Result type for safe API calls
export type ApiResult<T> = {
  data: T | null;
  error: ApiError | null;
  success: boolean;
};

/**
 * Fetches blocked domain heatmap data
 * @param params - Query parameters including period (daily/weekly/monthly)
 * @param config - Optional Axios request config
 * @returns Promise resolving to BlockedDomainHeatmapResponse
 * @throws {ApiError} When the request fails
 */
export async function fetchBlockedDomainHeatmap(
  params: BlockedDomainHeatmapParams,
  config?: AxiosRequestConfig,
): Promise<BlockedDomainHeatmapResponse> {
  const response = await apiClient.get<BlockedDomainHeatmapResponse>(
    "/blocked-domain/heatmap",
    {
      ...config,
      params: {
        period: params.period,
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate }),
        ...config?.params,
      },
    },
  );
  return response.data;
}

/**
 * Fetches top blocked domains
 * @param limit - Maximum number of domains to return
 * @param config - Optional Axios request config
 * @returns Promise resolving to TopBlockedDomainsResponse
 * @throws {ApiError} When the request fails
 */
export async function fetchTopBlockedDomains(
  limit: number = 10,
  config?: AxiosRequestConfig,
): Promise<TopBlockedDomainsResponse> {
  const response = await apiClient.get<TopBlockedDomainsResponse>(
    "/blocked-domains/top",
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
 * Fetches blocked domain trends data
 * @param params - Query parameters including period, startDate, and endDate
 * @param config - Optional Axios request config
 * @returns Promise resolving to BlockedDomainTrendsResponse
 * @throws {ApiError} When the request fails
 */
export async function fetchBlockedDomainTrends(
  params: BlockedDomainTrendsParams,
  config?: AxiosRequestConfig,
): Promise<BlockedDomainTrendsResponse> {
  const response = await apiClient.get<BlockedDomainTrendsResponse>(
    "/blocked-domain/trends",
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

/**
 * Fetches blocked domain summary data
 * @param config - Optional Axios request config
 * @returns Promise resolving to BlockedDomainSummaryResponse
 * @throws {ApiError} When the request fails
 */
export async function fetchBlockedDomainSummary(
  config?: AxiosRequestConfig,
): Promise<BlockedDomainSummaryResponse> {
  const response = await apiClient.get<BlockedDomainSummaryResponse>(
    "/blocked-domain/summary",
    config,
  );
  return response.data;
}

// React Suspense utilities
/**
 * Fetches blocked domain heatmap data for React Suspense
 * @param params - Query parameters including period
 * @param config - Optional Axios request config
 * @returns An object with a read() method for Suspense
 */
export function fetchBlockedDomainHeatmapForSuspense(
  params: BlockedDomainHeatmapParams,
  config?: AxiosRequestConfig,
) {
  const promise = fetchBlockedDomainHeatmap(params, config);
  return {
    read() {
      return promise;
    },
  };
}

/**
 * Fetches top blocked domains for React Suspense
 * @param limit - Maximum number of domains to return
 * @param config - Optional Axios request config
 * @returns An object with a read() method for Suspense
 */
export function fetchTopBlockedDomainsForSuspense(
  limit: number = 10,
  config?: AxiosRequestConfig,
) {
  const promise = fetchTopBlockedDomains(limit, config);
  return {
    read() {
      return promise;
    },
  };
}

/**
 * Fetches blocked domain trends for React Suspense
 * @param params - Query parameters including period, startDate, and endDate
 * @param config - Optional Axios request config
 * @returns An object with a read() method for Suspense
 */
export function fetchBlockedDomainTrendsForSuspense(
  params: BlockedDomainTrendsParams,
  config?: AxiosRequestConfig,
) {
  const promise = fetchBlockedDomainTrends(params, config);
  return {
    read() {
      return promise;
    },
  };
}

/**
 * Fetches blocked domain summary for React Suspense
 * @param config - Optional Axios request config
 * @returns An object with a read() method for Suspense
 */
export function fetchBlockedDomainSummaryForSuspense(
  config?: AxiosRequestConfig,
) {
  const promise = fetchBlockedDomainSummary(config);
  return {
    read() {
      return promise;
    },
  };
}

// Safe API functions that never throw
/**
 * Safely fetches blocked domain heatmap with error handling
 * @param params - Query parameters including period
 * @param config - Optional Axios request config
 * @returns Promise resolving to result object with data/error info
 */
export async function fetchBlockedDomainHeatmapSafe(
  params: BlockedDomainHeatmapParams,
  config?: AxiosRequestConfig,
): Promise<ApiResult<BlockedDomainHeatmapResponse>> {
  try {
    const data = await fetchBlockedDomainHeatmap(params, config);
    return { data, error: null, success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return { data: null, error: apiError, success: false };
  }
}

/**
 * Safely fetches top blocked domains with error handling
 * @param limit - Maximum number of domains to return
 * @param config - Optional Axios request config
 * @returns Promise resolving to result object with data/error info
 */
export async function fetchTopBlockedDomainsSafe(
  limit: number = 10,
  config?: AxiosRequestConfig,
): Promise<ApiResult<TopBlockedDomainsResponse>> {
  try {
    const data = await fetchTopBlockedDomains(limit, config);
    return { data, error: null, success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return { data: null, error: apiError, success: false };
  }
}

/**
 * Safely fetches blocked domain trends with error handling
 * @param params - Query parameters including period, startDate, and endDate
 * @param config - Optional Axios request config
 * @returns Promise resolving to result object with data/error info
 */
export async function fetchBlockedDomainTrendsSafe(
  params: BlockedDomainTrendsParams,
  config?: AxiosRequestConfig,
): Promise<ApiResult<BlockedDomainTrendsResponse>> {
  try {
    const data = await fetchBlockedDomainTrends(params, config);
    return { data, error: null, success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return { data: null, error: apiError, success: false };
  }
}

/**
 * Safely fetches blocked domain summary with error handling
 * @param config - Optional Axios request config
 * @returns Promise resolving to result object with data/error info
 */
export async function fetchBlockedDomainSummarySafe(
  config?: AxiosRequestConfig,
): Promise<ApiResult<BlockedDomainSummaryResponse>> {
  try {
    const data = await fetchBlockedDomainSummary(config);
    return { data, error: null, success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return { data: null, error: apiError, success: false };
  }
}
