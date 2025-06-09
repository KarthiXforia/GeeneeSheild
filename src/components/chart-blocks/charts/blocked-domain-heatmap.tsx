"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { VChart } from "@visactor/react-vchart";
import type {
  IHeatmapChartSpec,
  TooltipContentProperty,
} from "@visactor/vchart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBlockedDomainHeatmap } from "@/hooks/useBlockedDomainHeatmap";
import type {
  BlockedDomainHeatmapItem,
  TimeframeOption,
} from "@/types/domains";

// Map day numbers to day names
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface HeatmapDatum {
  day: string | number;
  hour: number;
  value: number;
}

export default function BlockedDomainHeatmap() {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("daily");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch heatmap data
  const { data, isLoading, error } = useBlockedDomainHeatmap({
    period: timeframe,
  });

  // Prepare data for the heatmap
  const heatmapData = useMemo<HeatmapDatum[]>(() => {
    if (!data?.heatmapData) return [];

    return data.heatmapData
      .filter(
        (item): item is BlockedDomainHeatmapItem =>
          item !== null && item !== undefined,
      )
      .map((item) => {
        // For weekly view, use day names
        if (timeframe === "weekly") {
          return {
            day: DAY_NAMES[item.day % 7],
            hour: item.hour % 24,
            value: item.count || 0,
          };
        }
        // For daily/monthly view, keep as numbers
        return {
          day: item.day,
          hour: item.hour % 24,
          value: item.count || 0,
        };
      });
  }, [data, timeframe]);

  // Generate chart spec
  const chartSpec = useMemo<IHeatmapChartSpec>(() => {
    const isWeekly = timeframe === "weekly";
    const isMonthly = timeframe === "monthly";

    return {
      type: "heatmap",
      padding: { top: 40, right: 10, bottom: 50, left: 60 },
      data: [
        {
          id: "data0",
          values: heatmapData,
        },
      ],
      series: [
        {
          type: "heatmap",
          regionId: "region0",
          xField: isWeekly ? "day" : "hour",
          yField: isWeekly ? "hour" : "day",
          valueField: "value",
          cell: {
            style: {
              fill: {
                field: "value",
                scale: "color",
              },
              stroke: "#fff",
              lineWidth: 1,
            },
          },
        },
      ],
      color: {
        type: "linear",
        domain: [
          {
            dataId: "data0",
            fields: ["value"],
          },
        ],
        range: [
          "#e6f2ff",
          "#99c2ff",
          "#4d94ff",
          "#0066ff",
          "#0052cc",
          "#003d99",
          "#002966",
        ],
      },
      axes: [
        {
          orient: "bottom",
          type: "band",
          grid: { visible: false },
          domainLine: { visible: false },
          label: {
            visible: true,
            style: {
              fontSize: 10,
              angle: isWeekly ? 0 : 0, // Always keep labels straight
              textAlign: "center",
              textBaseline: "top",
            },
          },
          title: {
            visible: true,
            text: isWeekly
              ? "Day of Week"
              : isMonthly
                ? "Day of Month"
                : "Hour of Day",
            style: {
              fontSize: 12,
              fontWeight: "bold",
            },
          },
        },
        {
          orient: "left",
          type: "band",
          grid: { visible: false },
          domainLine: { visible: false },
          label: {
            visible: true,
            style: {
              fontSize: 10,
            },
          },
          title: {
            visible: true,
            text: isWeekly ? "Hour of Day" : "Day of Month",
            style: {
              fontSize: 12,
              fontWeight: "bold",
            },
          },
        },
      ],
      tooltip: {
        visible: true,
        mark: {
          title: {
            value: ((datum: HeatmapDatum) => {
              // Use any to bypass the type issue
              if (isWeekly) {
                return `${datum.day}, ${datum.hour}:00 - ${datum.hour + 1}:00`;
              } else if (isMonthly) {
                return `Day ${datum.day}, ${datum.hour}:00 - ${datum.hour + 1}:00`;
              }
              return `${datum.hour}:00 - ${datum.hour + 1}:00`;
            }) as TooltipContentProperty<string>, // Cast to the expected type
          },
          content: [
            {
              key: "Blocked Attempts",
              value: ((datum: HeatmapDatum) =>
                String(datum.value || 0)) as TooltipContentProperty<string>, // Convert number to string
            },
          ],
        },
      },

      legends: {
        visible: true,
        orient: "right",
        position: "start",
        type: "color",
        field: "value",
        title: {
          text: "Blocked Attempts",
        },
      },
    };
  }, [heatmapData, timeframe]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex h-96 w-full items-center justify-center text-destructive">
        Failed to load heatmap data
      </div>
    );
  }

  // Only render the chart on the client side
  return (
    <div className="w-full space-y-4">
      {/* Header with title and filter */}
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              {timeframe === "daily"
                ? "Daily"
                : timeframe === "weekly"
                  ? "Weekly"
                  : "Monthly"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTimeframe("daily")}>
              Daily
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeframe("weekly")}>
              Weekly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeframe("monthly")}>
              Monthly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Heatmap */}
      <div className="h-96 w-full" style={{ minHeight: "400px" }}>
        {isClient && data?.heatmapData && data.heatmapData.length > 0 ? (
          <VChart
            spec={chartSpec}
            style={{ width: "100%", height: "100%" }}
            options={{
              animation: false,
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading heatmap data...
              </div>
            ) : (
              "No data available for the selected time period"
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {data?.peakActivity && data.lowActivity && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h5 className="mb-1 text-sm font-medium text-muted-foreground">
              Peak Activity
            </h5>
            <p className="text-2xl font-bold">
              {data.peakActivity.count.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              blocked attempts on{" "}
              {timeframe === "weekly"
                ? `${DAY_NAMES[data.peakActivity.day]}, ${data.peakActivity.hour}:00`
                : timeframe === "monthly"
                  ? `Day ${data.peakActivity.day}, ${data.peakActivity.hour}:00`
                  : `${data.peakActivity.hour}:00`}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h5 className="mb-1 text-sm font-medium text-muted-foreground">
              Lowest Activity
            </h5>
            <p className="text-2xl font-bold">
              {data.lowActivity.count.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              blocked attempts on{" "}
              {timeframe === "weekly"
                ? `${DAY_NAMES[data.lowActivity.day]}, ${data.lowActivity.hour}:00`
                : timeframe === "monthly"
                  ? `Day ${data.lowActivity.day}, ${data.lowActivity.hour}:00`
                  : `${data.lowActivity.hour}:00`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
