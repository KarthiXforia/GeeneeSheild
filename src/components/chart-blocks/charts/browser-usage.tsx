"use client";

import { Chrome, Globe, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Sample data for browser usage
const browserUsageData = {
  total: 45678,
  browsers: [
    {
      name: "Samsung Browser",
      count: 21345,
      percentage: 46.7,
      icon: Smartphone,
    },
    { name: "Chrome", count: 18976, percentage: 41.5, icon: Chrome },
    { name: "Knox Browser", count: 3456, percentage: 7.6, icon: Globe },
    { name: "Others", count: 1901, percentage: 4.2, icon: Globe },
  ],
  byDeviceMode: {
    kioskMode: {
      primary: "Knox Browser",
      percentage: 78.3,
    },
    regularMode: {
      primary: "Samsung Browser",
      percentage: 62.1,
    },
  },
};

type BrowserCardProps = {
  name: string;
  count: number;
  percentage: number;
  Icon: LucideIcon;
  isKioskPrimary?: boolean;
  isRegularPrimary?: boolean;
};

function BrowserCard({
  name,
  count,
  percentage,
  Icon,
  isKioskPrimary,
  isRegularPrimary,
}: BrowserCardProps) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
      <div className="mb-2 flex justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-indigo-500" />
          <span className="font-medium">{name}</span>
          {isKioskPrimary && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              Kiosk Primary
            </span>
          )}
          {isRegularPrimary && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-300">
              Regular Primary
            </span>
          )}
        </div>
        <span className="text-sm">
          {count.toLocaleString()} ({percentage}%)
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-2.5 rounded-full bg-indigo-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function BrowserUsage() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h4 className="text-lg font-semibold">Browser Usage</h4>
        <p className="text-sm text-muted-foreground">
          Browser distribution across {browserUsageData.total.toLocaleString()}{" "}
          sessions
        </p>
      </div>

      {/* Browser usage bar chart placeholder - replace with VisActor chart */}
      <div className="mb-6 space-y-3">
        {browserUsageData.browsers.map((browser) => (
          <BrowserCard
            key={browser.name}
            name={browser.name}
            count={browser.count}
            percentage={browser.percentage}
            Icon={browser.icon}
            isKioskPrimary={
              browser.name === browserUsageData.byDeviceMode.kioskMode.primary
            }
            isRegularPrimary={
              browser.name === browserUsageData.byDeviceMode.regularMode.primary
            }
          />
        ))}
      </div>

      {/* Usage by device mode */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h5 className="mb-2 font-medium">Kiosk Mode</h5>
          <div>
            <p className="text-2xl font-bold">
              {browserUsageData.byDeviceMode.kioskMode.primary}
            </p>
            <p className="text-sm text-muted-foreground">
              Primary browser (
              {browserUsageData.byDeviceMode.kioskMode.percentage}% of kiosk
              devices)
            </p>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h5 className="mb-2 font-medium">Regular Mode</h5>
          <div>
            <p className="text-2xl font-bold">
              {browserUsageData.byDeviceMode.regularMode.primary}
            </p>
            <p className="text-sm text-muted-foreground">
              Primary browser (
              {browserUsageData.byDeviceMode.regularMode.percentage}% of regular
              devices)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
