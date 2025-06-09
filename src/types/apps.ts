// src/types/apps.ts
export interface BlockedAppCategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

export interface BlockedAppSummaryResponse {
  totalBlockedAttempts: number;
  uniqueBlockedApps: number;
  uniqueDevicesBlocked: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

export interface TopBlockedApp {
  appName: string;
  iconUrl: string;
  count: number;
  percentage: number;
  category: string;
}

export interface TopBlockedAppsResponse {
  topBlockedApps: TopBlockedApp[];
  totalAttempts: number;
}

export type TimeframeOption = "daily" | "weekly" | "monthly";
export type TrendDirection = "increasing" | "decreasing" | "stable";

export interface BlockedAppTrendCategories {
  [category: string]: number;
}

export interface BlockedAppTrendItem {
  date: string;
  count: number;
  categories: Record<string, number>;
}

export interface BlockedAppTrendsResponse {
  trends: BlockedAppTrendItem[];
  totalAttempts: number;
  averagePerDay: number;
  trendDirection: TrendDirection;
  percentageChange: number;
}

export interface BlockedAppTrendsParams {
  period: "daily" | "weekly" | "monthly";
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}
