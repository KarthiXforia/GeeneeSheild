// src/store/deviceStatusStore.ts
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { DeviceStatusResponse } from "@/types/device";

interface DeviceStatusState {
  statusData: DeviceStatusResponse | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  setStatusData: (data: DeviceStatusResponse) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
  isDataFresh: () => boolean;
}

export const useDeviceStatusStore = create<DeviceStatusState>()(
  devtools(
    persist(
      (set, get) => ({
        statusData: null,
        isLoading: false,
        error: null,
        lastUpdated: null,
        setStatusData: (statusData) =>
          set({
            statusData,
            error: null,
            lastUpdated: Date.now(),
          }),
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
        clearData: () => set({ statusData: null, lastUpdated: null }),
        isDataFresh: () => {
          const state = get();
          const ONE_HOUR = 60 * 60 * 1000;
          return Boolean(
            state.lastUpdated && Date.now() - state.lastUpdated < ONE_HOUR,
          );
        },
      }),
      {
        name: "device-status-storage",
        storage: createJSONStorage(() => localStorage),
        // Only persist status data and lastUpdated, not loading state or errors
        partialize: (state) => ({
          statusData: state.statusData,
          lastUpdated: state.lastUpdated,
        }),
      },
    ),
    { name: "Device Status Store" },
  ),
);
