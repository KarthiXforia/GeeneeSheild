// src/types/domains.ts
export interface BlockedDomainHeatmapItem {
  day: number; // 0-6 (Sunday-Saturday) for weekly, 0-30 for monthly
  hour: number; // 0-23
  count: number; // Number of blocked attempts
}

export interface ActivityPoint {
  day: number; // Day number (0-6 for weekly, 0-30 for monthly)
  hour: number; // Hour of day (0-23)
  count: number; // Number of blocked attempts
  dayName: string; // "Monday", "Tuesday", etc.
  hourDisplay: string; // Formatted time like "2 PM"
}

export interface BlockedDomainHeatmapResponse {
  heatmapData: BlockedDomainHeatmapItem[];
  peakActivity: ActivityPoint;
  lowActivity: ActivityPoint;
}

export type TimeframeOption = "daily" | "weekly" | "monthly";

export interface BlockedDomainHeatmapParams {
  period: TimeframeOption; // "daily" | "weekly" | "monthly"
  startDate?: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
}

// Additional domain-related types can be added below as needed
export interface DomainMetrics {
  totalBlocked: number;
  uniqueDomains: number;
  topCategories: Array<{
    name: string;
    count: number;
  }>;
}

export interface DomainDetails {
  id: string;
  domain: string;
  category: string;
  firstSeen: string;
  lastSeen: string;
  blockCount: number;
  isWhitelisted: boolean;
}

export interface TopBlockedDomain {
  domain: string;
  count: number;
  percentage: number;
  category: string;
}

export interface TopBlockedDomainsResponse {
  topBlockedDomains: TopBlockedDomain[];
  totalAttempts: number;
}

export type DomainStatus =
  | "blocked"
  | "allowed"
  | "whitelisted"
  | "blacklisted";

export interface DomainTrendItem {
  date: string; // Date string in YYYY-MM-DD format
  count: number; // Number of blocked attempts
  categories: Record<string, number>; // Category counts for this date
}

export interface BlockedDomainTrendsResponse {
  trends: DomainTrendItem[]; // Array of trend data points
  totalAttempts: number; // Total blocked attempts in the period
  averagePerDay: number; // Average blocked attempts per day
  trendDirection: "increasing" | "decreasing" | "stable"; // Overall trend direction
  percentageChange: number; // Percentage change compared to previous period
}

export interface BlockedDomainTrendsParams {
  period: TimeframeOption; // "daily" | "weekly" | "monthly"
  startDate: string; // Start date in YYYY-MM-DD format
  endDate: string; // End date in YYYY-MM-DD format
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

export interface BrowserBreakdown {
  browser: string;
  count: number;
  percentage: number;
}

export interface BlockedDomainSummaryResponse {
  totalBlockedAttempts: number;
  uniqueBlockedDomains: number;
  uniqueDevicesBlocked: number;
  categoryBreakdown: CategoryBreakdown[];
  browserBreakdown: BrowserBreakdown[];
}

export interface NormalizedBrowserBreakdown extends Omit<BrowserBreakdown, 'browser'> {
  browser: string;
  normalizedName: string;
}

export interface NormalizedCategoryBreakdown extends Omit<CategoryBreakdown, 'category'> {
  category: string;
  normalizedName: string;
}
