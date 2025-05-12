"use client";

import { Accessibility, ShieldAlert } from "lucide-react";
import { useState } from "react";
import {
  accessibilityPermissionsData,
  kioskWithAccessibilityData,
} from "@/data/customer-satisfication";

export default function AccessibilityPermissions() {
  const [showDetails, setShowDetails] = useState(false);

  // Data from our MDM data structures
  const { enabled, pending } = accessibilityPermissionsData;
  const {
    count: kioskWithAccessibility,
    percentage: kioskWithAccessibilityPercentage,
  } = kioskWithAccessibilityData;

  // Calculate total and percentages
  const total = enabled + pending;
  const enabledPercentage = Math.round((enabled / total) * 100);
  const pendingPercentage = Math.round((pending / total) * 100);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h4 className="text-lg font-semibold">Accessibility Permissions</h4>
        <p className="text-sm text-muted-foreground">
          Status of accessibility permissions across {total.toLocaleString()}{" "}
          devices
        </p>
      </div>

      {/* Donut chart placeholder - replace with VisActor chart */}
      <div className="my-4 flex justify-center">
        <div className="relative h-48 w-48">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold">{enabledPercentage}%</p>
              <p className="text-sm text-muted-foreground">Enabled</p>
            </div>
          </div>
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="15"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#22c55e"
              strokeWidth="15"
              strokeDasharray={`${enabledPercentage * 2.51} ${100 * 2.51}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <div className="mb-2 flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-green-500" />
            <h5 className="font-medium">Enabled</h5>
          </div>
          <p className="text-2xl font-bold">{enabled.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">
            {enabledPercentage}% of all devices
          </p>
        </div>

        <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
          <div className="mb-2 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-orange-500" />
            <h5 className="font-medium">Pending</h5>
          </div>
          <p className="text-2xl font-bold">{pending.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">
            {pendingPercentage}% of all devices
          </p>
        </div>
      </div>

      {/* Kiosk mode with accessibility data */}
      <div className="mt-6 rounded-lg border p-4">
        <h5 className="mb-2 font-medium">Kiosk Mode with Accessibility</h5>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">
              {kioskWithAccessibility.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Devices</p>
          </div>
          <div>
            <p className="text-xl font-bold text-blue-500">
              {kioskWithAccessibilityPercentage}%
            </p>
            <p className="text-sm text-muted-foreground">of kiosk devices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
