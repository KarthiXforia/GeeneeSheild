// src/hooks/useBlockedAppsSummary.ts
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchBlockedAppSummary,
  fetchBlockedAppSummaryForSuspense,
} from "@/lib/api/apps";
import type { ApiError } from "@/lib/api/client";
import { useBlockedAppStore } from "@/store/blocked-apps-store";

// Define query key for reuse in prefetching
export const BLOCKED_APPS_SUMMARY_QUERY_KEY = ["blockedAppsSummary"];

export function useBlockedAppsSummary() {
  const store = useBlockedAppStore();
  const hasUpdatedStore = useRef(false);
  const cancelTokenRef = useRef<AbortController | null>(null);

  // Determine if we have fresh cached data (5 minutes)
  const isFresh = store.summary.lastUpdated
    ? Date.now() - store.summary.lastUpdated < 5 * 60 * 1000
    : false;

  const query = useQuery({
    queryKey: BLOCKED_APPS_SUMMARY_QUERY_KEY,
    queryFn: async () => {
      // Cancel previous request if it exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.abort();
      }

      // Create new cancel token
      const controller = new AbortController();
      cancelTokenRef.current = controller;

      try {
        return await fetchBlockedAppSummary({ signal: controller.signal });
      } catch (error) {
        const apiError = error as ApiError;
        // Convert to a format React Query can handle
        throw new Error(
          apiError.message || "Failed to fetch blocked apps summary",
        );
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Use the cached data if it's fresh, otherwise fetch new data
    initialData: isFresh && store.summary.data ? store.summary.data : undefined,
    // Control refetching on window focus
    refetchOnWindowFocus: !isFresh,
    // Don't refetch if we have fresh data
    refetchOnMount: !isFresh,
    // Add retry logic for transient failures
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Add background polling (15 minutes)
    refetchInterval: 15 * 60 * 1000,
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

  // Update store when data is loaded
  useEffect(() => {
    if (query.data && !hasUpdatedStore.current) {
      hasUpdatedStore.current = true;
      store.setSummaryData(query.data);
    }
  }, [query.data, store]);

  // Update loading state
  useEffect(() => {
    // Only update loading state if it's different from current state
    if (store.summary.isLoading !== query.isLoading) {
      store.setSummaryLoading(query.isLoading);
    }
  }, [query.isLoading, store]);

  // Update error state
  useEffect(() => {
    const errorMessage = query.error?.message || null;
    // Only update error state if there's an error and it's different
    if (errorMessage !== store.summary.error) {
      store.setSummaryError(errorMessage);
    }
  }, [query.error, store]);

  // Reset update flag when component unmounts
  useEffect(() => {
    return () => {
      hasUpdatedStore.current = false;
    };
  }, []);

  return {
    data: isFresh && store.summary.data ? store.summary.data : query.data,
    error: store.summary.error || query.error?.message || null,
    isLoading: isFresh ? store.summary.isLoading : query.isLoading,
  };
}

/**
 * Custom hook for prefetching blocked apps summary data
 * @returns Object with prefetch function
 */
export function usePrefetchBlockedAppsSummary() {
  const queryClient = useQueryClient();
  const store = useBlockedAppStore();

  const prefetchBlockedAppsSummary = async () => {
    // Only prefetch if we don't have fresh data
    if (!store.summary.isFresh) {
      await queryClient.prefetchQuery({
        queryKey: BLOCKED_APPS_SUMMARY_QUERY_KEY,
        queryFn: fetchBlockedAppSummaryForSuspense,
      });
    }
  };

  return { prefetchBlockedAppsSummary };
}
