import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { TimeframeOption } from "@/types/apps";
import type {
  BlockedAppSummaryResponse,
  BlockedAppTrendsParams,
  BlockedAppTrendsResponse,
  TopBlockedAppsResponse,
} from "@/types/apps";

interface BlockedAppState {
  // Summary state
  summary: {
    data: BlockedAppSummaryResponse | null;
    lastUpdated: number | null;
    isLoading: boolean;
    error: string | null;
    isFresh: boolean;
  };

  // Top blocked apps state
  topBlockedApps: {
    data: TopBlockedAppsResponse | null;
    lastUpdated: number | null;
    isLoading: boolean;
    error: string | null;
    isFresh: boolean;
  };

  // Trends state - FIXED: Only store period, not full params
  trends: {
    data: BlockedAppTrendsResponse | null;
    lastUpdated: number | null;
    isLoading: boolean;
    error: string | null;
    isFresh: boolean;
    params: Omit<BlockedAppTrendsParams, "startDate" | "endDate"> | null; // Only period
  };

  // Summary actions
  setSummaryData: (data: BlockedAppSummaryResponse) => void;
  setSummaryLoading: (isLoading: boolean) => void;
  setSummaryError: (error: string | null) => void;
  isSummaryFresh: () => boolean;

  // Top blocked apps actions
  setTopBlockedAppsData: (data: TopBlockedAppsResponse) => void;
  setTopBlockedAppsLoading: (isLoading: boolean) => void;
  setTopBlockedAppsError: (error: string | null) => void;
  isTopBlockedAppsFresh: () => boolean;

  // Trends actions - FIXED: Only accept period
  setTrendsData: (
    data: BlockedAppTrendsResponse,
    params: Omit<BlockedAppTrendsParams, "startDate" | "endDate">, // Only period
  ) => void;
  setTrendsLoading: (isLoading: boolean) => void;
  setTrendsError: (error: string | null) => void;
  isTrendsFresh: (period: TimeframeOption) => boolean; // SIMPLIFIED: Only check period
  getCurrentTrendsParams: () => Omit<
    BlockedAppTrendsParams,
    "startDate" | "endDate"
  > | null;
}

export const useBlockedAppStore = create<BlockedAppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        summary: {
          data: null,
          lastUpdated: null,
          isLoading: false,
          error: null,
          isFresh: false,
        },
        topBlockedApps: {
          data: null,
          lastUpdated: null,
          isLoading: false,
          error: null,
          isFresh: false,
        },
        trends: {
          data: null,
          lastUpdated: null,
          isLoading: false,
          error: null,
          isFresh: false,
          params: null,
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
          // Consider data fresh for 5 minutes
          return Date.now() - lastUpdated < 5 * 60 * 1000;
        },

        // Top blocked apps actions
        setTopBlockedAppsData: (data) =>
          set((state) => {
            // Only update if data has actually changed
            if (
              JSON.stringify(state.topBlockedApps.data) === JSON.stringify(data)
            ) {
              return state;
            }
            return {
              topBlockedApps: {
                ...state.topBlockedApps,
                data,
                lastUpdated: Date.now(),
                isLoading: false,
                error: null,
                isFresh: true,
              },
            };
          }),

        setTopBlockedAppsLoading: (isLoading) =>
          set((state) => ({
            topBlockedApps: {
              ...state.topBlockedApps,
              isLoading,
            },
          })),

        setTopBlockedAppsError: (error) =>
          set((state) => ({
            topBlockedApps: {
              ...state.topBlockedApps,
              error,
              isLoading: false,
            },
          })),

        isTopBlockedAppsFresh: () => {
          const { lastUpdated } = get().topBlockedApps;
          if (!lastUpdated) return false;
          // Consider data fresh for 5 minutes
          return Date.now() - lastUpdated < 5 * 60 * 1000;
        },

        // Trends actions - FIXED: Option 1 implementation
        setTrendsData: (data, params) =>
          set((state) => {
            // Only update if data or params have actually changed
            if (
              JSON.stringify(state.trends.data) === JSON.stringify(data) &&
              JSON.stringify(state.trends.params) === JSON.stringify(params)
            ) {
              return state;
            }
            return {
              trends: {
                ...state.trends,
                data,
                params, // This will be { period: "daily" | "weekly" | "monthly" }
                lastUpdated: Date.now(),
                isLoading: false,
                error: null,
                isFresh: true,
              },
            };
          }),

        setTrendsLoading: (isLoading) =>
          set((state) => ({
            trends: {
              ...state.trends,
              isLoading,
            },
          })),

        setTrendsError: (error) =>
          set((state) => ({
            trends: {
              ...state.trends,
              error,
              isLoading: false,
            },
          })),

        // SIMPLIFIED: Only check period, dates calculated dynamically
        isTrendsFresh: (period) => {
          const { lastUpdated, params: savedParams } = get().trends;
          if (!lastUpdated || !savedParams) return false;

          // Only check if period matches (dates calculated fresh each time)
          const periodMatches = savedParams.period === period;

          if (!periodMatches) return false;

          // Consider data fresh for 1 hour (matching your domain pattern)
          return Date.now() - lastUpdated < 60 * 60 * 1000;
        },

        getCurrentTrendsParams: () => {
          return get().trends.params;
        },
      }),
      {
        name: "blocked-apps-storage",
        version: 3, // Increment version to handle store structure changes
      },
    ),
  ),
);
