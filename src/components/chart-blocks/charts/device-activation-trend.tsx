"use client";

import { format } from "date-fns";
import { Calendar, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { VChart } from "@visactor/react-vchart";
import type { IBarChartSpec } from "@visactor/vchart";
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
import { activationTrendData } from "@/data/average-tickets-created";

// Define proper types for the data
interface ActivationDataItem {
  date: string;
  activated: number;
  total: number;
}

// Format data for the chart, similar to the tickets implementation
interface ChartDataItem {
  date: string;
  count: number;
  type: "Latest Activations" | "Total Devices";
}

type TimeframeOption = "daily" | "weekly" | "monthly";

export default function DeviceActivationTrend() {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("daily");

  // Get the data based on timeframe directly in the component
  const chartData = useMemo(() => {
    // Get the appropriate data based on timeframe
    const allData = [...activationTrendData[timeframe]];

    // Ensure we're displaying in chronological order
    allData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Limit to the most recent 7 data points (or all if less than 7)
    const limitedData = allData.length > 7 ? allData.slice(-7) : allData;

    // Transform the data for the chart
    const formattedData: ChartDataItem[] = [];

    // First add all Total Devices data points
    limitedData.forEach((item) => {
      formattedData.push({
        date: item.date,
        count: item.total,
        type: "Total Devices",
      });
    });

    // Then add all Latest Activations data points
    limitedData.forEach((item) => {
      formattedData.push({
        date: item.date,
        count: item.activated,
        type: "Latest Activations",
      });
    });

    return formattedData;
  }, [timeframe]);

  // Get statistics for the summary cards from the original data
  const originalData = activationTrendData[timeframe];
  const limitedData =
    originalData.length > 7 ? originalData.slice(-7) : originalData;

  const latestData = limitedData[limitedData.length - 1] || {
    activated: 0,
    total: 0,
  };
  const previousData = limitedData[limitedData.length - 2];

  // Calculate change percentage
  const activationChange =
    previousData && previousData.activated
      ? ((latestData.activated - previousData.activated) /
          previousData.activated) *
        100
      : 0;

  const successRateLatest = latestData.total
    ? (latestData.activated / latestData.total) * 100
    : 0;
  const successRatePrevious =
    previousData && previousData.total
      ? (previousData.activated / previousData.total) * 100
      : 0;
  const successRateChange = successRatePrevious
    ? successRateLatest - successRatePrevious
    : 0;

  // Generate simplified chart spec
  const spec = useMemo(() => {
    const chartSpec: IBarChartSpec = {
      type: "bar",
      data: [
        {
          id: "barData",
          values: chartData,
        },
      ],
      xField: "date",
      yField: "count",
      seriesField: "type",
      color: ["#1BC6FF", "#1664FF"], // First Total Devices (darker blue), then Latest Activations (light blue)
      padding: [20, 20, 30, 40],
      legends: {
        visible: true,
        position: "top",
        align: "start",
      },
      stack: false,
      dodging: true,
      dodgePadding: 8,
      tooltip: {
        trigger: ["click", "hover"],
        formatter: (datum: any) => {
          const value = datum.count.toLocaleString();

          if (datum.type === "Latest Activations") {
            return {
              name: format(new Date(datum.date), "MMM dd, yyyy"),
              value: `${value} activations`,
            };
          } else {
            return {
              name: format(new Date(datum.date), "MMM dd, yyyy"),
              value: `${value} devices`,
            };
          }
        },
      },
      axes: [
        {
          orient: "bottom",
          label: {
            formatMethod: (value) => {
              return format(new Date(value), "MM/dd");
            },
          },
        },
        {
          orient: "left",
        },
      ],
      crosshair: {
        visible: true,
        style: { stroke: "#d1d5db", lineWidth: 1 },
      },
      bar: {
        state: {
          hover: {
            outerBorder: {
              distance: 2,
              lineWidth: 2,
            },
          },
        },
        style: {
          cornerRadius: [12, 12, 12, 12], // Rounded corners to match the reference image
          maxWidth: 20,
        },
      },
    };

    return chartSpec;
  }, [chartData]);

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between">
        <div>
          <h4 className="text-lg font-semibold">Device Activation Trend</h4>
          <p className="text-sm text-muted-foreground">
            Showing {timeframe} activation trends for devices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                <span className="capitalize">{timeframe}</span>
                <ChevronDown className="h-4 w-4" />
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
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h5 className="mb-1 text-sm font-medium text-muted-foreground">
            Latest Activations
          </h5>
          <p className="text-2xl font-bold">
            {latestData.activated.toLocaleString()}
          </p>
          <div
            className={`mt-1 text-xs ${activationChange >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {activationChange >= 0 ? "u2191" : "u2193"}{" "}
            {Math.abs(Math.round(activationChange))}% from previous
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h5 className="mb-1 text-sm font-medium text-muted-foreground">
            Success Rate
          </h5>
          <p className="text-2xl font-bold">{Math.round(successRateLatest)}%</p>
          <div
            className={`mt-1 text-xs ${successRateChange >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {successRateChange >= 0 ? "u2191" : "u2193"}{" "}
            {Math.abs(Math.round(successRateChange))}% from previous
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h5 className="mb-1 text-sm font-medium text-muted-foreground">
            Total Devices
          </h5>
          <p className="text-2xl font-bold">
            {latestData.total.toLocaleString()}
          </p>
          <div className="mt-1 text-xs text-muted-foreground">
            Enrolled during this period
          </div>
        </div>
      </div>

      {/* Chart implementation */}
      <div className="h-[400px] w-full">
        <VChart spec={spec} />
      </div>
    </div>
  );
}
