// src/hooks/useTopBlockedApps.ts
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchTopBlockedApps,
  fetchTopBlockedAppsForSuspense,
} from "@/lib/api/apps";
import type { ApiError } from "@/lib/api/client";
import { useBlockedAppStore } from "@/store/blocked-apps-store";

export const TOP_BLOCKED_APPS_QUERY_KEY = ["topBlockedApps"];

export function useTopBlockedApps(limit: number = 10) {
  const store = useBlockedAppStore();
  const hasUpdatedStore = useRef(false);
  const cancelTokenRef = useRef<AbortController | null>(null);

  // Determine if we have fresh cached data (5 minutes)
  const isFresh = store.topBlockedApps.lastUpdated
    ? Date.now() - store.topBlockedApps.lastUpdated < 5 * 60 * 1000
    : false;

  const query = useQuery({
    queryKey: [...TOP_BLOCKED_APPS_QUERY_KEY, limit],
    queryFn: async () => {
      // Cancel previous request if it exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.abort();
      }

      // Create new cancel token
      const controller = new AbortController();
      cancelTokenRef.current = controller;

      try {
        return await fetchTopBlockedApps(limit, { signal: controller.signal });
      } catch (error) {
        const apiError = error as ApiError;
        throw new Error(apiError.message || "Failed to fetch top blocked apps");
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    initialData: isFresh ? store.topBlockedApps.data : undefined,
    refetchOnWindowFocus: !isFresh,
    refetchOnMount: !isFresh,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchInterval: 15 * 60 * 1000, // 15 minutes
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
      store.setTopBlockedAppsData(query.data);
    }
  }, [query.data, store]);

  // Update loading state
  useEffect(() => {
    if (store.topBlockedApps.isLoading !== query.isLoading) {
      store.setTopBlockedAppsLoading(query.isLoading);
    }
  }, [query.isLoading, store]);

  // Update error state
  useEffect(() => {
    const errorMessage = query.error?.message || null;
    if (errorMessage !== store.topBlockedApps.error) {
      store.setTopBlockedAppsError(errorMessage);
    }
  }, [query.error, store]);

  // Reset update flag when component unmounts
  useEffect(() => {
    return () => {
      hasUpdatedStore.current = false;
    };
  }, []);

  return {
    data: isFresh ? store.topBlockedApps.data : query.data,
    error: store.topBlockedApps.error || query.error?.message || null,
    isLoading: isFresh ? store.topBlockedApps.isLoading : query.isLoading,
    refetch: query.refetch,
  };
}

/**
 * Custom hook for prefetching top blocked apps data
 * @returns Object with prefetch function
 */
export function usePrefetchTopBlockedApps() {
  const queryClient = useQueryClient();
  const store = useBlockedAppStore();

  const prefetchTopBlockedApps = async (limit: number = 10) => {
    // Only prefetch if we don't have fresh data
    if (!store.isTopBlockedAppsFresh()) {
      await queryClient.prefetchQuery({
        queryKey: [...TOP_BLOCKED_APPS_QUERY_KEY, limit],
        queryFn: () => fetchTopBlockedAppsForSuspense(limit),
      });
    }
  };

  return { prefetchTopBlockedApps };
}
