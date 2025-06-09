// src/lib/api/device.ts
import type { AxiosRequestConfig } from "axios";
import type {
  ActivationTimelineParams,
  ActivationTimelineResponse,
  DeviceMetricsResponse,
  DeviceStatusResponse,
} from "@/types/device";
import type { ApiError } from "./client";
import apiClient from "./client";

// Result type for safe API calls
export type ApiResult<T> = {
  data: T | null;
  error: ApiError | null;
  success: boolean;
};

/**
 * Fetches device metrics/summary data
 * @param config - Optional Axios request config
 * @returns Promise resolving to DeviceMetricsResponse
 * @throws {ApiError} When the request fails
 */
export async function fetchDeviceMetrics(
  config?: AxiosRequestConfig,
): Promise<DeviceMetricsResponse> {
  const response = await apiClient.get<DeviceMetricsResponse>(
    "/device/summary",
    config,
  );
  return response.data;
}

/**
 * Fetches details for a specific device
 * @param deviceId - The device ID to fetch details for
 * @param config - Optional Axios request config
 * @returns Promise resolving to device details
 * @throws {ApiError} When the request fails
 */
export async function fetchDeviceDetails(
  deviceId: string,
  config?: AxiosRequestConfig,
): Promise<unknown> {
  // Replace 'unknown' with actual device details type when available
  const response = await apiClient.get(`/device/${deviceId}`, config);
  return response.data;
}

/**
 * Fetches device activation timeline data
 * @param params - Timeline parameters (date range, filters, etc.)
 * @param config - Optional Axios request config
 * @returns Promise resolving to ActivationTimelineResponse
 * @throws {ApiError} When the request fails
 */
export async function fetchActivationTimeline(
  params: ActivationTimelineParams,
  config?: AxiosRequestConfig,
): Promise<ActivationTimelineResponse> {
  const response = await apiClient.get<ActivationTimelineResponse>(
    "/activations/timeline",
    {
      ...config,
      params: {
        ...params,
        ...config?.params,
      },
    },
  );
  return response.data;
}

/**
 * Fetches device status data
 * @param config - Optional Axios request config
 * @returns Promise resolving to DeviceStatusResponse
 * @throws {ApiError} When the request fails
 */
export async function fetchDeviceStatus(
  config?: AxiosRequestConfig,
): Promise<DeviceStatusResponse> {
  const response = await apiClient.get<DeviceStatusResponse>(
    "/devices/status",
    config,
  );
  return response.data;
}

// React Suspense utilities
/**
 * Fetches device metrics for React Suspense
 * @param config - Optional Axios request config
 * @returns An object with a read() method for Suspense
 */
export function fetchDeviceMetricsForSuspense(config?: AxiosRequestConfig) {
  const promise = fetchDeviceMetrics(config);
  return {
    read() {
      return promise;
    },
  };
}

/**
 * Fetches device details for React Suspense
 * @param deviceId - The device ID to fetch details for
 * @param config - Optional Axios request config
 * @returns An object with a read() method for Suspense
 */
export function fetchDeviceDetailsForSuspense(
  deviceId: string,
  config?: AxiosRequestConfig,
) {
  const promise = fetchDeviceDetails(deviceId, config);
  return {
    read() {
      return promise;
    },
  };
}

/**
 * Fetches activation timeline for React Suspense
 * @param params - Timeline parameters
 * @param config - Optional Axios request config
 * @returns An object with a read() method for Suspense
 */
export function fetchActivationTimelineForSuspense(
  params: ActivationTimelineParams,
  config?: AxiosRequestConfig,
) {
  const promise = fetchActivationTimeline(params, config);
  return {
    read() {
      return promise;
    },
  };
}

/**
 * Fetches device status for React Suspense
 * @param config - Optional Axios request config
 * @returns An object with a read() method for Suspense
 */
export function fetchDeviceStatusForSuspense(config?: AxiosRequestConfig) {
  const promise = fetchDeviceStatus(config);
  return {
    read() {
      return promise;
    },
  };
}

// Safe API functions that never throw
/**
 * Safely fetches device metrics with error handling
 * @param config - Optional Axios request config
 * @returns Promise resolving to result object with data/error info
 */
export async function fetchDeviceMetricsSafe(
  config?: AxiosRequestConfig,
): Promise<ApiResult<DeviceMetricsResponse>> {
  try {
    const data = await fetchDeviceMetrics(config);
    return { data, error: null, success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return { data: null, error: apiError, success: false };
  }
}

/**
 * Safely fetches device details with error handling
 * @param deviceId - The device ID to fetch details for
 * @param config - Optional Axios request config
 * @returns Promise resolving to result object with data/error info
 */
export async function fetchDeviceDetailsSafe(
  deviceId: string,
  config?: AxiosRequestConfig,
): Promise<ApiResult<unknown>> {
  try {
    const data = await fetchDeviceDetails(deviceId, config);
    return { data, error: null, success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return { data: null, error: apiError, success: false };
  }
}

/**
 * Safely fetches activation timeline with error handling
 * @param params - Timeline parameters
 * @param config - Optional Axios request config
 * @returns Promise resolving to result object with data/error info
 */
export async function fetchActivationTimelineSafe(
  params: ActivationTimelineParams,
  config?: AxiosRequestConfig,
): Promise<ApiResult<ActivationTimelineResponse>> {
  try {
    const data = await fetchActivationTimeline(params, config);
    return { data, error: null, success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return { data: null, error: apiError, success: false };
  }
}

/**
 * Safely fetches device status with error handling
 * @param config - Optional Axios request config
 * @returns Promise resolving to result object with data/error info
 */
export async function fetchDeviceStatusSafe(
  config?: AxiosRequestConfig,
): Promise<ApiResult<DeviceStatusResponse>> {
  try {
    const data = await fetchDeviceStatus(config);
    return { data, error: null, success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return { data: null, error: apiError, success: false };
  }
}
