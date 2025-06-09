"use client";

import { Shield, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopBlockedApps } from "@/hooks/useTopBlockedApps";

const DEFAULT_ICON = "/images/application.png";
const VALID_ICON_DOMAINS = [
  "play-lh.googleusercontent.com",
  "lh3.googleusercontent.com",
];

// Function to validate if the URL is from a trusted domain
const getValidIconUrl = (url: string): string => {
  if (!url) return DEFAULT_ICON;
  try {
    const urlObj = new URL(url);
    return VALID_ICON_DOMAINS.includes(urlObj.hostname) ? url : DEFAULT_ICON;
  } catch {
    return DEFAULT_ICON;
  }
};

const CategoryColors: Record<string, string> = {
  Social: "#6366F1",
  Casino: "#F59E0B",
  Dating: "#EC4899",
  Entertainment: "#8B5CF6",
  Games: "#10B981",
  Browser: "#3B82F6",
  Normal: "#6B7280",
};

const getCategoryColor = (category: string) => {
  return CategoryColors[category] || "#6B7280";
};

export function TopBlockedApps() {
  const [showAllApps, setShowAllApps] = useState(false);
  const { data, isLoading, error, refetch } = useTopBlockedApps(10);

  // Handle image error
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src = DEFAULT_ICON;
    },
    [],
  );

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    const errorMessage =
      typeof error === "string" ? error : "An unknown error occurred";

    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
        <ShieldAlert className="mb-2 h-8 w-8 text-red-500" />
        <h4 className="font-medium text-red-700 dark:text-red-300">
          Error Loading Data
        </h4>
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data?.topBlockedApps?.length) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800/50">
        <Shield className="mb-2 h-8 w-8 text-gray-400" />
        <h4 className="font-medium text-gray-700 dark:text-gray-300">
          No Blocked Apps
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No blocked apps found in the selected time period.
        </p>
      </div>
    );
  }

  const appsToShow = showAllApps
    ? data.topBlockedApps
    : data.topBlockedApps.slice(0, 5);

  return (
    <Card className="h-full border-0">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Top 10 blocked apps by access attempts
            </p>
          </div>
          <div className="flex items-center gap-1 rounded bg-red-50 px-3 py-1 dark:bg-red-900/20">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <span className="font-medium text-red-600 dark:text-red-400">
              {data.totalAttempts.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {appsToShow.map((app) => (
            <div
              key={app.appName}
              className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-8 w-8 overflow-hidden rounded-md">
                    <Image
                      src={getValidIconUrl(app.iconUrl)}
                      alt={app.appName}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                      onError={handleImageError}
                      unoptimized={
                        !app.iconUrl ||
                        !VALID_ICON_DOMAINS.some((domain) =>
                          app.iconUrl?.includes(domain),
                        )
                      }
                    />
                  </div>
                  <div>
                    <div className="font-medium">{app.appName}</div>
                    <div
                      className="text-xs text-muted-foreground"
                      style={{ color: getCategoryColor(app.category) }}
                    >
                      {app.category}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {app.count.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {app.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${app.percentage}%`,
                    backgroundColor: getCategoryColor(app.category),
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {data.topBlockedApps.length > 5 && (
          <button
            onClick={() => setShowAllApps(!showAllApps)}
            className="mt-4 w-full rounded-md border border-blue-200 py-2 text-sm text-blue-500 transition-colors hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            {showAllApps ? "Show Less" : "Show All Apps"}
          </button>
        )}
      </CardContent>
    </Card>
  );
}

export default TopBlockedApps;
