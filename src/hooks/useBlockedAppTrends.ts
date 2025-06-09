import { format, subDays, subMonths, subWeeks } from "date-fns";
import { useEffect, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBlockedAppTrends } from "@/lib/api/apps";
import type { ApiError } from "@/lib/api/client";
import { useBlockedAppStore } from "@/store/blocked-apps-store";
import type { BlockedAppTrendsParams, TimeframeOption } from "@/types/apps";

// Define query key for reuse in prefetching
export const BLOCKED_APP_TRENDS_QUERY_KEY = ["blockedAppTrends"];

/**
 * Calculate date range based on timeframe
 * - daily: last 7 days
 * - weekly: last 7 weeks
 * - monthly: last 7 months
 */
export function getDateRangeForTimeframe(timeframe: TimeframeOption): {
  startDate: string;
  endDate: string;
} {
  const today = new Date();
  const endDate = format(today, "yyyy-MM-dd");

  let startDate: string;

  switch (timeframe) {
    case "daily":
      startDate = format(subDays(today, 6), "yyyy-MM-dd"); // 6 days back + today = 7 days
      break;
    case "weekly":
      startDate = format(subWeeks(today, 6), "yyyy-MM-dd"); // 6 weeks back + current week = 7 weeks
      break;
    case "monthly":
      startDate = format(subMonths(today, 6), "yyyy-MM-dd"); // 6 months back + current month = 7 months
      break;
    default:
      startDate = format(subDays(today, 6), "yyyy-MM-dd");
  }

  return { startDate, endDate };
}

export function useBlockedAppTrends({
  period,
  startDate: customStartDate,
  endDate: customEndDate,
}: BlockedAppTrendsParams) {
  const store = useBlockedAppStore();
  const cancelTokenRef = useRef<AbortController | null>(null);

  // Calculate date range based on timeframe if not provided
  const { startDate, endDate } = useMemo(() => {
    if (customStartDate && customEndDate) {
      return { startDate: customStartDate, endDate: customEndDate };
    }
    return getDateRangeForTimeframe(period);
  }, [period, customStartDate, customEndDate]);

  // UPDATED: Simplified freshness check - only check period
  const isFresh = useMemo(() => {
    return store.isTrendsFresh(period); // Only pass period
  }, [store, period]);

  const query = useQuery({
    queryKey: [...BLOCKED_APP_TRENDS_QUERY_KEY, period, startDate, endDate],
    queryFn: async () => {
      // Cancel previous request if it exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.abort();
      }

      // Create new cancel token
      const controller = new AbortController();
      cancelTokenRef.current = controller;

      try {
        store.setTrendsLoading(true);
        const data = await fetchBlockedAppTrends(
          { period, startDate, endDate },
          { signal: controller.signal },
        );
        // FIXED: Only pass period to store
        store.setTrendsData(data, { period });
        return data;
      } catch (error) {
        const apiError = error as ApiError;
        store.setTrendsError(
          apiError.message || "Failed to fetch blocked app trends",
        );
        throw error;
      } finally {
        store.setTrendsLoading(false);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: !isFresh, // Only fetch if data is not fresh
    refetchOnWindowFocus: false,
    refetchOnMount: !isFresh,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.abort();
      }
    };
  }, []);

  // Set initial loading state
  useEffect(() => {
    if (isFresh && store.trends.data) {
      // If data is fresh, we're not loading
      if (store.trends.isLoading) {
        store.setTrendsLoading(false);
      }
    }
  }, [
    isFresh,
    store.trends.data,
    store.trends.isLoading,
    store.setTrendsLoading,
    store,
  ]);

  return {
    data: isFresh ? store.trends.data : query.data,
    error: store.trends.error || query.error,
    isLoading: isFresh ? store.trends.isLoading : query.isLoading,
    startDate,
    endDate,
    // Add any additional derived data here if needed
    totalAttempts:
      (isFresh
        ? store.trends.data?.totalAttempts
        : query.data?.totalAttempts) || 0,
    averagePerDay:
      (isFresh
        ? store.trends.data?.averagePerDay
        : query.data?.averagePerDay) || 0,
    trendDirection:
      (isFresh
        ? store.trends.data?.trendDirection
        : query.data?.trendDirection) || "stable",
    percentageChange:
      (isFresh
        ? store.trends.data?.percentageChange
        : query.data?.percentageChange) || 0,
  };
}

// Custom hook for prefetching
export function usePrefetchBlockedAppTrends() {
  const queryClient = useQueryClient();

  return (params: BlockedAppTrendsParams) => {
    const { startDate, endDate } = getDateRangeForTimeframe(params.period);

    return queryClient.prefetchQuery({
      queryKey: [
        ...BLOCKED_APP_TRENDS_QUERY_KEY,
        params.period,
        startDate,
        endDate,
      ],
      queryFn: () =>
        fetchBlockedAppTrends(
          {
            period: params.period,
            startDate: params.startDate || startDate,
            endDate: params.endDate || endDate,
          },
          {},
        ),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
}
