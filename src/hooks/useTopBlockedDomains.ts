// src/hooks/useTopBlockedDomains.ts
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/lib/api/client";
import { fetchTopBlockedDomains } from "@/lib/api/domains";
import {
  type TopBlockedDomainsData,
  useBlockedDomainStore,
} from "@/store/blockedDomainStore";
import type { TopBlockedDomainsResponse } from "@/types/domains";

export const TOP_BLOCKED_DOMAINS_QUERY_KEY = ["topBlockedDomains"];

export function useTopBlockedDomains(limit: number = 10) {
  const store = useBlockedDomainStore();
  const cancelTokenRef = useRef<AbortController | null>(null);

  // Check if we have fresh data (less than 1 hour old)
  const isFresh =
    store.topBlockedDomains.lastUpdated &&
    Date.now() - store.topBlockedDomains.lastUpdated < 60 * 60 * 1000;

  const query = useQuery<
    TopBlockedDomainsResponse,
    Error,
    TopBlockedDomainsData
  >({
    queryKey: [...TOP_BLOCKED_DOMAINS_QUERY_KEY, limit],
    queryFn: async (): Promise<TopBlockedDomainsResponse> => {
      // Cancel previous request if it exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.abort();
      }

      const controller = new AbortController();
      cancelTokenRef.current = controller;

      try {
        store.setTopBlockedDomainsLoading(true);
        const data = await fetchTopBlockedDomains(limit, {
          signal: controller.signal,
        });

        // Transform the API response to match our component's expected format
        const transformedData: TopBlockedDomainsData = {
          topBlockedDomains: (data.topBlockedDomains || []).map((domain) => ({
            domain: domain.domain,
            count: domain.count,
            percentage: domain.percentage || 0,
            category: domain.category || "No Category",
          })),
          totalAttempts: data.totalAttempts || 0,
          change: 0, // No change data in API
        };

        // Update store with transformed data
        store.setTopBlockedDomains(transformedData);
        return transformedData;
      } catch (error) {
        const apiError = error as ApiError;
        store.setTopBlockedDomainsError(
          apiError.message || "Failed to fetch top blocked domains",
        );
        throw new Error(
          apiError.message || "Failed to fetch top blocked domains",
        );
      } finally {
        store.setTopBlockedDomainsLoading(false);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    initialData: isFresh
      ? (store.topBlockedDomains.data as TopBlockedDomainsResponse)
      : undefined,
    refetchOnWindowFocus: !isFresh,
    refetchOnMount: !isFresh,
    retry: 3,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.abort();
      }
    };
  }, []);

  return {
    data: query.data,
    isLoading: query.isLoading || store.topBlockedDomains.isLoading,
    error: query.error?.message || store.topBlockedDomains.error,
    refetch: query.refetch,
  };
}
