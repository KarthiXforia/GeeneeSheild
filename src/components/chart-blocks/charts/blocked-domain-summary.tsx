"use client";

import { Shield, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { VChart } from "@visactor/react-vchart";
import type { IBarChartSpec, IPieChartSpec } from "@visactor/vchart";
import { useBlockedDomainSummary } from "@/hooks/useBlockedDomainSummary";

// Type for the datum object passed to the hover fill function
interface HoverDatum {
  name?: string;
  [key: string]: unknown;
}

export default function BlockedDomainSummary() {
  const [isClient, setIsClient] = useState(false);
  const { data, isLoading, error } = useBlockedDomainSummary();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Process and normalize the data
  const { topCategory, normalizedCategories, normalizedBrowsers } =
    useMemo(() => {
      if (!data) {
        return {
          normalizedCategories: [],
          normalizedBrowsers: [],
          topCategory: undefined,
        };
      }

      // Process categories
      const categoryMap = new Map<
        string,
        {
          displayName: string;
          count: number;
          percentage: number;
        }
      >();

      data.categoryBreakdown?.forEach((item) => {
        const name = item.category.trim();
        if (!name) return;

        const normalizedName = name.toLowerCase();
        const existing = categoryMap.get(normalizedName) || {
          displayName: name,
          count: 0,
          percentage: 0,
        };

        categoryMap.set(normalizedName, {
          ...existing,
          count: existing.count + (item.count || 0),
          percentage: existing.percentage + (item.percentage || 0),
        });
      });

      const processedCategories = Array.from(categoryMap.values())
        .map(({ displayName, count, percentage }) => ({
          name: displayName,
          value: count,
          percentage: `${percentage.toFixed(1)}%`,
        }))
        .sort((a, b) => b.value - a.value);

      // Process browsers
      const browserMap = new Map<
        string,
        {
          displayName: string;
          count: number;
          percentage: number;
        }
      >();

      data.browserBreakdown?.forEach((item) => {
        let name = item.browser.trim();
        if (!name) return;

        // Normalize browser names
        if (name.toLowerCase() === "com.android.chrome") {
          name = "Chrome Mobile";
        } else if (name.toLowerCase() === "chrome") {
          name = "Chrome";
        } else if (name.toLowerCase() === "unknown") {
          name = "Unknown";
        } else if (name.toLowerCase() === "edge") {
          name = "Edge";
        } else if (name.toLowerCase() === "firefox") {
          name = "Firefox";
        } else if (name.toLowerCase() === "safari") {
          name = "Safari";
        } else {
          name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        }

        const normalizedName = name.toLowerCase();
        const existing = browserMap.get(normalizedName) || {
          displayName: name,
          count: 0,
          percentage: 0,
        };

        browserMap.set(normalizedName, {
          ...existing,
          count: existing.count + (item.count || 0),
          percentage: existing.percentage + (item.percentage || 0),
        });
      });

      const processedBrowsers = Array.from(browserMap.values())
        .map(({ displayName, count, percentage }) => ({
          name: displayName,
          value: count,
          percentage: `${percentage.toFixed(1)}%`,
        }))
        .sort((a, b) => b.value - a.value);

      // Get top 5 for each
      const topCategories = processedCategories.slice(0, 5);
      const topBrowsers = processedBrowsers.slice(0, 5);

      return {
        topCategory: topCategories[0],
        normalizedCategories: topCategories,
        normalizedBrowsers: topBrowsers,
      };
    }, [data]);

  // Horizontal bar chart for categories
  const categoryChartSpec = useMemo<IBarChartSpec>(
    () => ({
      type: "bar",
      renderer: "canvas",
      data: {
        values: normalizedCategories,
      },
      direction: "horizontal",
      xField: "value",
      yField: "name",
      seriesField: "name",
      color: ["#3B82F6", "#10B981", "#F59E0B", "#F43F5E", "#8B5CF6"],
      bar: {
        style: {
          cornerRadius: [0, 4, 4, 0],
        },
        state: {
          hover: {
            fill: (datum: HoverDatum) => {
              if (!datum || !datum.name) return "#3B82F6";
              const colors = [
                "#3B82F6",
                "#10B981",
                "#F59E0B",
                "#F43F5E",
                "#8B5CF6",
              ];
              const index = normalizedCategories.findIndex(
                (cat) => cat.name === datum.name,
              );
              return index >= 0 ? colors[index % colors.length] : colors[0];
            },
            fillOpacity: 0.8,
          },
        },
      },
      label: {
        visible: true,
        position: "right",
        format: (datum: { percentage: number }) => `${datum.percentage}`,
        style: {
          fontSize: 12,
          fill: "#666",
        },
      },
      tooltip: {
        visible: true,
        mark: {
          title: (data: unknown) => {
            const datum = Array.isArray(data)
              ? data[0]?.datum
              : (data as { datum?: { name?: string } })?.datum;
            return datum?.name || "";
          },
          content: [
            {
              key: "Count",
              value: (data: unknown) => {
                const datum = Array.isArray(data)
                  ? data[0]?.datum
                  : (data as { datum?: { value?: number } })?.datum;
                return (datum?.value ?? 0).toLocaleString();
              },
            },
            {
              key: "Percentage",
              value: (data: unknown) => {
                const datum = Array.isArray(data)
                  ? data[0]?.datum
                  : (data as { datum?: { percentage?: number } })?.datum;
                return `${datum?.percentage ?? 0}%`;
              },
            },
          ],
        },
      },
      axes: [
        {
          orient: "bottom",
          visible: true,
          title: {
            visible: true,
            text: "Count",
          },
        },
        {
          orient: "left",
          visible: true,
          label: {
            style: {
              fontSize: 12,
            },
          },
          type: "band",
        },
      ],
    }),
    [normalizedCategories],
  );

  // Pie chart for browsers
  const browserChartSpec = useMemo<IPieChartSpec>(
    () => ({
      type: "pie",
      renderer: "canvas",
      data: {
        values: normalizedBrowsers,
      },
      valueField: "value",
      categoryField: "name",
      outerRadius: 0.8,
      innerRadius: 0.5,
      label: {
        visible: true,
        position: "outside",
        style: {
          fontSize: 12,
          lineHeight: 12,
        },
        line: {
          style: {
            lineWidth: 1,
            stroke: { type: "palette", key: "labelStrokeColor" },
          },
        },
      },
      pie: {
        style: {
          cornerRadius: 4,
        },
        state: {
          hover: {
            outerRadius: 0.82,
            stroke: "#fff",
            lineWidth: 2,
          },
        },
        orient: "right",
        item: {
          shape: {
            style: {
              symbolType: "circle",
            },
          },
        },
      },
    }),
    [normalizedBrowsers],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-40 items-center justify-center text-destructive">
        <p>Failed to load blocked domain summary</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        <p>No blocked domain data available</p>
      </div>
    );
  }

  const { totalBlockedAttempts, uniqueBlockedDomains, uniqueDevicesBlocked } =
    data;

  // Only render on client side
  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Row: Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Total Blocked Attempts */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">
              Total Blocked
            </h4>
            <ShieldAlert className="h-5 w-5 text-destructive" />
          </div>
          <p className="mt-2 text-2xl font-bold">
            {totalBlockedAttempts.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {uniqueBlockedDomains.toLocaleString()} unique domains
          </p>
        </div>

        {/* Unique Devices Blocked */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">
              Devices Blocked
            </h4>
            <Shield className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold">
            {uniqueDevicesBlocked.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            Unique devices with blocks
          </p>
        </div>

        {/* Top Category */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">
              Top Category
            </h4>
            <Shield className="h-5 w-5 text-amber-500" />
          </div>
          {topCategory ? (
            <>
              <p
                className="mt-2 line-clamp-1 text-2xl font-bold"
                title={topCategory.name}
              >
                {topCategory.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {topCategory.percentage}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No data available
            </p>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Categories Bar Chart */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="mb-4 text-sm font-medium">Top Categories</h4>
          <div className="h-80 w-full">
            <VChart
              spec={categoryChartSpec}
              options={{
                autoFit: true,
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>

        {/* Browsers Pie Chart */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="mb-4 text-sm font-medium">Browsers</h4>
          <div className="h-80 w-full">
            <VChart
              spec={browserChartSpec}
              options={{
                autoFit: true,
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
