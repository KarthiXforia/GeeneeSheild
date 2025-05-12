"use client";

import { Calendar, Laptop, Tablet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data for activations over time
const activationTimeData = {
  daily: [
    { date: "2025-05-01", activations: 210, kioskSetup: 168 },
    { date: "2025-05-02", activations: 187, kioskSetup: 142 },
    { date: "2025-05-03", activations: 143, kioskSetup: 106 },
    { date: "2025-05-04", activations: 118, kioskSetup: 87 },
    { date: "2025-05-05", activations: 231, kioskSetup: 180 },
    { date: "2025-05-06", activations: 257, kioskSetup: 210 },
    { date: "2025-05-07", activations: 276, kioskSetup: 221 },
    { date: "2025-05-08", activations: 301, kioskSetup: 256 },
    { date: "2025-05-09", activations: 312, kioskSetup: 271 },
  ],
  weekly: [
    { date: "Week 1", activations: 1325, kioskSetup: 1076 },
    { date: "Week 2", activations: 1420, kioskSetup: 1182 },
    { date: "Week 3", activations: 1587, kioskSetup: 1342 },
    { date: "Week 4", activations: 1753, kioskSetup: 1521 },
  ],
  monthly: [
    { date: "Jan", activations: 5643, kioskSetup: 4712 },
    { date: "Feb", activations: 6128, kioskSetup: 5246 },
    { date: "Mar", activations: 7250, kioskSetup: 6312 },
    { date: "Apr", activations: 8132, kioskSetup: 7185 },
    { date: "May", activations: 4350, kioskSetup: 3821 },
  ],
};

type TimeframeOption = "daily" | "weekly" | "monthly";

export default function ActivationOverTime() {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("daily");

  // Get the appropriate data based on timeframe
  const data = activationTimeData[timeframe];

  // Get the latest data point for summary metrics
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];

  // Calculate conversion rate and change
  const latestConversionRate = Math.round(
    (latest.kioskSetup / latest.activations) * 100,
  );
  const previousConversionRate = Math.round(
    (previous.kioskSetup / previous.activations) * 100,
  );
  const conversionRateChange = latestConversionRate - previousConversionRate;

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between">
        <div>
          <h4 className="text-lg font-semibold">Activation Over Time</h4>
          <p className="text-sm text-muted-foreground">
            Showing {timeframe} device activation and kiosk setup
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span className="capitalize">{timeframe}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Timeframe</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => setTimeframe("daily")}
                className="cursor-pointer"
              >
                Daily
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTimeframe("weekly")}
                className="cursor-pointer"
              >
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTimeframe("monthly")}
                className="cursor-pointer"
              >
                Monthly
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Summary metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="mb-1 flex items-center gap-2">
            <Tablet className="h-5 w-5 text-blue-500" />
            <h5 className="text-sm font-medium">Activations</h5>
          </div>
          <p className="text-2xl font-bold">
            {latest.activations.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Latest {timeframe} period
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="mb-1 flex items-center gap-2">
            <Laptop className="h-5 w-5 text-green-500" />
            <h5 className="text-sm font-medium">Kiosk Setup</h5>
          </div>
          <p className="text-2xl font-bold">
            {latest.kioskSetup.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Latest {timeframe} period
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="mb-1 flex items-center gap-2">
            <h5 className="text-sm font-medium">Conversion Rate</h5>
          </div>
          <p className="text-2xl font-bold">{latestConversionRate}%</p>
          <div
            className={`mt-1 text-xs ${conversionRateChange >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {conversionRateChange >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(conversionRateChange)}% from previous
          </div>
        </div>
      </div>

      {/* Line chart placeholder - replace with VisActor chart */}
      <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <h5 className="mb-2 font-medium">Activation & Kiosk Setup Trend</h5>
            <p className="text-muted-foreground">
              This is a placeholder for a VisActor line chart showing
              activations and kiosk setup over time.
              <br />
              Implement using VisActor line chart components with two lines -
              one for activations and one for kiosk setup.
            </p>
          </div>
        </div>

        {/* Simple visualization - to be replaced by VisActor */}
        <div className="mt-4 flex h-40 items-end gap-1">
          {data.map((item, index) => {
            const activationHeight =
              (item.activations / Math.max(...data.map((d) => d.activations))) *
              100;
            const kioskHeight =
              (item.kioskSetup / Math.max(...data.map((d) => d.activations))) *
              100;
            return (
              <div
                key={index}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div className="flex w-full justify-center gap-1">
                  <div
                    className="w-1/3 rounded-t bg-blue-500"
                    style={{ height: `${activationHeight}%` }}
                  />
                  <div
                    className="w-1/3 rounded-t bg-green-500"
                    style={{ height: `${kioskHeight}%` }}
                  />
                </div>
                <span className="truncate text-xs">
                  {typeof item.date === "string" && item.date.length > 5
                    ? item.date.substring(5)
                    : item.date}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-blue-500" />
            <span className="text-xs">Activations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-green-500" />
            <span className="text-xs">Kiosk Setup</span>
          </div>
        </div>
      </div>
    </div>
  );
}
