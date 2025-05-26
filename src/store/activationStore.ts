// src/store/activationStore.ts
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type {
  ActivationTimelineResponse,
  TimeframeOption,
} from "@/types/device";

interface ActivationState {
  timelineData: ActivationTimelineResponse | null;
  timeframe: TimeframeOption;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  setTimelineData: (data: ActivationTimelineResponse) => void;
  setTimeframe: (timeframe: TimeframeOption) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
  isDataFresh: () => boolean;
}

export const useActivationStore = create<ActivationState>()(
  devtools(
    persist(
      (set, get) => ({
        timelineData: null,
        timeframe: "daily",
        isLoading: false,
        error: null,
        lastUpdated: null,
        setTimelineData: (timelineData) =>
          set({
            timelineData,
            error: null,
            lastUpdated: Date.now(),
          }),
        setTimeframe: (timeframe) => {
          // Only update if the timeframe has changed
          if (get().timeframe !== timeframe) {
            set({ timeframe });
          }
        },
        setLoading: (isLoading) => {
          // Only update if the value has changed
          if (get().isLoading !== isLoading) {
            set({ isLoading });
          }
        },
        setError: (error) => {
          // Only update if the error has changed
          if (get().error !== error) {
            set({ error, isLoading: false });
          }
        },
        clearData: () => set({ timelineData: null, lastUpdated: null }),
        isDataFresh: () => {
          const state = get();
          const ONE_HOUR = 60 * 60 * 1000;
          return Boolean(
            state.lastUpdated && Date.now() - state.lastUpdated < ONE_HOUR,
          );
        },
      }),
      {
        name: "activation-timeline-storage",
        storage: createJSONStorage(() => localStorage),
        // Only persist timeline data, timeframe and lastUpdated, not loading state or errors
        partialize: (state) => ({
          timelineData: state.timelineData,
          timeframe: state.timeframe,
          lastUpdated: state.lastUpdated,
        }),
      },
    ),
    { name: "Activation Store" },
  ),
);
