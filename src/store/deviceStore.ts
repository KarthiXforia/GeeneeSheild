// src/store/deviceStore.ts
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { DeviceMetrics } from "@/types/device";

interface DeviceState {
  metrics: DeviceMetrics | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  setMetrics: (metrics: DeviceMetrics) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearMetrics: () => void;
  isMetricsFresh: () => boolean;
}

export const useDeviceStore = create<DeviceState>()(
  devtools(
    persist(
      (set, get) => ({
        metrics: null,
        isLoading: false,
        error: null,
        lastUpdated: null,
        setMetrics: (metrics) =>
          set({
            metrics,
            error: null,
            lastUpdated: Date.now(),
          }),
        // Update these actions to prevent updates when value hasn't changed
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
        clearMetrics: () => set({ metrics: null, lastUpdated: null }),
        isMetricsFresh: () => {
          const state = get();
          const ONE_HOUR = 60 * 60 * 1000;
          return Boolean(
            state.lastUpdated && Date.now() - state.lastUpdated < ONE_HOUR,
          );
        },
      }),
      {
        name: "device-metrics-storage",
        storage: createJSONStorage(() => localStorage),
        // Only persist metrics and lastUpdated, not loading state or errors
        partialize: (state) => ({
          metrics: state.metrics,
          lastUpdated: state.lastUpdated,
        }),
      },
    ),
    { name: "Device Store" },
  ),
);
