// src/types/device.ts
export interface DeviceMetrics {
  totalDevices: number;
  kioskModeDevices: number;
  activationSuccessRate: number;
  accessibilityEnabled: number;
  accessibilityWithKiosk: number;
}

export type DeviceMetricsResponse = DeviceMetrics;

export interface DeviceDetails {
  id: string;
  name: string;
  model: string;
  os: string;
  osVersion: string;
  lastSeen: string;
  status: "active" | "inactive" | "pending";
  kioskMode: boolean;
  accessibilityEnabled: boolean;
}

export type DeviceStatus = "active" | "inactive" | "pending";

export interface DeviceError {
  code: string;
  message: string;
  timestamp: string;
}
