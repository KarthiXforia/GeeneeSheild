"use client";

import {
  Accessibility,
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CheckCheck,
  Tablet,
} from "lucide-react";
import { useState } from "react";
import Container from "@/components/container";
import { metrics } from "@/data/metrics";
import { cn } from "@/lib/utils";

type RegionType = "all" | "state" | "district" | "university";
type Region = string;

const iconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  "Total Enrolled Devices": Tablet,
  "Devices in Kiosk Mode": Tablet,
  "Activation Success Rate": CheckCheck,
  "Accessibility Enabled": Accessibility,
};

export default function EnrolledDevicesMetrics() {
  const [_regionType, _setRegionType] = useState<RegionType>("all");
  const [_selectedRegion, _setSelectedRegion] = useState<Region>("");

  // Use the metrics data as is for now
  // In a real implementation, you would filter this based on regionType and selectedRegion

  return (
    <Container className="grid grid-cols-1 gap-y-6 border-b border-border py-4 phone:grid-cols-2 laptop:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = iconMap[metric.title] || Activity;
        return (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={<Icon className="h-5 w-5" />}
          />
        );
      })}
    </Container>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon,
  className,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col", className)}>
      <div className="mb-1 flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl font-medium">{value}</span>
        <ChangeIndicator change={change} />
      </div>
      <div className="text-xs text-muted-foreground">Compare to last month</div>
    </section>
  );
}

function ChangeIndicator({ change }: { change: number }) {
  return (
    <span
      className={cn(
        "flex items-center rounded-sm px-1 py-0.5 text-xs text-muted-foreground",
        change > 0
          ? "bg-green-50 text-green-500 dark:bg-green-950"
          : "bg-red-50 text-red-500 dark:bg-red-950",
      )}
    >
      {change > 0 ? "+" : ""}
      {Math.round(change * 100)}%
      {change > 0 ? (
        <ArrowUpRight className="ml-0.5 inline-block h-3 w-3" />
      ) : (
        <ArrowDownRight className="ml-0.5 inline-block h-3 w-3" />
      )}
    </span>
  );
}
