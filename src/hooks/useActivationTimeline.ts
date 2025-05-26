// src/hooks/useActivationTimeline.ts
import { format, subDays, subMonths, subWeeks } from "date-fns";
import { useEffect, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/lib/api/client";
import { fetchActivationTimeline } from "@/lib/api/device";
import { useActivationStore } from "@/store/activationStore";
import type { TimeframeOption } from "@/types/device";

// Define query key for reuse in prefetching
export const ACTIVATION_TIMELINE_QUERY_KEY = ["activationTimeline"];

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
      // Get last 7 days
      startDate = format(subDays(today, 6), "yyyy-MM-dd"); // 6 days back + today = 7 days
      break;
    case "weekly":
      // Get last 7 weeks
      startDate = format(subWeeks(today, 6), "yyyy-MM-dd"); // 6 weeks back + current week = 7 weeks
      break;
    case "monthly":
      // Get last 7 months
      startDate = format(subMonths(today, 6), "yyyy-MM-dd"); // 6 months back + current month = 7 months
      break;
    default:
      startDate = format(subDays(today, 6), "yyyy-MM-dd");
  }

  return { startDate, endDate };
}

export function useActivationTimeline({
  period,
  customStartDate,
  customEndDate,
}: {
  period: TimeframeOption;
  customStartDate?: string;
  customEndDate?: string;
}) {
  // Removed unused queryClient declaration

  // Use the store to check if we have data and to update it
  const store = useActivationStore();

  // Calculate date range based on timeframe if not provided
  const { startDate, endDate } = useMemo(() => {
    if (customStartDate && customEndDate) {
      return { startDate: customStartDate, endDate: customEndDate };
    }
    return getDateRangeForTimeframe(period);
  }, [period, customStartDate, customEndDate]);

  // Use a ref to track if we've already updated the store in this render cycle
  const hasUpdatedStore = useRef(false);

  // For request cancellation
  const cancelTokenRef = useRef<AbortController | null>(null);

  // Determine if we have fresh cached data and same timeframe
  const isFresh =
    store.lastUpdated &&
    Date.now() - store.lastUpdated < 60 * 60 * 1000 &&
    store.timeframe === period;

  const query = useQuery({
    queryKey: [...ACTIVATION_TIMELINE_QUERY_KEY, period, startDate, endDate],
    queryFn: async () => {
      // Cancel previous request if it exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.abort();
      }

      // Create new cancel token
      const controller = new AbortController();
      cancelTokenRef.current = controller;

      try {
        return await fetchActivationTimeline(
          { period, startDate, endDate },
          { signal: controller.signal },
        );
      } catch (error) {
        const apiError = error as ApiError;
        throw new Error(
          apiError.message || "Failed to fetch activation timeline",
        );
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    // Use the cached data if it's fresh and same timeframe, otherwise fetch new data
    initialData: isFresh ? store.timelineData : undefined,
    // Control refetching on window focus
    refetchOnWindowFocus: !isFresh,
    // Don't refetch if we have fresh data
    refetchOnMount: !isFresh,
    // Add retry logic for transient failures
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Add background polling (conservative interval)
    refetchInterval: 1000 * 60 * 15, // 15 minutes
    refetchIntervalInBackground: true,
  });

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.abort();
      }
    };
  }, []);

  // Use an effect to update the store AFTER render, not during
  useEffect(() => {
    // Only update store if:
    // 1. We have successful data
    // 2. We haven't already updated in this render cycle
    // 3. The data is different from what's in the store
    if (
      query.data &&
      !query.isLoading &&
      !hasUpdatedStore.current &&
      JSON.stringify(query.data) !== JSON.stringify(store.timelineData)
    ) {
      hasUpdatedStore.current = true;
      store.setTimelineData(query.data);

      // Also update the timeframe in the store
      if (store.timeframe !== period) {
        store.setTimeframe(period);
      }
    }

    // Reset the flag when query changes
    return () => {
      hasUpdatedStore.current = false;
    };
  }, [query.data, query.isLoading, store, period]);

  // Update loading and error states
  useEffect(() => {
    // Only update loading state if it's different from current state
    if (store.isLoading !== query.isLoading) {
      store.setLoading(query.isLoading);
    }

    // Only update error state if there's an error and it's different
    if (
      query.error &&
      (!store.error || store.error !== query.error.toString())
    ) {
      store.setError(
        query.error instanceof Error
          ? query.error.message
          : "An unknown error occurred",
      );
    }
  }, [query.isLoading, query.error, store]);

  return { ...query, startDate, endDate };
}

// Custom hook for prefetching
export function usePrefetchActivationTimeline() {
  const queryClient = useQueryClient();

  // Return a function that can be called to prefetch data
  return (params: {
    period: TimeframeOption;
    customStartDate?: string;
    customEndDate?: string;
  }) => {
    const { startDate, endDate } = getDateRangeForTimeframe(params.period);

    return queryClient.prefetchQuery({
      queryKey: [
        ...ACTIVATION_TIMELINE_QUERY_KEY,
        params.period,
        startDate,
        endDate,
      ],
      queryFn: () =>
        fetchActivationTimeline(
          {
            period: params.period,
            startDate: params.customStartDate || startDate,
            endDate: params.customEndDate || endDate,
          },
          {},
        ),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
}
