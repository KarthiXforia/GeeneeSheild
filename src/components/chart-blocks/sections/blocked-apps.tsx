// src/components/chart-blocks/sections/blocked-apps.tsx
"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import Container from "@/components/container";
import { Skeleton } from "@/components/ui/skeleton";
import { RegionFilter } from "../components/region-filter";

// src/components/chart-blocks/sections/blocked-apps.tsx

// src/components/chart-blocks/sections/blocked-apps.tsx

// Loading component for the skeleton
function BlockedAppsLoading() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// Loading component for the top blocked apps chart
function TopBlockedAppsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

// Loading component for the blocked app trends chart
function BlockedAppTrendsLoading() {
  return (
    <div className="space-y-4">
      {/* Statistics cards skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      {/* Top categories skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="w-18 h-8 rounded-full" />
        </div>
      </div>
      {/* Chart skeleton */}
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  );
}

// Dynamically import the components with no SSR
const BlockedAppSummary = dynamic<unknown>(
  () =>
    import("@/components/chart-blocks/charts/blocked-app-summary").then(
      (mod) => mod.default,
    ),
  {
    ssr: false,
    loading: () => <BlockedAppsLoading />,
  },
);

const TopBlockedApps = dynamic<unknown>(
  () => import("../charts/top-blocked-apps"),
  {
    ssr: false,
    loading: () => <TopBlockedAppsLoading />,
  },
);

const BlockedAppTrend = dynamic<unknown>(
  () => import("../charts/blocked-app-trend"),
  {
    ssr: false,
    loading: () => <BlockedAppTrendsLoading />,
  },
);

export default function BlockedApps() {
  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="border-b border-border">
        <Container className="py-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Blocked Apps Summary</h3>
            <RegionFilter />
          </div>
          <div className="pb-8">
            <Suspense fallback={<BlockedAppsLoading />}>
              <BlockedAppSummary />
            </Suspense>
          </div>
        </Container>
      </div>

      {/* Trends Section */}
      <div className="border-b border-border">
        <Container className="py-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Blocked App Trends</h3>
            <RegionFilter />
          </div>
          <div className="pb-8">
            <Suspense fallback={<BlockedAppTrendsLoading />}>
              <BlockedAppTrend />
            </Suspense>
          </div>
        </Container>
      </div>

      {/* Top Blocked Apps Chart */}
      <div className="border-b border-border">
        <Container className="py-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">Top Blocked Applications</h3>
            <RegionFilter />
          </div>
          <div className="pb-8">
            <Suspense fallback={<TopBlockedAppsLoading />}>
              <TopBlockedApps />
            </Suspense>
          </div>
        </Container>
      </div>
    </div>
  );
}
