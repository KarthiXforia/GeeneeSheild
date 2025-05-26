"use client";

import { format } from "date-fns";
import { Calendar, ChevronDown, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useActivationTimeline } from "@/hooks/useActivationTimeline";
import type { TimeframeOption } from "@/types/device";

// Format data for the chart
interface ChartDataItem {
  date: string;
  count: number;
  type: "Latest Activations" | "Total Devices";
}

export default function DeviceActivationTrend() {
  // Add client-side only rendering flag
  const [isClient, setIsClient] = useState(false);
  const [timeframe, setTimeframe] = useState<TimeframeOption>("daily");

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch data from API with automatically calculated date range based on timeframe
  const { data, error, isLoading, startDate, endDate } = useActivationTimeline({
    period: timeframe,
    // No need to pass customStartDate or customEndDate as the hook will calculate them
  });

  // Transform API data for the chart
  const chartData = useMemo(() => {
    // Check if we have data
    if (!data?.timeline) {
      return [];
    }

    // Generate the complete date range based on timeframe (even if empty)
    const generateDateRange = () => {
      if (!startDate || !endDate) return [];

      const result = [];
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        // Log to error reporting service in production
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error("Invalid start or end date", { startDate, endDate });
        }
        return [];
      }

      // Generate different intervals based on timeframe
      switch (timeframe) {
        case "daily": {
          // Generate all 7 days
          const current = new Date(start);
          while (current <= end) {
            result.push(format(current, "yyyy-MM-dd"));
            current.setDate(current.getDate() + 1);
          }
          break;
        }
        case "weekly": {
          // Generate all 7 weeks
          // For weekly, we need to generate week identifiers in the format "YYYY-WXX"
          const current = new Date(start);
          let weekCounter = 1;
          // Approximate the week number based on the start date
          // This is a simple approximation
          const firstDayOfYear = new Date(current.getFullYear(), 0, 1);
          const pastDaysOfYear = Math.floor(
            (current.getTime() - firstDayOfYear.getTime()) / 86400000,
          );
          const startWeek = Math.ceil(
            (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7,
          );

          while (current <= end && weekCounter <= 7) {
            result.push(
              `${current.getFullYear()}-W${(startWeek + weekCounter - 1).toString().padStart(2, "0")}`,
            );
            current.setDate(current.getDate() + 7); // Add 1 week
            weekCounter++;
          }
          break;
        }
        case "monthly": {
          // Generate all 7 months
          // For monthly, we need to generate month identifiers in the format "YYYY-MM"
          const current = new Date(start);
          let monthCounter = 0;
          while (current <= end && monthCounter < 7) {
            const year = current.getFullYear();
            const month = current.getMonth() + 1; // Month is 0-indexed
            result.push(`${year}-${month.toString().padStart(2, "0")}`);
            current.setMonth(current.getMonth() + 1);
            monthCounter++;
          }
          break;
        }
      }
      return result;
    };

    // Get complete date range
    const completeDateRange = generateDateRange();

    // If we have an empty date range, create a fallback
    if (completeDateRange.length === 0) {
      // Log to error reporting service in production
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("Empty date range generated, using fallback");
      }
      return [];
    }

    // Create a map of existing data for quick lookup
    const dataMap = new Map();

    // Map the API data to our date keys
    if (data.timeline && data.timeline.length > 0) {
      data.timeline.forEach((item) => {
        if (item.date) {
          dataMap.set(item.date, item);
        }
      });
    }

    // Create dataset with all dates, filling in zeros for missing data
    const completeDataset = completeDateRange.map((date) => {
      const existingData = dataMap.get(date);
      return {
        date,
        activated: existingData?.activated || 0,
        total: existingData?.total || 0,
      };
    });

    // Transform the data for the chart
    const formattedData: ChartDataItem[] = [];

    // First add all Total Devices data points
    completeDataset.forEach((item) => {
      formattedData.push({
        date: item.date,
        count: item.total,
        type: "Total Devices",
      });
    });

    // Then add all Latest Activations data points
    completeDataset.forEach((item) => {
      formattedData.push({
        date: item.date,
        count: item.activated,
        type: "Latest Activations",
      });
    });

    return formattedData;
  }, [data, timeframe, startDate, endDate]);

  // Get statistics for the summary cards from the data
  const { latestData, activationChange, successRateLatest, successRateChange } =
    useMemo(() => {
      // If no data, return empty stats
      if (!data?.timeline || data.timeline.length === 0) {
        return {
          latestData: { activated: 0, total: 0 },
          previousData: undefined,
          activationChange: 0,
          successRateLatest: 0,
          successRateChange: 0,
        };
      }

      // Get the timeline data
      const timeline = [...data.timeline];
      // Sort in chronological order
      timeline.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      // No need to limit the data here since we're using all data points from the API response
      const latestData = timeline[timeline.length - 1] || {
        activated: 0,
        total: 0,
      };
      const previousData = timeline[timeline.length - 2];

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

      return {
        latestData,
        previousData,
        activationChange,
        successRateLatest,
        successRateChange,
      };
    }, [data]);

  // Format date for display based on timeframe
  const formatDateForAxis = useCallback(
    (dateString: string) => {
      try {
        // Handle weekly format specially (YYYY-WXX)
        if (dateString.includes("-W")) {
          // Extract year and week number
          const [year, weekPart] = dateString.split("-");
          const weekNum = parseInt(weekPart.substring(1), 10);

          // Calculate the date of the first day of the year
          const firstDayOfYear = new Date(parseInt(year, 10), 0, 1);

          // Add (weekNum-1) weeks to the first day of the year
          // and adjust to the nearest Monday
          const dayOfWeek = firstDayOfYear.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const daysToAdd =
            (weekNum - 1) * 7 + (dayOfWeek === 0 ? 1 : 8 - dayOfWeek);

          const resultDate = new Date(firstDayOfYear);
          resultDate.setDate(firstDayOfYear.getDate() + daysToAdd);

          // Format the resulting date
          return format(resultDate, "MM/dd");
        }

        // Regular date handling for other formats
        const date = new Date(dateString);

        // Check if date is valid before formatting
        if (isNaN(date.getTime())) {
          // Log to error reporting service in production
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.error("Invalid date:", dateString);
          }
          return dateString; // Return the original string if invalid
        }

        switch (timeframe) {
          case "daily":
            return format(date, "MM/dd"); // Show month/day for daily view
          case "weekly":
            return format(date, "MM/dd"); // Still show month/day for weekly
          case "monthly":
            return format(date, "MMM"); // Just show month name for monthly view
          default:
            return format(date, "MM/dd");
        }
      } catch (error) {
        // Log to error reporting service in production
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error("Error formatting date:", error, dateString);
        }
        return dateString; // Return the original string if there's an error
      }
    },
    [timeframe],
  );

  // Generate chart spec
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
      color: ["#1BC6FF", "#1664FF"], // First Total Devices (light blue), then Latest Activations (darker blue)
      padding: [20, 20, 30, 40],
      legends: {
        visible: true,
        position: "start",
        align: "left",
      },
      stack: false,
      tooltip: {
        visible: true,
        trigger: ["click", "hover"],
        enterable: true,
      },
      axes: [
        {
          orient: "bottom",
          label: {
            formatMethod: (value) => {
              // Ensure value is a string before creating a Date
              const dateValue = Array.isArray(value) ? value[0] : value;
              return formatDateForAxis(dateValue as string);
            },
          },
        },
        {
          orient: "left",
        },
      ],
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
  }, [chartData, formatDateForAxis]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <p className="text-destructive">
          Failed to load activation data. Please try again later.
        </p>
      </div>
    );
  }

  // Render placeholder during server-side rendering or initial client render
  if (!isClient) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between">
        <div>
          <h4 className="text-lg font-semibold">Device Activation Trend</h4>
          <p className="text-sm text-muted-foreground">
            Showing {timeframe} activation trends for devices
            {startDate && endDate && (
              <span className="ml-1">
                ({format(new Date(startDate), "MMM d")} -{" "}
                {format(new Date(endDate), "MMM d, yyyy")})
              </span>
            )}
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
            {activationChange >= 0 ? "↑" : "↓"}{" "}
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
            {successRateChange >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(Math.round(successRateChange))}% from previous
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h5 className="mb-1 text-sm font-medium text-muted-foreground">
            Total Devices
          </h5>
          <p className="text-2xl font-bold">
            {data?.totalDevices?.toLocaleString() || "0"}
          </p>
          <div className="mt-1 text-xs text-muted-foreground">
            Enrolled during this period
          </div>
        </div>
      </div>

      {/* Chart implementation */}
      <div className="h-[400px] w-full">
        {chartData.length > 0 ? (
          <VChart spec={spec} />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-muted-foreground">
              No activation data available for this period
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
