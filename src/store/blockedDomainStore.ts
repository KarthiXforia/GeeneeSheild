// src/store/blockedDomainStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { TimeframeOption } from "@/types/device";
import type {
  BlockedDomainHeatmapResponse,
  BlockedDomainTrendsParams,
  BlockedDomainTrendsResponse,
  BlockedDomainSummaryResponse,
} from "@/types/domains";

// Define the transformed data structure for top blocked domains
export interface TopBlockedDomain {
  domain: string;
  count: number;
  percentage: number;
  category: string;
}

export interface TopBlockedDomainsData {
  topBlockedDomains: TopBlockedDomain[];
  totalAttempts: number;
  change: number;
}

interface BlockedDomainState {
  // Heatmap related state
  heatmapData: BlockedDomainHeatmapResponse | null;
  timeframe: TimeframeOption;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;

  // Top blocked domains state
  topBlockedDomains: {
    data: TopBlockedDomainsData | null;
    lastUpdated: number | null;
    isLoading: boolean;
    error: string | null;
  };

  // Trends state
  trends: {
    data: BlockedDomainTrendsResponse | null;
    params: Omit<BlockedDomainTrendsParams, "startDate" | "endDate"> | null;
    lastUpdated: number | null;
    isLoading: boolean;
    error: string | null;
  };

  // Heatmap actions
  setHeatmapData: (data: BlockedDomainHeatmapResponse) => void;
  setTimeframe: (timeframe: TimeframeOption) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  isDataFresh: () => boolean;

  // Top blocked domains actions
  setTopBlockedDomains: (data: TopBlockedDomainsData) => void;
  setTopBlockedDomainsLoading: (isLoading: boolean) => void;
  setTopBlockedDomainsError: (error: string | null) => void;
  isTopBlockedDomainsFresh: () => boolean;

  // Trends actions
  setTrendsData: (
    data: BlockedDomainTrendsResponse,
    params: Omit<BlockedDomainTrendsParams, "startDate" | "endDate">,
  ) => void;
  setTrendsLoading: (isLoading: boolean) => void;
  setTrendsError: (error: string | null) => void;
  isTrendsDataFresh: () => boolean;

  // Summary state
  summary: {
    data: BlockedDomainSummaryResponse | null;
    lastUpdated: number | null;
    isLoading: boolean;
    error: string | null;
    isFresh: boolean;
  };

  // Summary actions
  setSummaryData: (data: BlockedDomainSummaryResponse) => void;
  setSummaryLoading: (isLoading: boolean) => void;
  setSummaryError: (error: string | null) => void;
  isSummaryFresh: () => boolean;
}

export const useBlockedDomainStore = create<BlockedDomainState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        heatmapData: null,
        timeframe: "daily",
        isLoading: false,
        error: null,
        lastUpdated: null,

        topBlockedDomains: {
          data: null,
          lastUpdated: null,
          isLoading: false,
          error: null,
        },

        trends: {
          data: null,
          params: null,
          lastUpdated: null,
          isLoading: false,
          error: null,
        },

        // Summary initial state
        summary: {
          data: null,
          lastUpdated: null,
          isLoading: false,
          error: null,
          isFresh: false,
        },

        // Heatmap actions
        setHeatmapData: (heatmapData) =>
          set({
            heatmapData,
            error: null,
            lastUpdated: Date.now(),
          }),
        setTimeframe: (timeframe) => {
          if (get().timeframe !== timeframe) {
            set({ timeframe });
          }
        },
        setLoading: (isLoading) => {
          if (get().isLoading !== isLoading) {
            set({ isLoading });
          }
        },
        setError: (error) => {
          if (get().error !== error) {
            set({ error, isLoading: false });
          }
        },
        isDataFresh: () => {
          const state = get();
          const ONE_HOUR = 60 * 60 * 1000;
          return Boolean(
            state.lastUpdated && Date.now() - state.lastUpdated < ONE_HOUR,
          );
        },

        // Top blocked domains actions
        setTopBlockedDomains: (data) => {
          set({
            topBlockedDomains: {
              ...get().topBlockedDomains,
              data,
              lastUpdated: Date.now(),
              error: null,
            },
          });
        },

        setTopBlockedDomainsLoading: (isLoading) => {
          const current = get().topBlockedDomains;
          if (current.isLoading !== isLoading) {
            set({
              topBlockedDomains: {
                ...current,
                isLoading,
              },
            });
          }
        },

        setTopBlockedDomainsError: (error) => {
          const current = get().topBlockedDomains;
          if (current.error !== error) {
            set({
              topBlockedDomains: {
                ...current,
                error,
                isLoading: false,
              },
            });
          }
        },

        isTopBlockedDomainsFresh: () => {
          const state = get();
          const ONE_HOUR = 60 * 60 * 1000;
          return Boolean(
            state.topBlockedDomains.lastUpdated &&
              Date.now() - state.topBlockedDomains.lastUpdated < ONE_HOUR,
          );
        },

        // Trends actions
        setTrendsData: (data, params) => {
          set({
            trends: {
              ...get().trends,
              data,
              params,
              lastUpdated: Date.now(),
              error: null,
            },
          });
        },

        setTrendsLoading: (isLoading) => {
          const current = get().trends;
          if (current.isLoading !== isLoading) {
            set({
              trends: {
                ...current,
                isLoading,
              },
            });
          }
        },

        setTrendsError: (error) => {
          const current = get().trends;
          if (current.error !== error) {
            set({
              trends: {
                ...current,
                error,
                isLoading: false,
              },
            });
          }
        },

        isTrendsDataFresh: () => {
          const state = get();
          const ONE_HOUR = 60 * 60 * 1000;
          return Boolean(
            state.trends.lastUpdated &&
              Date.now() - state.trends.lastUpdated < ONE_HOUR,
          );
        },

        // Summary actions
        setSummaryData: (data) =>
          set((state) => {
            // Only update if data has actually changed
            if (JSON.stringify(state.summary.data) === JSON.stringify(data)) {
              return state;
            }
            return {
              summary: {
                ...state.summary,
                data,
                lastUpdated: Date.now(),
                isLoading: false,
                error: null,
                isFresh: true,
              },
            };
          }),

        setSummaryLoading: (isLoading) =>
          set((state) => ({
            summary: {
              ...state.summary,
              isLoading,
            },
          })),

        setSummaryError: (error) =>
          set((state) => ({
            summary: {
              ...state.summary,
              error,
              isLoading: false,
            },
          })),

        isSummaryFresh: () => {
          const { lastUpdated } = get().summary;
          if (!lastUpdated) return false;
          const now = Date.now();
          // Consider data fresh for 5 minutes
          return now - lastUpdated < 5 * 60 * 1000;
        },
      }),
      {
        name: "blocked-domain-storage",
      },
    ),
  ),
);
