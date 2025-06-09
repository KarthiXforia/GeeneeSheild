// src/hooks/useDeviceStatus.ts
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/lib/api/client";
import { fetchDeviceStatus } from "@/lib/api/device";
import { useDeviceStatusStore } from "@/store/deviceStatusStore";

// Define query key for reuse in prefetching
export const DEVICE_STATUS_QUERY_KEY = ["deviceStatus"];

export function useDeviceStatus() {
  // Removed unused queryClient declaration

  // Use the store to check if we have data and to update it
  const store = useDeviceStatusStore();

  // Use a ref to track if we've already updated the store in this render cycle
  const hasUpdatedStore = useRef(false);

  // For request cancellation
  const cancelTokenRef = useRef<AbortController | null>(null);

  // Determine if we have fresh cached data
  const isFresh =
    store.lastUpdated && Date.now() - store.lastUpdated < 60 * 60 * 1000;

  const query = useQuery({
    queryKey: DEVICE_STATUS_QUERY_KEY,
    queryFn: async () => {
      // Cancel previous request if it exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.abort();
      }

      // Create new cancel token
      const controller = new AbortController();
      cancelTokenRef.current = controller;

      try {
        return await fetchDeviceStatus({ signal: controller.signal });
      } catch (error) {
        const apiError = error as ApiError;
        throw new Error(apiError.message || "Failed to fetch device status");
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    // Use the cached data if it's fresh, otherwise fetch new data
    initialData: isFresh ? store.statusData : undefined,
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
      JSON.stringify(query.data) !== JSON.stringify(store.statusData)
    ) {
      hasUpdatedStore.current = true;
      store.setStatusData(query.data);
    }

    // Reset the flag when query changes
    return () => {
      hasUpdatedStore.current = false;
    };
  }, [query.data, query.isLoading, store]);

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

  return query;
}

// Custom hook for prefetching
export function usePrefetchDeviceStatus() {
  const queryClient = useQueryClient();

  // Return a function that can be called to prefetch data
  return () => {
    return queryClient.prefetchQuery({
      queryKey: DEVICE_STATUS_QUERY_KEY,
      queryFn: () => fetchDeviceStatus({}),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
}
