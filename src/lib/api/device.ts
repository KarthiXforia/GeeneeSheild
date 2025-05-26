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

export async function fetchDeviceMetrics(
  config?: AxiosRequestConfig,
): Promise<DeviceMetricsResponse> {
  try {
    return await apiClient.get("/device/summary", config);
  } catch (error) {
    throw error as ApiError;
  }
}

export async function fetchDeviceDetails(
  deviceId: string,
  config?: AxiosRequestConfig,
) {
  try {
    return await apiClient.get(`/device/${deviceId}`, config);
  } catch (error) {
    throw error as ApiError;
  }
}

// Function to use with React Suspense
export function fetchDeviceMetricsForSuspense() {
  const promise = fetchDeviceMetrics();
  return {
    read() {
      return promise;
    },
  };
}

// Fetch device activation timeline data
export async function fetchActivationTimeline(
  params: ActivationTimelineParams,
  config?: AxiosRequestConfig,
): Promise<ActivationTimelineResponse> {
  try {
    return await apiClient.get("/activations/timeline", {
      ...config,
      params,
    });
  } catch (error) {
    throw error as ApiError;
  }
}

// Fetch device status data
export async function fetchDeviceStatus(
  config?: AxiosRequestConfig,
): Promise<DeviceStatusResponse> {
  try {
    return await apiClient.get("/devices/status", config);
  } catch (error) {
    throw error as ApiError;
  }
}
