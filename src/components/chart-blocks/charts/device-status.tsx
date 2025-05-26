"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { VChart } from "@visactor/react-vchart";
import type { IPieChartSpec } from "@visactor/vchart";
import { useDeviceStatus } from "@/hooks/useDeviceStatus";

// Define types for status names to avoid TypeScript errors
type StatusName = "Active" | "Pending" | "Failed";

export default function DeviceStatus() {
  // Add client-side only rendering flag
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch data using the custom hook
  const { data, error, isLoading } = useDeviceStatus();

  // Generate chart data and spec
  const { chartSpec, activeTotalItems } = useMemo(() => {
    // If no data yet, return empty chart
    if (!data?.statuses) {
      return {
        chartSpec: null,
        activeTotalItems: {
          activeCount: 0,
          totalCount: 0,
          percentage: 0,
        },
      };
    }

    // Extract the active items and total count
    const activeItem = data.statuses.find(
      (item) => item.name.toLowerCase() === "active",
    );
    const activeTotalItems = {
      activeCount: activeItem?.count || 0,
      totalCount: data.total,
      percentage: activeItem?.percentage || 0,
    };

    // Define colors for each status - updated to match other components
    const colorMap: Record<string, string> = {
      Active: "#21C55D",
      Pending: "#F59E0B",
      Failed: "#EF4444",
    };

    // Define with a Record type to allow string indexing
    const radiusValues: Record<StatusName, number> = {
      Active: 95,
      Pending: 90,
      Failed: 85,
    };

    // Generate chart spec for VisActor
    const chartSpec: IPieChartSpec = {
      type: "pie",
      data: [
        {
          id: "status",
          values: data.statuses.map((status) => ({
            status: status.name,
            value: status.count,
            percentage: status.percentage,
            // Use type assertion to tell TypeScript this is a valid key
            radius: radiusValues[status.name as StatusName] || 85,
          })),
        },
      ],
      valueField: "value",
      categoryField: "status",
      startAngle: -90,
      endAngle: 270,
      outerRadius: 0.8,
      innerRadius: 0.6, // Creates donut chart
      pie: {
        style: {
          outerRadius: (datum) => {
            return datum.radius;
          },
          innerRadius: () => {
            return 60;
          },
          cornerRadius: 3,
        },
      },
      legends: {
        visible: true,
        position: "middle", // Changed from "bottom" to "middle"
        align: "bottom", // Changed from "center" to "bottom"
      },
      label: {
        visible: false, // Hide labels on the chart
      },
      color: data.statuses.map((status) => colorMap[status.name] || "#CCCCCC"),
      tooltip: {
        visible: true,
      },
      animation: true, // Changed from object to boolean
      title: {
        text: "", // Added required 'text' property
        visible: false,
      },
      padding: 0,
    };

    return { chartSpec, activeTotalItems };
  }, [data]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <p className="text-destructive">
          Failed to load device status. Please try again later.
        </p>
      </div>
    );
  }

  // Render placeholder during server-side rendering or initial client render
  if (!isClient) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Get status data for the legend
  const getStatusData = () => {
    if (!data?.statuses) return [];

    return data.statuses.map((status) => ({
      name: status.name,
      count: status.count,
      percentage: Math.round((status.count / data.total) * 100),
      color:
        status.name === "Active"
          ? "#21C55D"
          : status.name === "Pending"
            ? "#F59E0B"
            : status.name === "Failed"
              ? "#EF4444"
              : "#CCCCCC",
      bgColor:
        status.name === "Active"
          ? "bg-green-50 dark:bg-green-900/20"
          : status.name === "Pending"
            ? "bg-orange-50 dark:bg-orange-900/20"
            : status.name === "Failed"
              ? "bg-red-50 dark:bg-red-900/20"
              : "bg-gray-50 dark:bg-gray-800/30",
    }));
  };

  const statusData = getStatusData();

  return (
    <div className="p-4">
      <div className="mb-4">
        <h4 className="text-lg font-semibold">Device Status</h4>
        <p className="text-sm text-muted-foreground">
          Status of all {activeTotalItems.totalCount.toLocaleString()} devices
        </p>
      </div>

      {/* Donut chart with central indicator */}
      <div className="my-4 flex justify-center">
        <div className="relative h-[250px] w-full">
          {chartSpec && (
            <>
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {activeTotalItems.percentage}%
                  </p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
              <VChart spec={chartSpec} />
            </>
          )}
        </div>
      </div>

      {/* Status legend with cards - added as a separate div */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {statusData.map((status) => (
          <div
            key={status.name}
            className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
          >
            <h5 className="mb-1 text-sm font-medium text-muted-foreground">
              {status.name}
            </h5>
            <p className="text-2xl font-bold">
              {status.count.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {status.percentage}% of all devices
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
