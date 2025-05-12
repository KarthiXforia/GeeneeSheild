"use client";

import { Shield, ShieldAlert } from "lucide-react";
import { useState } from "react";

// Sample data for blocked domains
const blockedDomainsData = {
  total: 12487,
  top: [
    { domain: "youtube.com", count: 2134, percentage: 17.1 },
    { domain: "facebook.com", count: 1876, percentage: 15.0 },
    { domain: "instagram.com", count: 1523, percentage: 12.2 },
    { domain: "tiktok.com", count: 1245, percentage: 10.0 },
    { domain: "twitter.com", count: 987, percentage: 7.9 },
    { domain: "reddit.com", count: 876, percentage: 7.0 },
    { domain: "snapchat.com", count: 679, percentage: 5.4 },
    { domain: "other", count: 3167, percentage: 25.4 },
  ],
  change: +8.4, // Percentage change from previous period
};

export default function BlockedDomains() {
  const [showAllDomains, setShowAllDomains] = useState(false);

  // Limit display to top 5 domains initially
  const domainsToShow = showAllDomains
    ? blockedDomainsData.top
    : blockedDomainsData.top.slice(0, 5);

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold">Blocked Domains</h4>
            <p className="text-sm text-muted-foreground">
              Top blocked domains by access attempts
            </p>
          </div>
          <div className="flex items-center gap-1 rounded bg-red-50 px-3 py-1 dark:bg-red-900/20">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <span className="font-medium text-red-600 dark:text-red-400">
              {blockedDomainsData.total.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="mt-1 flex items-center">
          <span className="text-sm text-muted-foreground">
            Total blocked attempts
          </span>
          <div
            className={`ml-2 text-xs font-medium ${blockedDomainsData.change > 0 ? "text-red-500" : "text-green-500"}`}
          >
            {blockedDomainsData.change > 0 ? "↑" : "↓"}{" "}
            {Math.abs(blockedDomainsData.change)}%
          </div>
        </div>
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
                {domain.count.toLocaleString()} ({domain.percentage}%)
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
      {blockedDomainsData.top.length > 5 && (
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
