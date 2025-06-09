"use client";

import { Loader2, Shield, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useTopBlockedDomains } from "@/hooks/useTopBlockedDomains";

export default function BlockedDomains() {
  const [showAllDomains, setShowAllDomains] = useState(false);
  const { data, isLoading, error, refetch } = useTopBlockedDomains(10);

  const domainsToShow = showAllDomains
    ? data?.topBlockedDomains || []
    : data?.topBlockedDomains?.slice(0, 5) || [];


  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading blocked domains...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
        <ShieldAlert className="mb-2 h-8 w-8 text-red-500" />
        <h4 className="font-medium text-red-700 dark:text-red-300">
          Error Loading Data
        </h4>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
        >
          Retry
        </button>
      </div>
    );
  }

  // No data state
  if (!data?.topBlockedDomains?.length) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800/50">
        <Shield className="mb-2 h-8 w-8 text-gray-400" />
        <h4 className="font-medium text-gray-700 dark:text-gray-300">
          No Blocked Domains
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No blocked domains found in the selected time period.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold">Blocked Domains</h4>
            <p className="text-sm text-muted-foreground">
              Top 10 blocked domains by access attempts
            </p>
          </div>
          <div className="flex items-center gap-1 rounded bg-red-50 px-3 py-1 dark:bg-red-900/20">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <span className="font-medium text-red-600 dark:text-red-400">
              {data.totalAttempts.toLocaleString()}
            </span>
          </div>
        </div>
        {/* <div className="mt-1 flex items-center">
          <span className="text-sm text-muted-foreground">
            Total blocked attempts
          </span>
          <div
            className={`ml-2 text-xs font-medium ${
              data.change > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {data.change > 0 ? "↑" : "↓"} {Math.abs(data.change)}%
          </div>
        </div> */}
      </div>

      {/* Blocked domains list */}
      <div className="space-y-3">
        {domainsToShow.map((domain) => (
          <div
            key={domain.domain}
            className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
          >
            <div className="mb-2 flex justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                <span className="font-medium">{domain.domain}</span>
              </div>
              <span className="text-sm">
                {domain.count.toLocaleString()} ({domain.percentage.toFixed(1)}
                %)
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2.5 rounded-full bg-red-500"
                style={{ width: `${domain.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more/less toggle */}
      {data.topBlockedDomains.length > 5 && (
        <button
          onClick={() => setShowAllDomains(!showAllDomains)}
          className="mt-4 w-full rounded-md border border-blue-200 py-2 text-sm text-blue-500 transition-colors hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          {showAllDomains ? "Show Less" : "Show All Domains"}
        </button>
      )}
    </div>
  );
}
