// Export the new MDM dashboard components
export { default as DeviceManagement } from "./sections/device-management";
export { default as SecurityCompliance } from "./sections/security-compliance";
export { default as WebAccessFiltering } from "./sections/web-access-filtering";
export { default as UsageAnalytics } from "./sections/usage-analytics";

// Export individual chart components
// Device Management
export { default as EnrolledDevicesMetrics } from "./charts/device-metrics";
export { default as DeviceActivationTrend } from "./charts/device-activation-trend";
export { default as ActiveVsInactiveDevices } from "./charts/active-vs-inactive";

// Security & Compliance
export { default as AccessibilityPermissions } from "./charts/accessibility-permissions";
export { default as KnoxEnrollmentErrors } from "./charts/enrollment-errors";
export { default as EnrollmentFunnel } from "./charts/enrollment-funnel";

// Web Access & Filtering
export { default as BlockedDomains } from "./charts/blocked-domains";
export { default as PeakAccessTime } from "./charts/peak-access-time";
export { default as DomainCategories } from "./charts/domain-categories";

// Usage Analytics
export { default as DeviceModeDistribution } from "./charts/device-mode-distribution";
export { default as ActivationOverTime } from "./charts/activation-over-time";
export { default as BrowserUsage } from "./charts/browser-usage";
