// src/lib/api/device.ts
import type { AxiosRequestConfig } from "axios";
import type { DeviceMetricsResponse } from "@/types/device";
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
