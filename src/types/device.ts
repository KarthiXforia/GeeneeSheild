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

// Device Activation Timeline types
export interface ActivationTimelineItem {
  date: string;
  activated: number;
  total: number;
}

export interface ActivationTimelineResponse {
  timeline: ActivationTimelineItem[];
  totalActivations: number;
  totalDevices: number;
}

export type TimeframeOption = "daily" | "weekly" | "monthly";

export interface ActivationTimelineParams {
  period: TimeframeOption;
  startDate?: string;
  endDate?: string;
}

// Device Status types
export interface DeviceStatusItem {
  name: string; // "Active", "Pending", "Failed"
  count: number;
  percentage: number;
}

export interface DeviceStatusResponse {
  statuses: DeviceStatusItem[];
  total: number;
}
