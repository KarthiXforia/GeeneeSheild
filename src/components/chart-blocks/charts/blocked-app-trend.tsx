"use client";

import { format } from "date-fns";
import { Calendar, ChevronDown, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VChart } from "@visactor/react-vchart";
import type { ILineChartSpec } from "@visactor/vchart";
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
import { useBlockedAppTrends } from "@/hooks/useBlockedAppTrends";
import type { TimeframeOption } from "@/types/apps";

// Format data for the chart
interface ChartDataItem {
  date: string;
  count: number;
  category: string;
}

interface PointDatum {
  category?: string;
}

export default function BlockedAppTrend() {
  const [isClient, setIsClient] = useState(false);
  const [timeframe, setTimeframe] = useState<TimeframeOption>("daily");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, error, isLoading, startDate, endDate } = useBlockedAppTrends({
    period: timeframe,
    startDate: "", // Will be calculated by the hook
    endDate: "", // Will be calculated by the hook
  });

  // Transform API data for the chart
  const chartData = useMemo(() => {
    if (!data?.trends?.length) return [];

    // Get all unique categories across all dates
    const allCategories = new Set<string>();
    data.trends.forEach((trend) => {
      Object.keys(trend.categories).forEach((category) => {
        allCategories.add(category);
      });
    });

    // Create a map of dates to their data
    const dateMap = new Map<string, Record<string, number>>();
    data.trends.forEach((trend) => {
      dateMap.set(trend.date, { ...trend.categories });
    });

    // Flatten the data to have one entry per category per date
    const flattenedData: ChartDataItem[] = [];

    data.trends.forEach((trend) => {
      // Include all categories to maintain line continuity
      allCategories.forEach((category) => {
        const count = trend.categories[category] || 0;
        flattenedData.push({
          date: trend.date,
          count,
          category,
        });
      });
    });

    return flattenedData;
  }, [data]);

  // Get unique categories for the legend
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    data?.trends?.forEach((trend) => {
      Object.keys(trend.categories).forEach((category) => {
        categorySet.add(category);
      });
    });
    return Array.from(categorySet);
  }, [data]);

  // Generate colors for categories (blue theme for apps)
  const categoryColors = useMemo(() => {
    const colors = [
      "#1664FF", // Primary blue
      "#3B82F6", // Blue
      "#06B6D4", // Cyan
      "#8B5CF6", // Purple
      "#6366F1", // Indigo
      "#0EA5E9", // Sky blue
      "#14B8A6", // Teal
    ];
    return categories.map((_, index) => colors[index % colors.length]);
  }, [categories]);

  // Format date for display based on timeframe
  const formatDateForAxis = useCallback(
    (dateString: string) => {
      if (!dateString) return "";

      // Handle weekly format (YYYY-WXX)
      if (dateString.includes("-W")) {
        const [year, weekNum] = dateString.split("-W").map(Number);
        // Get the first day of the week (Monday)
        const firstDayOfWeek = getFirstDayOfWeek(year, weekNum);
        // Format as "MMM d" (e.g., "May 20")
        return format(firstDayOfWeek, "MMM d");
      }

      // Handle regular dates
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      switch (timeframe) {
        case "daily":
          return format(date, "MM/dd");
        case "weekly":
          return format(date, "MMM d");
        case "monthly":
          return format(date, "MMM yyyy");
        default:
          return format(date, "MM/dd");
      }
    },
    [timeframe],
  );

  // Helper function to get the first day of a given week
  function getFirstDayOfWeek(year: number, week: number): Date {
    const date = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = date.getDay();
    const ISOdayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to ISO day (Monday = 0)
    date.setDate(date.getDate() - ISOdayOfWeek);
    return date;
  }

  // Generate chart spec
  const spec = useMemo((): ILineChartSpec => {
    return {
      type: "line",
      data: [
        {
          id: "lineData",
          values: chartData,
        },
      ],
      xField: "date",
      yField: "count",
      seriesField: "category",
      color: categoryColors,
      padding: [20, 40, 50, 60],
      legends: {
        visible: true,
        position: "middle",
        orient: "bottom",
        padding: [20, 0, 0, 0],
      },
      tooltip: {
        visible: true,
        mark: {
          title: {
            value: (value: unknown) => {
              try {
                if (value === null || value === undefined) return "";
                if (typeof value === "string") return formatDateForAxis(value);
                if (typeof value === "object" && "date" in value) {
                  const dateValue = (value as { date: unknown }).date;
                  return formatDateForAxis(String(dateValue ?? ""));
                }
                return formatDateForAxis(String(value));
              } catch {
                return "";
              }
            },
          },
          content: (data: unknown) => {
            try {
              if (!Array.isArray(data) || data.length === 0) return [];

              // Get the date from the first dimension's first data point
              const firstDim = data[0];
              if (!firstDim?.data?.[0]?.datum) return [];

              const firstDatum = firstDim.data[0].datum as ChartDataItem;
              const currentDate = firstDatum.date;

              if (!currentDate) return [];

              // Find all data points for this date
              const dateData = chartData.filter(
                (item) => item.date === currentDate,
              );

              // Only include categories with count > 0 for this date
              return dateData
                .filter((item) => item.count > 0)
                .map((item) => ({
                  key: item.category || "Unknown",
                  value: `${item.count} blocked attempts`,
                }));
            } catch {
              return [];
            }
          },
        },
      } as const,
      axes: [
        {
          orient: "bottom",
          label: {
            formatMethod: (value) => formatDateForAxis(value as string),
          },
        },
        {
          orient: "left",
          title: {
            visible: true,
            text: "Blocked Attempts",
          },
        },
      ],
      series: [
        {
          type: "line",
          line: {
            style: {
              curveType: "monotone",
              lineWidth: 3,
              connectNulls: true,
            },
          },
          point: {
            visible: true,
            style: {
              size: 6,
              fill: "#fff",
              stroke: (datum: PointDatum) => {
                if (!datum.category) return "#ccc";
                const index = categories.indexOf(datum.category);
                return categoryColors[index % categoryColors.length];
              },
              lineWidth: 2,
            },
            state: {
              hover: {
                size: 8,
                lineWidth: 3,
              },
            },
          },
        },
      ],
    };
  }, [chartData, categories, categoryColors, formatDateForAxis]);

  // Calculate statistics for summary cards
  const { totalAttempts, averagePerDay, trendDirection, percentageChange } =
    useMemo(() => {
      return {
        totalAttempts: data?.totalAttempts || 0,
        averagePerDay: data?.averagePerDay || 0,
        trendDirection: data?.trendDirection || "stable",
        percentageChange: data?.percentageChange || 0,
      };
    }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <p className="text-destructive">
          Failed to load blocked app data. Please try again later.
        </p>
      </div>
    );
  }

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
          <p className="text-sm text-muted-foreground">
            Showing {timeframe} blocked app trends
            {startDate && endDate && (
              <span className="ml-1">
                ({format(new Date(startDate), "MMM d")} -{" "}
                {format(new Date(endDate), "MMM d, yyyy")})
              </span>
            )}
          </p>
          <div
            className={`text-xs ${
              trendDirection === "increasing"
                ? "text-red-500"
                : trendDirection === "decreasing"
                  ? "text-green-500"
                  : "text-muted-foreground"
            }`}
          >
            {trendDirection === "increasing"
              ? "↑"
              : trendDirection === "decreasing"
                ? "↓"
                : "→"}{" "}
            {Math.abs(Math.round(percentageChange))}%{" "}
            {trendDirection === "increasing"
              ? "increase"
              : trendDirection === "decreasing"
                ? "decrease"
                : "change"}{" "}
            since {format(new Date(startDate), "MMM d")}
          </div>
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
            Total Blocked Attempts
          </h5>
          <p className="text-2xl font-bold">{totalAttempts.toLocaleString()}</p>
          <div className="mt-1 text-xs text-muted-foreground">
            Across all app categories
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h5 className="mb-1 text-sm font-medium text-muted-foreground">
            Average Per Day
          </h5>
          <p className="text-2xl font-bold">
            {Math.round(averagePerDay).toLocaleString()}
          </p>
          <div className="mt-1 text-xs text-muted-foreground">
            Average blocked attempts per day
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h5 className="mb-1 text-sm font-medium text-muted-foreground">
            Categories Tracked
          </h5>
          <p className="text-2xl font-bold">{categories.length}</p>
          <div className="mt-1 text-xs text-muted-foreground">
            Different app categories
          </div>
        </div>
      </div>

      {/* Chart implementation */}
      <div className="h-[500px] w-full">
        {chartData.length > 0 ? (
          <VChart spec={spec} />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-muted-foreground">
              No blocked app data available for this period
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
